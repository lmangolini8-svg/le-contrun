/* Parcours de Sarlande à l'échelle de l'atlas, dans Chromium.
   Du clos, traverser la ville à pied : maison → Drapiers → imprimerie → halles → quai → maison.
   Vérifie que chaque étape est reliée par des cellules praticables (recherche en largeur sur la grille
   de marche, pas de 0,5 m), marche au clavier, contrôle les pieds au sol et la pente des pas,
   recharge la page dans la ville, puis entre à l'atelier par la porte de l'imprimerie.
   Usage : node outils/tests/ville_parcours.js [dossier_captures] */
const { chromium } = require("playwright");
const path = require("path"), fs = require("fs");
const RACINE = path.resolve(__dirname, "../..");
const SP = process.argv[2] || ".";
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".mp3": "audio/mpeg", ".glb": "model/gltf-binary", ".woff2": "font/woff2", ".css": "text/css" };

let errs = [];
(async () => {
  const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const ctx = await b.newContext({ viewport: { width: 900, height: 640 }, deviceScaleFactor: 1 });
  await ctx.route("http://sarlande.test/**", r => {
    const f = path.join(RACINE, decodeURIComponent(new URL(r.request().url()).pathname));
    if (!f.startsWith(RACINE) || !fs.existsSync(f)) return r.fulfill({ status: 404, body: "" });
    r.fulfill({ status: 200, path: f, contentType: TYPES[path.extname(f)] || "application/octet-stream" });
  });
  const p = await ctx.newPage(); errs = [];
  p.on("pageerror", e => errs.push(e.message)); p.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
  const ok = (c, msg) => { if (!c) throw new Error("ÉCHEC : " + msg); console.log("ok ·", msg); };
  const attendre = async (cond, ms = 40000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await p.evaluate(cond)) return; await p.waitForTimeout(250); } throw new Error("attente : " + cond); };
  const page = async () => { await attendre(() => mode === "plate" && plateReady); await p.click("#plate"); await attendre(() => mode !== "plate" && mode !== "turn"); await p.waitForTimeout(600); };
  const finir = async () => { for (let i = 0; i < 40 && await p.evaluate(() => document.getElementById("dlg").style.display === "block" && !document.querySelector("#dlg [data-c]")); i++) { await p.click("#dlg"); await p.waitForTimeout(150); } };
  const agir = async lab => { await p.evaluate(l => { const it = INTER.find(x => x.label === l && (!x.can || x.can())); if (!it) throw new Error("pas d’interaction " + l); const q = it.p(); player.position.set(q.x, player.position.y, q.z); it.act(); }, lab); await p.waitForTimeout(300); };
  const cap = n => p.screenshot({ path: `${SP}/ville_${n}.png` });

  await p.addInitScript(() => { try { const k = "sarlande-acte1-v1"; const d = JSON.parse(localStorage.getItem(k) || "{}"); d.lite = true; localStorage.setItem(k, JSON.stringify(d)); } catch (e) {} });
  await p.goto("http://sarlande.test/index.html"); await p.waitForTimeout(4000);
  await p.click('[data-a="new"]'); await page(); await finir();
  await p.evaluate(() => { Vie.V().tenue = "ocre"; Vie.V().recit.lettre = "lue"; });

  await agir("Traverser la ville à pied"); await attendre(() => mode === "play" && Ville.enVille());
  ok(await p.evaluate(() => zoneOf() === "ville"), "Aliénor est dans la ville à l’échelle");
  await p.waitForTimeout(500); await cap("01_clos");

  // Les étapes du premier trajet sont reliées à pied (recherche en largeur sur la grille de marche).
  const etapes = await p.evaluate(() => {
    const P = Ville.PORTES, d = id => P[id].dehors;
    return [["maison", d("maison")], ["Drapiers", { X: 278, Y: 396 }], ["imprimerie", d("presse")], ["halles", { X: 362, Y: 443 }], ["quai", { X: 349, Y: 469 }], ["maison", d("maison")]];
  });
  for (let i = 1; i < etapes.length; i++) {
    const r = await p.evaluate(([a, b]) => {
      const R = 0.5, k = (X, Y) => Math.round(X / R) + "," + Math.round(Y / R);
      const start = [Math.round(a.X / R) * R, Math.round(a.Y / R) * R], goal = k(b.X, b.Y), vu = new Map([[k(...start), null]]), file = [start];
      while (file.length) {
        const [X, Y] = file.shift();
        if (Math.hypot(X - b.X, Y - b.Y) < 1.2) { let n = 0, c = k(X, Y), pente = 0, prev = null; const pts = []; while (c) { const [cx, cy] = c.split(",").map(v => v * R); pts.push([cx, cy]); c = vu.get(c); n++; }
          for (let j = 1; j < pts.length; j++) { const h0 = Ville.sol(...pts[j - 1]), h1 = Ville.sol(...pts[j]); pente = Math.max(pente, Math.abs(h1 - h0) / (Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]))); }
          return { metres: n * R, pente }; }
        for (const [dx, dy] of [[R, 0], [-R, 0], [0, R], [0, -R]]) { const nX = X + dx, nY = Y + dy, kk = k(nX, nY); if (vu.has(kk) || !Ville.praticable(nX, nY) || Math.abs(Ville.sol(nX, nY) - Ville.sol(X, Y)) > Ville.PAS_MAX * R) continue; vu.set(kk, k(X, Y)); file.push([nX, nY]); }
      }
      return null;
    }, [etapes[i - 1][1], etapes[i][1]]);
    ok(r, `${etapes[i - 1][0]} → ${etapes[i][0]} : ${r ? Math.round(r.metres) + " m à pied, pas le plus raide " + Math.round(r.pente * 100) + " %" : "aucun chemin"}`);
  }

  // Marche au clavier : on avance, les pieds restent au sol.
  const avant = await p.evaluate(() => ({ x: player.position.x, z: player.position.z }));
  await p.keyboard.down("ArrowUp"); await p.waitForTimeout(1500); await p.keyboard.up("ArrowUp");
  await p.keyboard.down("ArrowLeft"); await p.waitForTimeout(1500); await p.keyboard.up("ArrowLeft");
  const apres = await p.evaluate(() => ({ x: player.position.x, z: player.position.z, y: player.position.y, sol: Ville.solScene(player.position.x, player.position.z) }));
  ok(Math.hypot(apres.x - avant.x, apres.z - avant.z) > 1, `marche au clavier (${Math.hypot(apres.x - avant.x, apres.z - avant.z).toFixed(1)} m)`);
  ok(Math.abs(apres.y - apres.sol) < 0.05, `pieds au sol (y ${apres.y.toFixed(2)}, sol ${apres.sol.toFixed(2)})`);
  await cap("02_marche");

  // Aller jusqu'à la place, regarder les halles.
  await p.evaluate(() => { const q = Ville.versScene(355, 432); player.position.set(q.x, q.y, q.z); player.rotation.y = Math.PI; snapCam(); });
  await p.waitForTimeout(1200); await cap("03_place");
  await p.evaluate(() => { const q = Ville.versScene(330, 466); player.position.set(q.x, q.y, q.z); player.rotation.y = Math.PI / 2; snapCam(); });
  await p.waitForTimeout(1200); await cap("04_quai");

  // Recharger dans la ville : on reprend au même endroit.
  await p.evaluate(() => { const q = Ville.versScene(300, 418); player.position.set(q.x, q.y, q.z); save(); });
  await p.reload(); await p.waitForTimeout(4000);
  ok(await p.evaluate(() => Ville.enVille()), "après rechargement, la position est dans la ville");
  await p.click('[data-a="continue"], [data-a="cont"], [data-a="play"]').catch(() => {});
  await p.evaluate(() => { if (mode === "title") startPlay(false); });
  await attendre(() => mode === "play");
  ok(await p.evaluate(() => Math.abs(player.position.y - Ville.solScene(player.position.x, player.position.z)) < 0.05), "reprise : pieds au sol");

  // La boutique du tailleur, puis l'atelier par la porte de l'imprimerie.
  await agir("Le tailleur"); ok(await p.evaluate(() => mode === "panel"), "vitrine du tailleur"); await p.click('[data-v="fermer"]');
  await agir("Entrer à l’atelier"); await attendre(() => document.getElementById("dlg").style.display === "block");
  for (let i = 0; i < 10; i++) {
    const k = await p.$$eval("#dlg [data-c]", bs => bs.findIndex(x => x.textContent.includes("Entrer à l’atelier")));
    if (k >= 0) { await p.click(`#dlg [data-c="${k}"]`); break; }
    await p.click("#dlg"); await p.waitForTimeout(200);
  }
  await attendre(() => (mode === "sequence" || mode === "play") && !Ville.enVille(), 40000);
  ok(await p.evaluate(() => player.position.y === 0 && player.position.x < 100), "entrée à l’atelier, sur la place des actes I et II");

  ok(!errs.length, "aucune erreur dans la page" + (errs.length ? " : " + errs.join(" | ") : ""));
  await b.close();
})().catch(e => { console.error(e.message); if (errs.length) console.error("erreurs de la page :", errs.join(" | ")); process.exit(1); });
