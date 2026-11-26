/* Le son du premier parcours dans Chromium : à chaque étape de la première journée, relève la musique,
   les ambiances qui jouent réellement et les cloches sonnées, puis vérifie les seuils, la reprise après
   interruption et la tenue du jeu quand un fichier manque (amb-fournil est volontairement refusé).
   Les fichiers du dépôt sont servis par Playwright lui-même, sans serveur.
   Usage : node outils/tests/son_parcours.js [dossier_captures] [A|B] */
const { chromium } = require("playwright");
const path = require("path"), fs = require("fs");
const RACINE = path.resolve(__dirname, "../..");
const SP = process.argv[2] || ".", VOIE = process.argv[3] || "A";
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".mp3": "audio/mpeg", ".glb": "model/gltf-binary", ".woff2": "font/woff2", ".css": "text/css" };

(async () => {
  const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const ctx = await b.newContext({ viewport: { width: 900, height: 640 }, deviceScaleFactor: 1 });
  await ctx.route("http://sarlande.test/**", r => {
    const f = path.join(RACINE, decodeURIComponent(new URL(r.request().url()).pathname));
    if (!f.startsWith(RACINE) || !fs.existsSync(f) || f.endsWith("amb-fournil.mp3")) return r.fulfill({ status: 404, body: "" });
    r.fulfill({ status: 200, path: f, contentType: TYPES[path.extname(f)] || "application/octet-stream" });
  });
  const p = await ctx.newPage(), errs = [];
  p.on("pageerror", e => errs.push(e.message)); p.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
  const log = (...a) => { fs.appendFileSync(`${SP}/son_${VOIE}.txt`, a.join(" ") + "\n"); console.log(...a); };
  const etat = async t => log(t, JSON.stringify(await p.evaluate(() => ({ mode, zone: zoneOf(), t: S.vie.t, etape: S.vie.recit.etape, stage: S.stage, act: S.act, bourse: S.vie.bourse, barres: S.vie.barres, recit: S.vie.recit }))));
  const son = async t => { await p.waitForTimeout(4500); log("♪", t, JSON.stringify(await p.evaluate(() => ({ ctx: Snd.ctx && Snd.ctx.state, voulu: musicNow(), musique: Snd.musKey,
    joue: Snd.mus.filter(m => !m.dead).map(m => m.name), ambiances: Object.entries(Snd.amb).filter(([k, v]) => v.src && v.g.gain.value > 0.02).map(([k, v]) => k + " " + v.g.gain.value.toFixed(2)),
    cloches: (Snd.cloches || []).splice(0) })))); };
  const cap = async n => p.screenshot({ path: `${SP}/${VOIE}_${n}.png` });
  const attendre = async (cond, ms = 20000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await p.evaluate(cond)) return true; await p.waitForTimeout(250); } throw new Error("attente : " + cond); };
  // Lance une interaction par son libellé, comme si le joueur avait touché le bouton d'action.
  const agir = async lab => { log("·", lab); await p.evaluate(l => { const it = INTER.find(x => x.label === l && (!x.can || x.can())); if (!it) throw new Error("pas d’interaction " + l); const q = it.p(); player.position.set(q.x, 0, q.z + 0.6); it.act(); }, lab); await p.waitForTimeout(300); };
  // Avance le dialogue jusqu'à un choix ou la fin, puis choisit le libellé qui contient `txt`.
  const choisir = async txt => { log("  →", txt);
    await attendre(() => document.getElementById("dlg").style.display === "block" || mode === "sequence", 30000);
    if (await p.evaluate(() => mode === "sequence")) { await p.click("#cutSkip").catch(() => {}); await attendre(() => document.getElementById("dlg").style.display === "block", 30000); }
    for (let i = 0; i < 40; i++) {
      const c = await p.$$eval("#dlg [data-c]", bs => bs.map(x => x.textContent));
      if (c.length) { const k = c.findIndex(x => x.includes(txt)); if (k < 0) throw new Error(`choix « ${txt} » absent : ${c.join(" | ")}`); await p.click(`#dlg [data-c="${k}"]`); await p.waitForTimeout(250); return; }
      if (!(await p.evaluate(() => document.getElementById("dlg").style.display === "block"))) throw new Error("plus de dialogue avant « " + txt + " »");
      await p.click("#dlg"); await p.waitForTimeout(150);
    }
  };
  const finir = async () => { for (let i = 0; i < 40 && await p.evaluate(() => document.getElementById("dlg").style.display === "block" && !document.querySelector("#dlg [data-c]")); i++) { await p.click("#dlg"); await p.waitForTimeout(150); } };
  const page = async () => { await attendre(() => mode === "plate" && plateReady, 40000); await p.click("#plate"); await attendre(() => mode !== "plate" && mode !== "turn"); await p.waitForTimeout(800); };

  await p.addInitScript(() => { try { const k = "sarlande-acte1-v1"; const d = JSON.parse(localStorage.getItem(k) || "{}"); d.lite = true; localStorage.setItem(k, JSON.stringify(d)); } catch (e) {} });
  await p.goto("http://sarlande.test/index.html"); await p.waitForTimeout(4000);
  await p.click('[data-a="new"]');
  await page(); await finir(); await etat("réveil"); await son("réveil, dans la maison");
  await agir("Les volets"); await p.waitForTimeout(500);
  await p.evaluate(() => { const q = O.clos; player.position.set(q[0] - 10, 0, q[1] - 2.5); }); await son("réveil, dans la cour du clos, près du puits");
  for (let i = 0; i < 6; i++) { await p.evaluate(i => { const q = O.clos; player.position.set(q[0] + (i % 2 ? -2 : -6), 0, q[1] + 0.6); }, i); await p.waitForTimeout(700); }
  await son("après six allers-retours rapides sur le seuil de la maison");
  await agir("Lire la lettre"); await p.click('[data-v="lettre-garder"]');
  await agir("Le miroir"); await p.click('[data-v="essayer"][data-r="indigo"]'); await p.click('[data-v="choisir-robe"]');
  await agir("Le puits des voisins"); await finir();
  await agir("Frapper chez Ysabeau"); await choisir("Repasser"); await finir();
  await agir("Le tailleur"); await p.click('[data-v="fermer"]'); await son("rue des Drapiers, devant le tailleur");
  await agir("Entrer à l’atelier"); await choisir("Entrer à l’atelier");
  await attendre(() => mode === "sequence" || mode === "play", 40000); await p.click("#cutSkip").catch(() => {}); await attendre(() => mode === "play", 40000); await etat("atelier"); await son("imprimerie, avant la cloche");
  await agir("Parler à Anselme"); await choisir("J’y vais"); await finir(); await finir(); await etat("après Anselme"); await son("place, la cloche a sonné");
  await p.evaluate(() => player.position.set(N.maelle.position.x + 1, 0, N.maelle.position.z + 1)); await son("devant le fournil (fichier absent)");
  await agir("Parler à Maëlle");
  if (VOIE === "A") { await choisir("devant les clientes"); await finir(); }
  else { await choisir("Acheter une miche"); await finir(); await choisir("Rien pour l’instant"); await finir(); }
  await agir("Le tableau des commandes");
  await p.click('[data-v="travail"][data-w="bon"]'); await p.click('[data-v="exo"][data-i="0"]'); await p.click('[data-v="exo"][data-i="1"]'); await finir(); await etat("après le bon"); await son("après la commande, le temps a avancé");
  await agir("Parler au percepteur"); await choisir("Payer la mesure"); await finir(); await etat("après tribut"); await son("place, tribut payé");
  // Saut narratif jusqu'à la fin de l'acte I pour tester le soir (les scènes de l'acte I sont couvertes par la PR iPad).
  await p.evaluate(() => { setStage(6); closePanel(); mode = "play"; refreshHud(); });
  await agir("Parler à Anselme"); await choisir("Rentrer au clos"); await page(); await finir(); await etat("soir"); await son("soir au clos");
  await agir("Préparer un repas"); await choisir(""); await finir();
  await agir("Rejoindre la fête"); await choisir("Aller à la fête");
  await page(); await finir(); await etat("fête"); await son("fête, acte II");
  await p.evaluate(() => { setStage(16); showEnd2(); });
  await p.click('[data-v="rentrer-nuit"]'); await page(); await finir();
  await agir("Le lit"); await choisir("Dormir"); await attendre(() => mode !== "turn", 60000); await finir(); await etat("lendemain"); await son("lendemain au clos");
  await p.evaluate(() => Snd.ctx.suspend()); await p.waitForTimeout(500); log("♪ interruption simulée :", await p.evaluate(() => Snd.ctx.state));
  await p.mouse.click(450, 120); await p.waitForTimeout(800); log("♪ après un toucher :", await p.evaluate(() => Snd.ctx.state));
  // Reprise : on recharge la page au milieu du lendemain.
  await p.reload(); await p.waitForTimeout(4000); await p.click('[data-a="resume"]'); await p.waitForTimeout(1500); await etat("reprise"); await son("après rechargement de la page");
  await agir("Ouvrir la porte"); await choisir("Ouvrir et la faire entrer");
  const dits = []; for (let i = 0; i < 12; i++) { const t = await p.$eval("#dlg", d => d.innerText).catch(() => ""); dits.push(t.replace(/\s+/g, " ").slice(0, 160)); if (await p.$("#dlg [data-c]")) { await p.click('#dlg [data-c="0"]'); } else if (await p.evaluate(() => document.getElementById("dlg").style.display === "block")) await p.click("#dlg"); else break; await p.waitForTimeout(200); }
  log("visite :\n  " + dits.join("\n  "));
  await etat("fin");
  log("erreurs", JSON.stringify(errs));
  await b.close();
})().catch(e => { fs.appendFileSync(`${SP}/son_${VOIE}.txt`, "ÉCHEC " + e.message + "\n"); console.error("ÉCHEC", e.message); process.exit(1); });
