/* Recette minimale du cahier des charges (bible/Refonte_Sarlande.md, partie 8), côté règles.
   Lancer : node --test outils/tests/monde.test.js */
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const Cal = require("../../jeu/calendrier.js");
const M = require("../../jeu/monde.js");

const recharge = vie => JSON.parse(JSON.stringify(vie)); // ce que fait localStorage
const coucher = vie => { M.avancerJusqua(vie, Cal.tDe(M.jour(vie), 2)); return M.dormir(vie); };

test("calendrier julien : Pâques, millésime des actes et jour du tribut", () => {
  assert.deepEqual(Cal.paques(1550), { a: 1550, m: 4, j: 6 });
  assert.deepEqual(Cal.paques(1551), { a: 1551, m: 3, j: 29 });
  const veille = Cal.jourPaques(1551) - 1;
  assert.equal(Cal.millesimeOfficiel(veille), 1550);
  assert.equal(Cal.millesimeOfficiel(veille + 1), 1551);
  assert.equal(Cal.lisible(0).date, "lundi 29 septembre 1550");
  assert.ok(Cal.fetesDuJour(0).includes("le jour du tribut"));
  for (let j = -800; j < 800; j += 37) assert.equal(Cal.jdn(...Object.values(Cal.depuisJdn(Cal.jdn(1550, 9, 29) + j)).reverse()), Cal.jdn(1550, 9, 29) + j);
});

test("A. peser la miche devant les clients : Maëlle vient le lendemain avec un reproche", () => {
  const vie = M.creer();
  assert.ok(M.peserMiche(vie, "public"));
  assert.ok(M.sait(vie, "maelle", "pesee_publique"));
  assert.ok(M.sait(vie, "ysabeau", "miche_legere"), "Ysabeau était sur la place");
  vie.recit.tribut = true;
  coucher(vie);
  assert.equal(M.jour(vie), 1);
  assert.equal(vie.recit.lendemain, "reproche");
  const v = M.visiteEnCours(vie);
  assert.equal(v.hab, "maelle");
  assert.equal(M.lien(vie, "maelle", "alienor").conf < 0, true);
});

test("B. garder la lettre : la question circule hors champ, Maëlle vient pour un autre motif", () => {
  const vie = M.creer();
  vie.recit.lettre = "gardee"; vie.recit.tribut = true;
  M.avancerJusqua(vie, Cal.tDe(0, 2));
  assert.equal(vie.recit.peseeHorsChamp, "perrine");
  assert.ok(M.sait(vie, "maelle", "miche_legere"));
  assert.equal(M.sait(vie, "maelle", "pesee_publique"), null, "Maëlle ne prête pas à Aliénor ce qu'elle n'a pas fait");
  assert.equal(vie.fournisseurs.perrine, "drapiers", "un commerce change de fournisseur");
  M.dormir(vie);
  assert.equal(vie.recit.lendemain, "lire");
  assert.equal(M.visiteEnCours(vie).hab, "maelle");
  assert.equal(M.motifEcart(vie, "ysabeau"), "acheter son pain chez Maëlle, pour qu’on la voie le faire");
});

test("pesée en privé : confidence et bon de farine le lendemain", () => {
  const vie = M.creer();
  M.peserMiche(vie, "prive");
  assert.equal(M.sait(vie, "alienor", "miche_legere").v, 2);
  coucher(vie);
  assert.equal(vie.recit.lendemain, "bon_de_farine");
});

test("rechargements : achat, livraison, saut de plage et visite manquée ne se rejouent pas", () => {
  let vie = M.creer();
  const avant = vie.bourse;
  assert.ok(M.acheter(vie, "fournil", "miche").ok);
  vie = recharge(vie);
  assert.equal(vie.bourse, avant - 1);
  assert.equal(vie.inventaire.miche, 1);

  const k = M.accepter(vie, "ecriteau");
  assert.ok(k);
  vie = recharge(vie);
  M.livrer(vie, k);
  const apres = vie.bourse;
  vie = recharge(vie);
  assert.equal(M.livrer(vie, k), false, "une livraison déjà payée ne repaie pas");
  assert.equal(vie.bourse, apres);

  const t = vie.t; const copie = recharge(vie);
  M.resoudrePlage(copie, t - 1);
  assert.deepEqual(copie.journal, vie.journal, "une plage déjà résolue ne se résout pas deux fois");

  vie.recit.tribut = true;
  coucher(vie);
  const nuit = recharge(vie);
  assert.equal(M.dormir(nuit), false);
  const v = M.visiteEnCours(nuit);
  M.avancer(nuit, 1); // personne n'ouvre
  assert.equal(nuit.visites.find(x => x.id === v.id).etat, "manquee");
  assert.equal(nuit.inventaire["mot_" + v.hab], 1);
  const r = recharge(nuit); M.resoudrePlage(r, Cal.tDe(1, 0));
  assert.equal(Object.keys(r.inventaire).filter(x => x.startsWith("mot_")).length, 1);
});

