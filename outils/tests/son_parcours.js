/* Le son du premier parcours dans Chromium : à chaque étape de la première journée, relève la musique
   et les ambiances qui jouent réellement, puis vérifie les seuils, la reprise après interruption et
   la tenue du jeu quand un fichier manque (amb-fournil est volontairement refusé).
   Les fichiers du dépôt sont servis par Playwright lui-même, sans serveur.
   Usage : node outils/tests/son_parcours.js [dossier_captures] [A|B] */
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const path = require("path"), fs = require("fs");
const RACINE = path.resolve(__dirname, "../..");
const SP = process.argv[2] || ".", VOIE = process.argv[3] || "A";
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".mp3": "audio/mpeg", ".glb": "model/gltf-binary", ".woff2": "font/woff2", ".css": "text/css" };

(async () => {
  const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const ctx = await b.newContext({ viewport: { width: 900, height: 640 }, deviceScaleFactor: 1 });
  let retraitsFournil = 0;
  await ctx.route("http://sarlande.test/**", r => {
    const f = path.join(RACINE, decodeURIComponent(new URL(r.request().url()).pathname));
    if (f.endsWith("amb-fournil.mp3")) { retraitsFournil++; return r.fulfill({ status: 404, body: "" }); }
    if (!f.startsWith(RACINE) || !fs.existsSync(f)) return r.fulfill({ status: 404, body: "" });
    r.fulfill({ status: 200, path: f, contentType: TYPES[path.extname(f)] || "application/octet-stream" });
  });
  const p = await ctx.newPage(), errs = [];
  p.on("pageerror", e => errs.push(e.message));
  const log = (...a) => { fs.appendFileSync(`${SP}/son_${VOIE}.txt`, a.join(" ") + "\n"); console.log(...a); };
  const etat = async t => log(t, JSON.stringify(await p.evaluate(() => ({ mode, zone: zoneOf(), t: S.vie.t, etape: S.vie.recit.etape, stage: S.stage, act: S.act, bourse: S.vie.bourse, barres: S.vie.barres, recit: S.vie.recit }))));
  const son = async t => { await p.waitForTimeout(4500); log("♪", t, JSON.stringify(await p.evaluate(() => ({ ctx: Snd.ctx && Snd.ctx.state, voulu: musicNow(), musique: Snd.musKey,
    joue: Snd.mus.filter(m => !m.dead).map(m => m.name), ambiances: Object.entries(Snd.amb).filter(([k, v]) => v.src && v.g.gain.value > 0.02).map(([k, v]) => k + " " + v.g.gain.value.toFixed(2)) })))); };
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
  const ouvrirTitre = async action => {
    await p.locator(`[data-a="${action}"]`).waitFor();
    // Cette recette laisse tourner le jeu et Web Audio, sans charger le GPU logiciel.
    await p.evaluate(() => { renderFrame = () => {}; });
  };
  await p.goto("http://sarlande.test/index.html");
  await ouvrirTitre("new");
  await p.click('[data-a="new"]');
  await page(); await finir(); await etat("réveil"); await son("réveil, dans la maison");
  const voletsDebut = await p.evaluate(() => Snd.mus.find(m => m.name === "mus-volets" && !m.dead)?.at);
  assert.ok(Number.isFinite(voletsDebut), "Le thème du réveil joue");
  await agir("Les volets"); await p.waitForTimeout(500);
  await p.evaluate(() => { const q = O.clos; player.position.set(q[0] - 11, 0, q[1] - 3.6); }); await son("réveil, dans la cour du clos, près du puits");
  for (let i = 0; i < 6; i++) { await p.evaluate(i => { const q = O.clos; player.position.set(q[0] + (i % 2 ? -3.5 : -4.8), 0, q[1] + 0.6); }, i); await p.waitForTimeout(700); }
  await son("après six allers-retours rapides sur le seuil de la maison");
  assert.equal(await p.evaluate(() => Snd.mus.find(m => m.name === "mus-volets" && !m.dead)?.at), voletsDebut);
  await agir("Lire la lettre"); await p.click('[data-v="lettre-garder"]');
  await agir("Le miroir"); await p.click('[data-v="essayer"][data-r="indigo"]'); await p.click('[data-v="choisir-robe"]');
  await agir("Le puits des voisins"); await finir();
  await agir("Frapper chez Ysabeau"); await choisir("Repasser"); await finir();
  await agir("Entrer à l’atelier"); await choisir("Entrer à l’atelier");
  await attendre(() => mode === "sequence" || mode === "play", 40000);
  if (await p.evaluate(() => mode === "sequence")) await p.click("#cutSkip");
  await attendre(() => mode === "play", 40000); await etat("atelier"); await son("imprimerie, avant la cloche");
  await agir("Parler à Anselme"); await choisir("J’y vais"); await finir(); await finir(); await etat("après Anselme"); await son("place, la cloche a sonné");
  await p.evaluate(() => player.position.set(N.maelle.position.x + 1, 0, N.maelle.position.z + 1)); await son("devant le fournil (fichier absent)");
  assert.ok(retraitsFournil > 0, "Le test a interrompu le fichier du fournil");
  assert.deepEqual(await p.evaluate(() => [mode, Snd.ctx.state, !!Snd.amb.fournil?.src]), ["play", "running", false]);
  await agir("Parler à Maëlle");
  if (VOIE === "A") { await choisir("devant les clientes"); await finir(); }
  else { await choisir("Acheter une miche"); await finir(); await choisir("Rien pour l’instant"); await finir(); }
  await agir("Le tableau des commandes"); 
  await p.click('[data-v="travail"][data-w="bon"]'); await p.click('[data-v="exo"][data-i="0"]'); await p.click('[data-v="exo"][data-i="1"]'); await finir(); await etat("après le bon");
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
  await p.mouse.click(450, 120);
  await attendre(() => Snd.ctx.state === "running");
  log("♪ après un toucher :", await p.evaluate(() => Snd.ctx.state));
  // Reprise : on recharge la page au milieu du lendemain.
  await p.reload({ waitUntil: "domcontentloaded", timeout: 90000 }); await ouvrirTitre("resume"); await p.click('[data-a="resume"]'); await p.waitForTimeout(1500); await etat("reprise"); await son("après rechargement de la page");
  await agir("Ouvrir la porte"); await choisir("Ouvrir et la faire entrer"); 
  const dits = []; for (let i = 0; i < 12; i++) { const t = await p.$eval("#dlg", d => d.innerText).catch(() => ""); dits.push(t.replace(/\s+/g, " ").slice(0, 160)); if (await p.$("#dlg [data-c]")) { await p.click('#dlg [data-c="0"]'); } else if (await p.evaluate(() => document.getElementById("dlg").style.display === "block")) await p.click("#dlg"); else break; await p.waitForTimeout(200); }
  log("visite :\n  " + dits.join("\n  "));
  await etat("fin");
  assert.deepEqual(errs, [], "Pas d’erreur JavaScript pendant la recette audio");
  await b.close();
})().catch(e => { fs.appendFileSync(`${SP}/son_${VOIE}.txt`, "ÉCHEC " + e.message + "\n"); console.error("ÉCHEC", e.message); process.exit(1); });
