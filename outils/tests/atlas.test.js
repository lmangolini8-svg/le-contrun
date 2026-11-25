/* Lot 1 de l'intégration de l'atlas : relief, sites, profils et repère de la scène.
   Lancer : node --test outils/tests/atlas.test.js */
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const A = require("../../jeu/atlas.js");

const proche = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg} : ${a} au lieu de ${b} (± ${tol})`);

test("relief : grille 601 × 641, pas de 1 m, premier pixel en (0, 40), altitude = brut / 1000 − 10", () => {
  assert.equal(A.LARGEUR, 601); assert.equal(A.HAUTEUR, 641); assert.equal(A.Y0, 40);
  for (const [X, Y] of [[0, 40], [600, 680], [340, 429], [123, 456]]) proche(A.altitude(X, Y), A.valeurBrute(X, Y) / 1000 - 10, 1e-9, `pixel (${X}, ${Y})`);
  // interpolation : au milieu de quatre pixels, la moyenne des quatre
  const m = (A.altitude(300, 400) + A.altitude(301, 400) + A.altitude(300, 401) + A.altitude(301, 401)) / 4;
  proche(A.altitude(300.5, 400.5), m, 1e-9, "interpolation");
});

test("86 sites, 17 profils, ruelles et secteurs importés", () => {
  assert.equal(Object.keys(A.SITES).length, 86);
  assert.equal(Object.keys(A.PROFILS).length, 17);
  assert.equal(Object.keys(A.CHEMINS).length, 17);
  assert.ok(Object.keys(A.RUELLES).length >= 20);
  assert.equal(Object.keys(A.NOMS_SECTEURS).length, 15);
});

test("chaque site repose sur le relief à sa cote de sol", () => {
  for (const s of Object.values(A.SITES)) proche(A.altitude(s.centre.X, s.centre.Y), s.cote, 0.05, s.id);
});

test("cotes de référence : quai 4 m, marché 10,4 m, chapitre 22 m, couvent 35,5 m, refuge 44,1 m", () => {
  proche(A.PROFILS.quai.cote0, 4, 0.01, "quai");
  proche(A.PROFILS.place_quai.cote1, 4, 0.01, "arrivée au quai");
  proche(A.PROFILS.chapitre.cote0, 10.4, 0.01, "marché");
  proche(A.PROFILS.charroi.cote0, 10.4, 0.01, "départ du charroi au marché");
  proche(A.PROFILS.chapitre.cote1, 22, 0.01, "chapitre");
  proche(A.SITES.parvis.cote, 22, 0.1, "parvis");
  proche(A.SITES.couvent.cote, 35.5, 0.05, "parloir du couvent");
  proche(A.SITES.cabane.cote, 44.1, 0.01, "cabane de Mahaut");
  proche(A.PROFILS.exil.cote1, 44.1, 0.01, "fin du sentier de l'exil");
});

test("alignement : fontaine, portail, pont et poterne dans leur secteur et à leur place", () => {
  const sec = id => A.secteur(A.SITES[id].centre.X, A.SITES[id].centre.Y).nom;
  assert.equal(sec("fontaine"), "Place et halles");
  assert.equal(sec("portail"), "Palais et jardins");
  assert.equal(sec("pont"), "Rivière");
  assert.equal(sec("poterne"), "Cour des gardes");
  const f = A.SITES.fontaine.scene, p = A.SITES.portail.scene, t = A.SITES.pont.scene, g = A.SITES.poterne.scene, i = A.SITES.presse.scene;
  assert.deepEqual([f.x, f.y, f.z], [0, 0, 0], "la fontaine est l'origine de la scène");
  assert.ok(p.z < -30 && Math.abs(p.x) < 10, "le portail du palais au nord de la place");
  assert.ok(g.x > 40, "la poterne à l'est de la place");
  assert.ok(i.x < -60, "l'imprimerie à l'ouest de la place");
  assert.ok(t.x < -200 && t.z > 40, "le pont à l'ouest du quai, au sud");
  assert.ok(A.dansPolygone(A.SITES.lavoir.centre.X, A.SITES.lavoir.centre.Y, A.SITES.lavoir.polygone));
});

test("repère de la scène : aller-retour exact, sans rotation ni échelle", () => {
  for (const [X, Y] of [[0, 40], [340, 429], [517.3, 443.8], [600, 680]]) {
    const s = A.versScene(X, Y), r = A.depuisScene(s.x, s.z);
    proche(r.X, X, 1e-9, "X"); proche(r.Y, Y, 1e-9, "Y");
    proche(A.solScene(s.x, s.z), s.y, 1e-9, "sol");
  }
  const a = A.versScene(100, 100), b = A.versScene(110, 100);
  assert.equal(b.x - a.x, 10); assert.equal(b.z - a.z, 0);
});

test("voies : les tracés suivent les longueurs et pentes publiées", () => {
  for (const [id, P] of Object.entries(A.PROFILS)) {
    const c = A.CHEMINS[id];
    proche(A.longueur(c), P.longueur, P.longueur * 0.015, `longueur de ${id}`);
    proche(c[0][2], P.cote0, 0.01, `cote initiale de ${id}`);
    proche(c[c.length - 1][2], P.cote1, 0.01, `cote finale de ${id}`);
  }
  // parcours piéton court jusqu'à 11,3 % ; détour de charroi de 202 m à 3,2 % au plus
  proche(A.PROFILS.place_quai.penteVoie, 11.3, 0.1, "pente du passage piéton");
  proche(A.PROFILS.charroi.longueur, 202, 0.5, "longueur du charroi");
  assert.ok(A.PROFILS.charroi.penteVoie <= 3.2, "pente du charroi");
  proche(A.penteMax(A.CHEMINS.place_quai), 11.3, 0.3, "pente mesurée du passage piéton");
});
