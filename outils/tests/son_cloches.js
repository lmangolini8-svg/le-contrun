/* Les cloches de la cathédrale : quand la journée passe du matin à l'après-midi, midi sonne en entier
   (le carillon, la grande volée et douze coups de bourdon), une seule fois, même après un rechargement.
   Usage : node outils/tests/son_cloches.js */
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
  const cloches = () => p.evaluate(() => (Snd.cloches || []).splice(0));
  await p.waitForTimeout(3000); await cloches();
  await p.evaluate(() => { S.vie.t = Calendrier.tDe(Calendrier.jourDuT(S.vie.t), 1); save(); });
  await p.waitForTimeout(32000); const midi = await cloches();
  const n = k => midi.filter(x => x === k).length;
  console.log("midi :", JSON.stringify(midi.reduce((o, x) => (o[x] = (o[x] || 0) + 1, o), {})));
  const ok1 = midi.some(x => x.startsWith("midi-carillon")) && midi.some(x => x.startsWith("midi-volee")) && n("cloche-bourdon") === 12;
  await p.reload(); await p.waitForTimeout(4000); await p.click('[data-a="resume"]').catch(() => {}); await p.mouse.click(450, 300); await p.waitForTimeout(8000);
  const apres = await cloches(); console.log("après rechargement :", JSON.stringify(apres));
  const ok2 = !apres.some(x => x.startsWith("midi"));
  console.log(ok1 && ok2 ? "OK : midi sonne en entier, une seule fois" : "ÉCHEC"); console.log("erreurs", JSON.stringify(errs));
  await b.close(); process.exit(ok1 && ok2 && !errs.length ? 0 : 1);
})().catch(e => { console.error("ÉCHEC", e.message); process.exit(1); });
