/* La fête de l'acte II joue trois danses à tour de rôle : gaillarde, ronde, tourdion, puis de nouveau la gaillarde.
   Pour ne pas attendre quatre minutes et demie, chaque morceau est avancé jusqu'à son fondu de sortie.
   Usage : node outils/tests/son_fete.js */
const { chromium } = require("playwright");
const path = require("path"), fs = require("fs");
const RACINE = path.resolve(__dirname, "../..");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".mp3": "audio/mpeg", ".glb": "model/gltf-binary", ".woff2": "font/woff2" };
(async () => {
  const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const ctx = await b.newContext({ viewport: { width: 900, height: 640 } });
  await ctx.route("http://sarlande.test/**", r => { const f = path.join(RACINE, decodeURIComponent(new URL(r.request().url()).pathname));
    if (!f.startsWith(RACINE) || !fs.existsSync(f)) return r.fulfill({ status: 404, body: "" }); r.fulfill({ status: 200, path: f, contentType: TYPES[path.extname(f)] || "application/octet-stream" }); });
  const p = await ctx.newPage(), errs = []; p.on("pageerror", e => errs.push(e.message));
  await p.addInitScript(() => { try { localStorage.setItem("sarlande-acte1-v1", JSON.stringify({ lite: true })); } catch (e) {} });
  await p.goto("http://sarlande.test/index.html"); await p.waitForTimeout(4000); await p.click('[data-a="new"]');
  const attendre = async (cond, ms = 40000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await p.evaluate(cond)) return; await p.waitForTimeout(250); } throw new Error("attente : " + cond); };
  // Passer les planches d'ouverture jusqu'à ce que le jeu reste en exploration trois secondes.
  for (let calme = 0, t0 = Date.now(); calme < 12 && Date.now() - t0 < 60000; ) { const m = await p.evaluate(() => mode + (typeof plateReady !== "undefined" && plateReady ? "+" : ""));
    if (m === "plate+") { await p.click("#plate"); calme = 0; } else if (m === "dialog") { await p.click("#dlg").catch(() => {}); calme = 0; } else if (m.startsWith("play")) calme++; else calme = 0; await p.waitForTimeout(250); }
  await p.evaluate(() => { document.getElementById("dlg").style.display = "none"; queue = []; after = null; });
  // Aller sur la place la nuit de la fête, sans la planche qui accompagne une première visite.
  await p.evaluate(() => { zoneShown.place = 1; zoneShown.cour = 1; S.act = 2; S.stage = 11; mode = "play"; setScene(true, "night"); player.position.set(0, 0, 4); });
  await p.waitForTimeout(5000); console.log("état", JSON.stringify(await p.evaluate(() => ({ ctx: Snd.ctx && Snd.ctx.state, mode, voulu: musicNow(), cle: Snd.musKey, mus: Snd.mus.map(m => m.name), zone: zoneOf() }))));
  const suite = [];
  for (let i = 0; i < 4; i++) {
    const t0 = Date.now(); let nom = null;
    while (Date.now() - t0 < 20000) { nom = await p.evaluate(() => { const m = Snd.mus.filter(x => !x.dead && x.key === "branle"); return m.length ? m[m.length - 1].name : null; }); if (nom && nom !== suite[suite.length - 1]) break; await p.waitForTimeout(300); }
    suite.push(nom); console.log("danse", i + 1, ":", nom);
    // avancer : le morceau en cours « se termine » dans 6 s, le suivant doit entrer en fondu
    // En jeu, la danse suivante a une minute et demie pour se charger ; ici on l'attend avant d'avancer.
    await attendre(() => !!Snd.buf[musName("branle", 1)], 20000);
    await p.evaluate(() => { const m = Snd.mus.filter(x => !x.dead && x.key === "branle").pop(); if (m) m.end = Snd.ctx.currentTime + 6; });
  }
  const attendu = ["mus-branle", "mus-ronde", "mus-tourdion", "mus-branle"];
  const ok = JSON.stringify(suite) === JSON.stringify(attendu);
  console.log(ok ? "OK : les trois danses tournent dans l'ordre" : "ÉCHEC : " + JSON.stringify(suite)); console.log("erreurs", JSON.stringify(errs));
  await b.close(); process.exit(ok && !errs.length ? 0 : 1);
})().catch(e => { console.error("ÉCHEC", e.message); process.exit(1); });
