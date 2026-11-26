/* Parcours de la première journée dans Chromium : réveil au clos, lettre, miroir, puits,
   trajet, prise de poste, commande, courses, tribut, soir, nuit, lendemain.
   Les fichiers du dépôt sont servis par Playwright lui-même, sans serveur.
   Usage : node outils/tests/premiere_journee.js [dossier_captures] [A|B] */
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
    if (!f.startsWith(RACINE) || !fs.existsSync(f)) return r.fulfill({ status: 404, body: "" });
    r.fulfill({ status: 200, path: f, contentType: TYPES[path.extname(f)] || "application/octet-stream" });
  });
  const p = await ctx.newPage(), errs = [];
  p.on("pageerror", e => errs.push(e.message)); p.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
  const log = (...a) => { fs.appendFileSync(`${SP}/journal_${VOIE}.txt`, a.join(" ") + "\n"); console.log(...a); };
  const etat = async t => log(t, JSON.stringify(await p.evaluate(() => ({ mode, zone: zoneOf(), t: S.vie.t, etape: S.vie.recit.etape, stage: S.stage, act: S.act, bourse: S.vie.bourse, barres: S.vie.barres, recit: S.vie.recit }))));
  const cap = async n => p.screenshot({ path: `${SP}/${VOIE}_${n}.png` });
  const attendre = async (cond, ms = 20000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await p.evaluate(cond)) return true; await p.waitForTimeout(250); } throw new Error("attente : " + cond); };
  // Lance une interaction par son libellé, comme si le joueur avait touché le bouton d'action.
  const agir = async lab => { log("·", lab); await p.evaluate(l => { const it = INTER.find(x => x.label === l && (!x.can || x.can())); if (!it) throw new Error("pas d’interaction " + l); const q = it.p(); player.position.set(q.x, 0, q.z + 0.6); it.act(); }, lab); await p.waitForTimeout(300); };
  // Les gestes d’Anselme interrompent certaines répliques par une cinématique.
  const passerScene = async () => {
    if (!await p.evaluate(() => mode === "sequence")) return false;
    await p.locator("#cutSkip").click();
    return true;
  };
  const choisir = async txt => {
    log("  →", txt);
    await attendre(() => mode === "dialog" || mode === "sequence", 30000);
    for (let i = 0; i < 40; i++) {
      if (await passerScene()) continue;
      if (!await p.evaluate(() => mode === "dialog")) throw new Error("Dialogue terminé avant « " + txt + " »");
      const boutons = p.locator("#dlg [data-c]");
      if (await boutons.count()) {
        const choix = boutons.filter({ hasText: txt }).first();
        if (await choix.count() === 0) throw new Error(`Choix « ${txt} » absent : ${(await boutons.allTextContents()).join(" | ")}`);
        await choix.click();
        return;
      }
      await p.locator("#dlg").click();
    }
    throw new Error("Trop de répliques avant « " + txt + " »");
  };
  const finir = async () => {
    for (let i = 0; i < 40; i++) {
      if (await passerScene()) continue;
      if (!await p.evaluate(() => mode === "dialog") || await p.locator("#dlg [data-c]").count()) return;
      await p.locator("#dlg").click();
    }
    throw new Error("Dialogue inachevé");
  };
  const page = async () => { await attendre(() => mode === "plate" && plateReady, 40000); await p.click("#plate"); await attendre(() => mode !== "plate" && mode !== "turn"); await p.waitForTimeout(800); };

  await p.addInitScript(() => { try { const k = "sarlande-acte1-v1"; const d = JSON.parse(localStorage.getItem(k) || "{}"); d.lite = true; localStorage.setItem(k, JSON.stringify(d)); } catch (e) {} });
  await p.goto("http://sarlande.test/index.html"); await p.waitForTimeout(4000);
  await p.click('[data-a="new"]');
  await page(); await finir(); await etat("réveil"); await cap("01_clos");
  await agir("Les volets"); await p.waitForTimeout(500);
  await agir("Lire la lettre"); await cap("02_lettre"); await p.click('[data-v="lettre-garder"]');
  await agir("Le miroir"); await p.click('[data-v="essayer"][data-r="indigo"]'); await cap("03_miroir"); await p.click('[data-v="choisir-robe"]');
  await agir("Le puits des voisins"); await finir();
  await agir("Frapper chez Ysabeau"); await choisir("Repasser"); await finir();
  await agir("Le tailleur"); await cap("02b_vitrine"); await p.click('[data-v="fermer"]');
  await agir("Entrer à l’atelier"); await choisir("Entrer à l’atelier");
  await attendre(() => mode === "sequence" || mode === "play", 40000); await passerScene(); await attendre(() => mode === "play", 40000); await etat("atelier");
  await agir("Parler à Anselme"); await choisir("J’y vais"); await finir(); await finir(); await etat("après Anselme"); await cap("04_place");
  await agir("Parler à Maëlle");
  if (VOIE === "A") { await choisir("devant les clientes"); await finir(); }
  else { await choisir("Acheter une miche"); await finir(); await choisir("Rien pour l’instant"); await finir(); }
  await agir("Le tableau des commandes"); await cap("05_tableau");
  await p.click('[data-v="travail"][data-w="bon"]'); await p.click('[data-v="exo"][data-i="0"]'); await p.click('[data-v="exo"][data-i="1"]'); await finir(); await etat("après le bon");
  await agir("Parler au percepteur"); await choisir("Payer la mesure"); await finir(); await etat("après tribut");
  // Saut narratif jusqu'à la fin de l'acte I pour tester le soir (les scènes de l'acte I sont couvertes par la PR iPad).
  await p.evaluate(() => { setStage(6); closePanel(); mode = "play"; refreshHud(); });
  await agir("Parler à Anselme"); await choisir("Rentrer au clos"); await page(); await finir(); await etat("soir"); await cap("06_soir");
  await agir("Préparer un repas"); await choisir(""); await finir();
  await agir("Rejoindre la fête"); await choisir("Aller à la fête");
  await page(); await finir(); await etat("fête");
  await p.evaluate(() => { setStage(16); showEnd2(); });
  await p.click('[data-v="rentrer-nuit"]'); await page(); await finir();
  await agir("Le lit"); await choisir("Dormir"); await attendre(() => mode !== "turn", 60000); await finir(); await etat("lendemain"); await cap("07_lendemain");
  // Reprise : on recharge la page au milieu du lendemain.
  await p.reload({ waitUntil: "domcontentloaded", timeout: 90000 }); await p.click('[data-a="resume"]'); await p.waitForTimeout(1500); await etat("reprise");
  await agir("Ouvrir la porte"); await choisir("Ouvrir et la faire entrer"); await cap("08_visite");
  const dits = []; for (let i = 0; i < 12; i++) { const t = await p.$eval("#dlg", d => d.innerText).catch(() => ""); dits.push(t.replace(/\s+/g, " ").slice(0, 160)); if (await p.$("#dlg [data-c]")) { await p.click('#dlg [data-c="0"]'); } else if (await p.evaluate(() => document.getElementById("dlg").style.display === "block")) await p.click("#dlg"); else break; await p.waitForTimeout(200); }
  log("visite :\n  " + dits.join("\n  "));
  await etat("fin");
  await p.evaluate(() => showCarnet()); await p.waitForTimeout(500); await cap("09_carnet");
  log("carnet :", (await p.$eval(".vie-carnet", e => e.innerText).catch(() => "absent")).replace(/\s+/g, " "));
  log("erreurs", JSON.stringify(errs));
  await b.close();
})().catch(e => { fs.appendFileSync(`${SP}/journal_${VOIE}.txt`, "ÉCHEC " + e.message + "\n"); console.error("ÉCHEC", e.message); process.exit(1); });