test("horaires : le chasseur ne vient qu'aux jours de marché, le boucher le jour du tribut", () => {
  const vie = M.creer();
  assert.equal(M.ouvert(vie, "chasseur"), false);
  assert.equal(M.ouvert(vie, "boucher"), true);
  assert.equal(M.acheter(vie, "chasseur", "gibier").ok, false);
  assert.ok(vie.adresses.chasseur, "le carnet garde l'horaire découvert");
  const mercredi = Cal.tDe(2, 0);
  assert.equal(Cal.estJourDeMarche(2), true);
  assert.equal(M.ouvert(vie, "chasseur", mercredi), true);
});

test("examen différé : le récit reste accessible, puis l'épreuve ouvre une commande", () => {
  const vie = M.creer();
  assert.match(M.devis(vie, "affiche").bloque, /épreuve/);
  assert.equal(M.devis(vie, "ecriteau").bloque, null);
  assert.equal(M.passerExamen(vie, "tirer", true), false, "pas de tirage avant la composition");
  M.passerExamen(vie, "composer", true);
  assert.equal(M.devis(vie, "affiche").bloque, null);
});

test("le devis protège le tribut : pas de travail qui finirait au soir avant d'avoir porté le sac", () => {
  const vie = M.creer();
  M.avancer(vie, 1);
  assert.match(M.devis(vie, "ecriteau").bloque, /tribut/);
  assert.equal(M.devis(vie, "bon").bloque, null);
  vie.recit.tribut = true;
  assert.equal(M.devis(vie, "ecriteau").bloque, null);
});

test("sujets : relire, insister, revenir avec un fait nouveau", () => {
  const vie = M.creer();
  assert.equal(M.parler(vie, "maelle:pere"), "nouveau");
  assert.equal(M.parler(vie, "maelle:pere"), "deja");
  const c = M.lien(vie, "maelle", "alienor").conf;
  assert.equal(M.parler(vie, "maelle:pere", { insister: true }), "insiste");
  assert.ok(M.lien(vie, "maelle", "alienor").conf < c, "insister sur un sujet personnel abîme la confiance");
  assert.equal(M.parler(vie, "maelle:miche"), "nouveau");
  M.peserMiche(vie, "prive");
  assert.equal(M.parler(vie, "maelle:miche"), "suite");
});

test("endurance : le coût s'affiche et des options sont proposées quand il manque", () => {
  const vie = M.creer();
  vie.barres.endurance = 10;
  const d = M.devis(vie, "ecriteau");
  assert.equal(d.endurant, false);
  assert.deepEqual(d.options, ["pause", "reporter", "aide", "fractionner"]);
  assert.equal(M.accepter(vie, "ecriteau"), null);
  assert.ok(M.pause(vie) > 0);
});

test("ellipse et changement de millésime : l'ordre des événements et les délais sont conservés", () => {
  const vie = M.creer();
  const pq = Cal.jourPaques(1551);
  M.engager(vie, { id: "dette", de: "alienor", a: "anselme", quoi: "rembourser", t: Cal.tDe(pq + 2, 0) });
  M.engager(vie, { id: "rdv", de: "alienor", a: "maelle", quoi: "visite", t: Cal.tDe(pq - 3, 1) });
  M.avancerJusqua(vie, Cal.tDe(pq + 5, 0));
  const manques = vie.evenements.filter(e => /manqué/.test(e.texte));
  assert.equal(manques.length, 2);
  assert.ok(manques[0].t < manques[1].t);
  assert.equal(vie.engagements.find(e => e.id === "dette").t - Cal.tDe(pq, 0), 6, "le délai se compte en plages, sans saut au changement de millésime");
  assert.equal(Cal.millesimeOfficiel(M.jour(vie)), 1551);
});

test("migration : une partie de l'acte I avancée ne rejoue pas l'ouverture", () => {
  const ancien = { stage: 3, act: 1, started: true, flags: { tribut: "paye" }, f: ["F1", "F2"] };
  const S = M.migrer(JSON.parse(JSON.stringify(ancien)));
  assert.equal(S.v, 2);
  assert.equal(S.vie.recit.ancienne, true);
  assert.equal(S.vie.recit.tribut, true);
  assert.deepEqual(S.f, ["F1", "F2"]);
  const debut = M.migrer({ stage: 0, act: 1, started: true, f: ["F1"] });
  assert.equal(debut.vie.recit.ancienne, true, "une partie commencée à l’atelier n’est pas renvoyée au clos");
  assert.equal(debut.vie.recit.poste, true);
  const neuf = M.migrer({ stage: 0, act: 1, started: false });
  assert.equal(neuf.vie.recit.etape, "reveil");
  const deux = M.migrer(JSON.parse(JSON.stringify(S)));
  assert.deepEqual(deux.vie, S.vie, "migrer deux fois ne change rien");
});
