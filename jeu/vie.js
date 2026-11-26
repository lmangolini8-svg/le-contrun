/* La vie d'Aliénor : première journée jouable, du réveil au clos jusqu'au lendemain matin.
   Chargé après le script principal de index.html, dont il partage les déclarations globales
   (scène, joueur, dialogues, planches). Il s'y raccorde en enveloppant quelques fonctions,
   sans réécrire les scènes existantes. Les règles vivent dans jeu/monde.js. */
"use strict";
(function () {
const M = Monde, C = Calendrier;
const V = () => S.vie || M.migrer(S).vie;
M.migrer(S);

/* ================= Le clos des murailles : décor marchable, loin de la carte ================= */
O.clos = [-1500, 1600];
const CL = (x, z) => ({ x: O.clos[0] + x, z: O.clos[1] + z });
const enClos = () => player.position.z > 1300;
/* La collision de la ville refuse tout ce qui sort de la carte : le clos et sa rue ont leurs propres limites.
   Plan d'après l'atlas du 25 novembre 2026 : le clos au sud-est contre le rempart, la rivière au sud,
   la rue qui part vers l'ouest, longe la cour des gardes, la Caisse des métiers, les halles et les Drapiers,
   et finit à la porte de l'imprimerie. Distances du clos à l'échelle ; la rue est raccourcie de moitié. */
const dansClos = (lx, lz) => (lx >= -37 && lx <= 28.5 && lz >= -29 && lz <= 22.5) || (lx >= -150 && lx < -36 && lz >= -3.2 && lz <= 3.2);
const _blocked = blocked;
blocked = function (x, z) {
  if (z < 1300) return _blocked(x, z);
  if (!dansClos(x - O.clos[0], z - O.clos[1])) return true;
  for (const b of boxes) if (b.on && x > b.x0 - PR && x < b.x1 + PR && z > b.z0 - PR && z < b.z1 + PR) return true;
  for (const c of circles) { if (c[3] === false) continue; const dx = x - c[0], dz = z - c[1]; if (dx * dx + dz * dz < (c[2] + PR) * (c[2] + PR)) return true; }
  return false;
};
const clos = {};
const ENDUIT = 0xe8dcc0, PLANCHER = 0x9a7c55;

/* Les enseignes visibles depuis le clos et la rue : point (local), boutique des catalogues, couleur. */
const ENSEIGNES = [
  { b: "Menuisier", lab: "Le menuisier", x: -19.6, z: -14, c: WOOD },
  { b: "Tapissière", lab: "La tapissière", x: -6.6, z: -23, c: SIENNE },
  { b: "Pépiniériste", lab: "Le pépiniériste", x: 9, z: -12.4, c: FORET },
  { b: "Tailleur", lab: "Le tailleur", x: -104, z: -3.35, c: INDIGO },
  { b: "Coiffeuse", lab: "La coiffeuse", x: -114, z: -3.35, c: OCRE },
  { b: "Marchande de fards et parures", lab: "La marchande de fards", x: -124, z: -3.35, c: 0xc46a7a }
];
DIO.clos = function (ox, oz) {
  floorAt(ox - 4, oz - 3, 66, 52, 0xb8a77e);
  floorAt(ox - 93, oz, 116, 7, 0xc9b78c);
  floorAt(ox - 4, oz + 31, 70, 16, 0x7f9fb0);
  floorAt(ox, oz, 8, 6, PLANCHER);
  const P = (g, c, x, y, z, sx, sy, sz, ry, rx, rz) => put(g, c, ox + x, y, oz + z, sx, sy, sz, ry, rx, rz);
  const S_ = (x0, x1, z0, z1) => solid(ox + x0, ox + x1, oz + z0, oz + z1);
  const H = (x, z, w, d, h, pl, rf) => { simpleHouse(ox + x, oz + z, 0, w, d, h, pl, rf); S_(x - w / 2, x + w / 2, z - d / 2, z + d / 2); };
  dio(0, () => {
    // la pièce : murs bas au sud pour que la caméra voie l'intérieur ; la porte s'ouvre à l'ouest, vers la ville
    P(G.box, ENDUIT, 0, 1.0, -3, 8.4, 2.0, 0.25); S_(-4.2, 4.2, -3.25, -2.75);
    P(G.box, ENDUIT, 4, 1.0, 0, 0.25, 2.0, 6); S_(3.75, 4.25, -3, 3);
    // porte de 2 m : Aliénor occupe un rayon de 0,5 m
    P(G.box, ENDUIT, -4, 1.0, -1.7, 0.25, 2.0, 2.6); S_(-4.25, -3.75, -3, -0.4);
    P(G.box, ENDUIT, -4, 1.0, 2.3, 0.25, 2.0, 1.4); S_(-4.25, -3.75, 1.6, 3);
    P(G.box, SEPIA, -4, 1.9, 0.6, 0.3, 0.22, 2.2);
    P(G.box, ENDUIT, 0, 0.3, 3, 8.4, 0.6, 0.25); S_(-4.2, 4.2, 2.75, 3.25);
    for (const x of [-3.9, 3.9]) P(G.box, SEPIA, x, 1.0, -2.9, 0.2, 2.0, 0.2);
    // fenêtre au nord, vers les jardins qui montent
    P(G.box, 0x9fb3c8, 1.2, 1.35, -2.86, 1.0, 0.9, 0.04); P(G.box, SEPIA, 1.2, 0.88, -2.8, 1.2, 0.08, 0.2);
    // lit, coffre, table, tabouret, âtre
    P(G.box, WOOD, -2.9, 0.25, -1.9, 1.5, 0.5, 2.0); P(G.box, BLANC, -2.9, 0.55, -1.85, 1.35, 0.14, 1.8); P(G.box, INDIGO, -2.9, 0.6, -1.3, 1.38, 0.1, 0.9); P(G.box, BLANC, -2.9, 0.66, -2.55, 0.9, 0.14, 0.35); S_(-3.7, -2.1, -2.9, -0.9);
    P(G.box, 0x6e5338, -1.6, 0.3, -2.5, 0.9, 0.6, 0.5); S_(-2.05, -1.15, -2.8, -2.2);
    P(G.box, WOOD, 0.8, 0.75, 1.6, 1.4, 0.08, 0.8); for (const [dx, dz] of [[-.6, -.3], [.6, -.3], [-.6, .3], [.6, .3]]) P(G.box, 0x5b4331, 0.8 + dx, 0.37, 1.6 + dz, 0.08, 0.74, 0.08); S_(0.05, 1.55, 1.15, 2.05);
    P(G.c16, 0x5b4331, -0.4, 0.25, 1.6, 0.22, 0.5, 0.22);
    P(G.box, ST2, 3.5, 0.5, 1.9, 0.9, 1.0, 1.4); P(G.box, 0x3a3236, 3.25, 0.4, 1.9, 0.5, 0.5, 0.9); S_(3, 4, 1.15, 2.65);
    // miroir et robes aux patères, sur le mur est
    P(G.box, SEPIA, 3.84, 1.25, -0.6, 0.08, 1.4, 0.7); P(G.box, 0xc7d3dc, 3.8, 1.25, -0.6, 0.04, 1.25, 0.56);
    P(G.box, SEPIA, 3.84, 1.75, -1.55, 0.1, 0.06, 0.06); P(G.robe, OCRE, 3.6, 0.42, -1.55, 0.09, 0.095, 0.06);
    P(G.box, SEPIA, 3.84, 1.75, 0.35, 0.1, 0.06, 0.06); P(G.robe, INDIGO, 3.6, 0.42, 0.35, 0.09, 0.095, 0.06);
    // le rempart à l'est, avec ses tours, et la rivière au sud
    P(G.box, ST2, 30, 3.5, -4, 2, 7, 54); S_(29, 31, -31, 23);
    for (const z of [-24, 0, 20]) { P(G.c16, ST2, 30.5, 4.2, z, 2.4, 8.4, 2.4); P(G.k16, SLATE, 30.5, 9.4, z, 2.7, 2.2, 2.7); }
    for (let z = -29; z < 23; z += 2.2) P(G.box, ST2, 30, 7.4, z, 2, 0.8, 1.1);
    P(G.box, ST, -4, 0.35, 23.4, 66, 0.7, 0.8); S_(-37, 29, 23, 24);
    // le jardin d'Aliénor, entre la maison et la rivière
    for (const [x, z] of [[1.5, 8], [5, 8], [1.5, 10.4], [5, 10.4]]) { P(G.box, 0x6b5136, x, 0.15, z, 2.6, 0.3, 1.4); for (let k = -1; k <= 1; k++) P(G.s, k ? SAUGE : FORET, x + k * 0.75, 0.45, z, 0.28, 0.22, 0.28); }
    S_(0.1, 6.4, 7.2, 11.2);
    for (let x = -1; x <= 8; x += 1.5) P(G.box, WOOD, x, 0.45, 6.4, 0.08, 0.9, 0.08);
    // puits des voisins, au nord-ouest de la maison
    P(G.c16, ST, -11, 0.45, -5, 0.95, 0.9, 0.95); P(G.c16, 0x2a2730, -11, 0.91, -5, 0.72, 0.03, 0.72);
    for (const x of [-11.9, -10.1]) P(G.box, WOOD, x, 1.4, -5, 0.14, 1.9, 0.14);
    P(G.c16, WOOD, -11, 2.25, -5, 0.08, 2.0, 0.08, 0, 0, Math.PI / 2); P(G.c16, 0x6e5338, -10.7, 1.3, -5, 0.22, 0.3, 0.22);
    S_(-12.05, -9.95, -6, -4);
    // pépinière du pépiniériste, au nord-est
    for (let i = 0; i < 9; i++) { const x = 7.5 + (i % 3) * 1.1, z = -16 + Math.floor(i / 3) * 1.1; P(G.c16, TILE, x, 0.25, z, 0.3, 0.5, 0.3); P(G.s, i % 2 ? SAUGE : FORET, x, 0.72, z, 0.36, 0.4, 0.36); }
    S_(7, 10.7, -16.6, -13.1);
    // la rue : la cour des gardes au nord, sa poterne, la Caisse des métiers, les halles au sud
    P(G.box, ST2, -62, 3, -6, 22, 6, 1.2); P(G.box, 0x2a2730, -62, 1.3, -5.36, 1.8, 2.6, 0.1); P(G.c16, ST, -62, 2.6, -5.32, 0.95, 0.12, 0.95, 0, Math.PI / 2);
    P(G.box, 0xd8c9a4, -84, 2.6, -6.2, 12, 5.2, 4); P(G.box, SIENNE, -84, 3.8, -4.15, 3.4, 0.7, 0.06); P(G.box, SEPIA, -84, 1.2, -4.15, 1.4, 2.4, 0.08);
    for (const x of [-92, -86, -80, -74]) for (const z of [7, 12]) P(G.box, WOOD, x, 1.8, z, 0.25, 3.6, 0.25);
    P(G.box, TILE, -83, 3.75, 9.5, 20, 0.3, 7.5);
    // la place, devinée entre deux maisons, puis la fontaine
    P(G.c16, ST, -96, 0.45, 8, 1.6, 0.9, 1.6); P(G.c8, ST2, -96, 1.4, 8, 0.25, 1.9, 0.25);
    // les Drapiers : trois boutiques au nord ; l'imprimerie ferme la rue à l'ouest
    P(G.box, 0xe2d6bc, -147, 3, 0, 4, 6, 9); S_(-150, -145, -4.5, 4.5); P(G.box, SEPIA, -145, 1.2, 0, 0.1, 2.4, 1.6); P(G.box, 0x23252c, -144.9, 3.4, 0, 0.06, 0.9, 2.6);
  });
  dio(0, () => {
    // voisins du clos : Ysabeau, le menuisier, la tapissière ; maisons de la traverse
    // au sud du chemin, les maisons restent à 8 m au moins : la caméra se tient derrière Aliénor
    H(-17, 11.5, 7, 6, 4.2, 0xecd9a6, TILE); put(G.box, SEPIA, ox - 17, 1.1, oz + 8.45, 1.1, 2.2, 0.1);
    H(-22, -17, 6, 5, 3.8, 0xe2d6bc, SLATE);
    H(-9, -26, 7, 5, 4.4, BLANC, LAUZE);
    H(-2, -14, 6, 5, 4.6, 0xeed2b4, TILE);
    H(16, -6, 6, 6, 4.4, 0xe2d6bc, TILE);
    H(18, 12, 7, 6, 4.0, BLANC, SLATE);
    H(-24, -4, 6, 5, 4.4, 0xeed2b4, TILE);
    H(-30, -14, 7, 6, 4.8, 0xe2d6bc, LAUZE);
    // la rue, côté nord : façades hautes, côté sud : jardins et murets, pour que la caméra voie la rue
    const nord = [[-42, 0xeed2b4, TILE], [-49, BLANC, SLATE], [-75, 0xe2d6bc, TILE], [-104, 0xecd9a6, SLATE], [-114, BLANC, TILE], [-124, 0xeed2b4, LAUZE], [-134, 0xe2d6bc, TILE], [-140, BLANC, SLATE]];
    for (const [x, pl, rf] of nord) {
      simpleHouse(ox + x, oz - 7.5, 0, 7, 8, 5.4, pl, rf);
      put(G.box, SEPIA, ox + x - 1.6, 1.1, oz - 3.45, 1.1, 2.2, 0.1); // porte
      for (const dx of [0.6, 2.2]) put(G.box, 0x2b2f45, ox + x + dx, 1.5, oz - 3.45, 0.9, 1.1, 0.08); // fenêtres
      for (const dx of [-1.8, 0, 1.8]) put(G.box, 0x2b2f45, ox + x + dx, 3.9, oz - 3.45, 0.8, 1.0, 0.08);
      put(G.box, SEPIA, ox + x, 2.95, oz - 3.42, 7, 0.12, 0.08); // colombage
    }
    for (let x = -148; x < -38; x += 2.4) if (x < -100 || x > -93) put(G.box, ST, ox + x, 0.35, oz + 3.8, 2.3, 0.7, 0.4);
  });
  for (const e of ENSEIGNES) { put(G.box, SEPIA, ox + e.x, 2.62, oz + e.z + 0.1, 1.2, 0.06, 0.06); }
  tree(ox + 12, oz + 4, 0.8); tree(ox - 26, oz + 15, 0.9); tree(ox - 2, oz + 18, 0.7); tree(ox - 58, oz + 8, 0.8); tree(ox - 118, oz + 7, 0.7);
  // objets qui bougent : volets, lettre, enseignes
  const m = (g, c, x, y, z, sx, sy, sz) => { const o = new THREE.Mesh(g, LM(c)); o.position.set(ox + x, y, oz + z); o.scale.set(sx, sy, sz); o.castShadow = true; scene.add(o); return o; };
  const pivot = (x, z) => { const g = new THREE.Group(); g.position.set(ox + x, 1.35, oz + z); scene.add(g); return g; };
  clos.voletG = pivot(0.7, -2.78); clos.voletD = pivot(1.7, -2.78);
  for (const [g, s] of [[clos.voletG, 1], [clos.voletD, -1]]) { const p = new THREE.Mesh(G.box, LM(PETROLE)); p.scale.set(0.5, 0.92, 0.05); p.position.set(0.25 * s, 0, 0); p.castShadow = true; g.add(p); }
  for (const e of ENSEIGNES) m(G.box, e.c, e.x, 2.2, e.z + 0.12, 1.0, 0.75, 0.05); // enseignes peintes sur la façade, face à la rue
  clos.lettre = m(G.box, 0xf6efe0, -3.35, 0.02, 0.6, 0.32, 0.01, 0.22);
  clos.lettre.rotation.y = 0.4;
  clos.feu = m(G.s, ORANGE, 3.2, 0.35, 1.9, 0.22, 0.16, 0.3);
  majClos();
};
function batirClos() { if (dioBuilt.clos) return; DIO.clos(O.clos[0], O.clos[1]); flushWin(); dioBuilt.clos = true; }
function majClos() {
  if (!clos.lettre) return;
  const r = V().recit;
  clos.lettre.visible = r.lettre === "glissee";
  const a = r.volets ? 1.45 : 0; clos.voletG.rotation.y = a; clos.voletD.rotation.y = -a;
  clos.feu.visible = r.etape === "soir" || r.etape === "nuit";
  afficherAmenagement();
}

PLATES.clos = { n: "XV", dest: "Le clos des murailles", dio: "clos", cam: at("clos", [-14, 5, 16]), look: at("clos", [6, 1.4, -8]),
  txt: [{ r: "Le clos s’adosse au rempart de l’est, au-dessus de la rivière. Puits des voisins, jardins, menuisier, tapissière, pépiniériste : un quartier où l’on se connaît par ses fenêtres." }] };
PLATES.drapiers = { n: "XVI", dest: "La rue des Drapiers", dio: "ruelles", cam: PLATES.ruelles.cam, look: PLATES.ruelles.look, fog: PLATES.ruelles.fog,
  txt: [{ r: "Tailleur, coiffeuse, marchande de fards et de parures : la rue s’éveille avant la place. Le chemin de l’atelier s’apprend à pied." }] };
DEST._clos = ["clos"]; DEST._drapiers = ["drapiers"]; DEST.clos = ["clos"];
zoneShown.clos = 1;

/* ================= Raccords avec le jeu existant ================= */
const _zoneOf = zoneOf; zoneOf = function () { return enClos() ? "clos" : _zoneOf(); };
const _sceneWanted = sceneWanted;
sceneWanted = function () {
  if (enClos()) return M.plage(V()) === 2 ? "soir" : "day";
  // Sur la place, à l'acte I, la lumière suit l'horloge : l'après-midi s'ambre, le soir rougit.
  if (S.act === 1 && V()) { const p = M.plage(V()); if (p === 1) return "apresmidi"; if (p === 2) return "soir"; }
  return _sceneWanted();
};
const _setScene = setScene;
let cleVie = null;
setScene = function (force, over) {
  const key = over || sceneWanted();
  if (key !== cleVie) { force = true; cleVie = key; }
  if (key === "apresmidi") {
    _setScene(force, "day");
    setSky("apresmidi");
    if (V().recit.nuit) for (const p of file) p.visible = false;
    return;
  }
  if (key === "soir") {
    _setScene(force, "dawn");
    setSky("soir");
  } else _setScene(force, over);
  if (V().recit.nuit) for (const p of file) p.visible = false;
};
const _objText = objText;
objText = function () {
  if (!V()) return _objText();
  const r = V().recit;
  if (enClos()) {
    if (r.etape === "reveil") return r.lettre === "glissee" ? "Une lettre a été glissée sous la porte. La journée commence quand vous voulez : maître Anselme vous attend à l’atelier." : "La journée commence quand vous voulez. Le chemin de l’atelier part du bas du clos.";
    if (r.etape === "soir") return r.repas ? "La fête de l’Un commence sur la place. Le chemin part du bas du clos." : "Le soir tombe sur le clos. Un repas, un peu de repos, puis la fête sur la place.";
    if (r.etape === "nuit") return "Il est temps de dormir. Le lit est au fond de la pièce.";
    if (r.etape === "lendemain") {
      if (M.visiteEnCours(V()) || r.entretien?.lieu === "clos") return "On frappe à la porte.";
      const rdv = M.rendezVous(V());
      if (rdv) return "Rendez-vous avec " + M.HABITANTS[rdv.a].nom + " " + M.LIEUX[rdv.lieu].nom + " · " + C.lisible(rdv.t).plage + ".";
      return "Le lendemain. Vous pouvez retourner au jardin ou à la ville.";
    }
  }
  if (S.act === 1 && S.stage === 1) return "La cloche a sonné. Portez le sac du tribut au percepteur, au nord de la place : la file avance jusqu’au soir. Le tableau des commandes est à l’atelier.";
  return _objText();
};
const _targetNow = targetNow, _targetName = targetName;
const closCible = () => { const r = V().recit; if (r.etape === "nuit") return CL(-2.9, -0.6); if (r.etape === "lendemain" && M.visiteEnCours(V())) return CL(-3.2, 0.6); return CL(-142.5, 0); };
targetNow = function () { return enClos() ? closCible() : _targetNow(); };
targetName = function () { const r = V().recit; return enClos() ? (r.etape === "nuit" ? "votre lit" : r.etape === "lendemain" ? "la porte" : r.etape === "soir" ? "la place" : "l’atelier") : _targetName(); };

/* La date, la plage et les quatre barres, sous l'objectif. */
const BARRES = [["repos", "Repos"], ["satiete", "Satiété"], ["endurance", "Endurance"], ["convictions", "Convictions"]];
function vieHud() {
  const a = M.almanach(V()), b = V().barres;
  return `<span class="vie-alm">${esc(a.date)} · ${esc(a.plage)}</span><span class="vie-bars">${BARRES.map(([k, n]) => `<span title="${n} : ${Math.round(b[k])} sur 100"><em>${n}</em><i style="--v:${Math.round(b[k])}%"></i></span>`).join("")}</span>`;
}
const _refreshHud = refreshHud;
refreshHud = function () { _refreshHud(); try { majHalles(); } catch (e) {} if (V()&& (mode === "play" || mode === "dialog")) $("obj").insertAdjacentHTML("beforeend", vieHud()); };
const style = document.createElement("style");
style.textContent = `.vie-alm{display:block;margin-top:5px;font:italic 14px/1.2 var(--display);color:var(--sienne)}
.vie-bars{display:grid;grid-template-columns:1fr 1fr;gap:3px 12px;margin-top:5px}
.vie-bars span{display:flex;align-items:center;gap:6px;font:12px/1 var(--display);color:var(--ink)}
.vie-bars em{font-style:normal;width:68px}
.vie-bars i{flex:1;height:6px;border:1px solid var(--ink);border-radius:3px;background:linear-gradient(90deg,var(--sienne) var(--v),transparent var(--v))}
.lettre{background:#f6efe0;border:1px solid #b9a77f;padding:16px 18px;font-family:var(--hand);font-size:21px;line-height:1.25;transform:rotate(-.7deg);margin:10px 0}
.devis{border-top:1px dashed var(--ink);padding:10px 0}.devis h3{margin:0 0 4px;font-family:var(--display);font-weight:400;font-style:italic}
.devis dl{display:grid;grid-template-columns:auto 1fr;gap:2px 12px;margin:6px 0;font-size:15px}.devis dt{color:var(--sienne)}
.miroir{display:flex;gap:18px;justify-content:center;align-items:flex-end;margin:8px 0}
.miroir button{background:none;border:2px solid transparent;border-radius:12px;padding:6px;min-width:120px}
.miroir button[aria-pressed="true"]{border-color:var(--ink)}
.miroir svg{width:110px;height:170px;display:block;margin:0 auto}
.compo{font:24px/1.3 Georgia,serif;letter-spacing:.04em;padding:6px 10px;border:1px solid #b9a77f;background:#fbf6ea;display:inline-block}
.compo.envers{transform:scaleX(-1)}
.vitrine{list-style:none;margin:8px 0;padding:0;columns:2;column-gap:24px}.vitrine li{display:flex;justify-content:space-between;gap:8px;border-bottom:1px dotted #b9a77f;padding:3px 0;break-inside:avoid}.vitrine span{color:var(--sienne);white-space:nowrap}
.carte-acte{width:100%;border:1px solid #b9a77f;margin:6px 0}
.grille-clos button[aria-disabled="true"]{color:var(--muted);background:repeating-linear-gradient(135deg,transparent 0 4px,#87684924 4px 8px)}
.grille-clos button[data-apercu]{outline:2px solid var(--sienne);outline-offset:-3px}
.vie-carnet ul{margin:4px 0 8px 18px;padding:0}.vie-carnet li{margin:2px 0}`;
document.head.appendChild(style);

const _showCarnet = showCarnet;
showCarnet = function () {
  _showCarnet();
  const box = ov.querySelector(".box"); if (!box || !V()) return;
  const rows = box.querySelectorAll(".row"), last = rows[rows.length - 1];
  const html = carnetVie(); if (last) last.insertAdjacentHTML("beforebegin", html); else box.insertAdjacentHTML("beforeend", html);
};
const INV = { bois_clos: "bois de récupération", compost: "compost", graine_chou: "graine de chou", graine_sauge: "graine de sauge", sauge_recoltee: "sauge récoltée",  lettre: "la lettre sans signature", miche: "une miche", viande: "un morceau de viande", gibier: "un lièvre", legumes: "une botte de légumes", eau: "une cruche d’eau", bon_de_farine: "le bon de farine du fournil", quignon: "un quignon d’hier", robe_ocre: "la robe ocre", robe_indigo: "la robe indigo", mot_maelle: "un mot de Maëlle", mot_ysabeau: "un mot d’Ysabeau" };
function carnetVie() {
  const v = V(), a = M.almanach(v), b = v.barres;
  const inv = Object.keys(v.inventaire).map(k => (INV[k] || M.ARTICLES[k]?.nom || k) + (v.inventaire[k] > 1 ? ` (${v.inventaire[k]})` : ""));
  const suj = Object.keys(v.sujets).map(k => {
    const s = M.SUJETS[k], f = s.fait && M.sait(v, "alienor", s.fait);
    return `<li><b>${esc(M.HABITANTS[s.hab].nom)} · ${esc(s.titre)}</b>${f ? ` : ${esc(M.FAITS[s.fait].v[f.v])}` : ""}${v.sujets[k].insiste ? " <i>Vous avez insisté.</i>" : ""}</li>`;
  });
  const adr = Object.keys(v.adresses).map(k => `<li>${esc(M.BOUTIQUES[k].nom)} : ${esc(v.adresses[k])}</li>`);
  const ex = Object.keys(M.EXAMENS).map(k => `<li>${esc(M.EXAMENS[k].nom)} : ${v.examens[k] === "reussi" ? "réussie" : v.examens[k] === "echoue" ? "à reprendre" : "pas encore tentée"}</li>`);
  const ev = v.evenements.slice(-6).reverse().map(e => `<li>${esc(C.lisible(e.t).plage)}, ${esc(C.lisible(e.t).date)} : ${esc(e.texte)}</li>`);
  const ens = Object.keys(v.enseignes || {}).map(k => `<li>${esc(k)} : ${esc(v.enseignes[k])}</li>`);
  const rencontres = M.observations(v).reverse().map(e =>
    `<li><b>${esc(e.nom)} · ${esc(M.LIEUX[e.lieu]?.nom || e.lieu)}</b><br>${esc(C.lisible(e.t).date)} · ${esc(C.lisible(e.t).plage)}<br>${esc(e.texte)}</li>`);
  const rdv = M.rendezVous(v);
  const carte = ["I", "II", "III", "IV", "V"][Math.min(5, S.act || 1) - 1];
  return `<div class="feuil vie-carnet"><span class="kick">Ma carte · acte ${carte}</span><img class="carte-acte" src="img/carnet/carnet_${carte}.webp" alt="Carte du carnet pour l’acte ${carte} : les lieux et les chemins repérés par Aliénor."></div>
  <div class="feuil vie-carnet"><span class="kick">Almanach et journal</span>
  <p><b>${esc(a.date)}</b>, ${esc(a.plage)}.${a.actes ? ` ${esc(a.actes)}.` : ""}${a.fetes.length ? ` Aujourd’hui : ${esc(a.fetes.join(", "))}.` : ""}${a.prochaine ? ` Prochaine fête : ${esc(a.prochaine)}.` : ""}${a.marche ? " Jour de marché." : ""}</p>
  <p><b>Bourse :</b> ${v.bourse} sous. <b>Sur soi et chez soi :</b> ${inv.length ? esc(inv.join(", ")) : "rien"}.${v.tenue ? ` Tenue du jour : la robe ${esc(v.tenue)}.` : ""}</p>
  <p><b>Repos</b> ${Math.round(b.repos)}, <b>Satiété</b> ${Math.round(b.satiete)}, <b>Endurance</b> ${Math.round(b.endurance)}, <b>Convictions</b> ${Math.round(b.convictions)}. ${esc(v.conviction)}</p>
  ${suj.length ? `<p class="small">Sujets abordés, à relire avant d’y revenir :</p><ul>${suj.join("")}</ul>` : ""}
  ${rencontres.length ? `<h3>Journal des rencontres</h3><ul>${rencontres.join("")}</ul>` : ""}
  ${rdv ? `<p><b>Rendez-vous</b> · ${esc(M.HABITANTS[rdv.a].nom)} · ${esc(M.LIEUX[rdv.lieu].nom)} · ${esc(C.lisible(rdv.t).date)}, ${esc(C.lisible(rdv.t).plage)}</p>` : ""}
  ${adr.length ? `<p class="small">Adresses et horaires découverts :</p><ul>${adr.join("")}</ul>` : ""}
  ${ens.length ? `<p class="small">Enseignes repérées :</p><ul>${ens.join("")}</ul>` : ""}
  <p class="small">Épreuves de l’atelier :</p><ul>${ex.join("")}</ul>
  ${ev.length ? `<p class="small">Ces derniers temps :</p><ul>${ev.join("")}</ul>` : ""}</div>`;
}

/* ================= Petites aides ================= */
function cloche(n) { signal("La cloche de la place sonne " + n + " coups."); const c = Snd.ctx; if (!c || c.state !== "running") return; for (let i = 0; i < n; i++) playSfx("cloche", 0.7, 0, 1, Snd.bus, i * 1.6); }
function apres(t) { save(); refreshHud(); return t; }
const PL = () => C.PLAGES[M.plage(V())];
function choix(opts) { return { choices: opts.filter(Boolean) }; }
const rien = () => nextLine();
function fermerDlg() { dlg.style.display = "none"; queue = []; after = null; waitingChoice = false; }
function vieClick(a, b) { const f = ACTIONS[a]; if (f) { f(b); return true; } return false; }
ov.addEventListener("click", e => { const b = e.target.closest("[data-v]"); if (b) vieClick(b.dataset.v, b); });
const ACTIONS = {};

/* ================= Le matin au clos ================= */
function versClos(etape, pos, ensuite) {
  V().recit.etape = etape; save();
  turnPage("_clos", () => { enterPlay(); majClos(); setScene(true); refreshHud(); if (ensuite) ensuite(); }, null,
    () => { batirClos(); player.position.set(pos.x, 0, pos.z); player.rotation.y = Math.PI; });
}
const _startPlay = startPlay;
startPlay = function (newGame) {
  if (newGame) { S.vie = null; M.migrer(S); }
  const r = V().recit;
  if (newGame && r.etape === "reveil") {
    closePanel(); S.started = true; applyStage(); save(); setCones(true);
    return versClos("reveil", CL(-1.6, -1.0), () => talk([["", "Le jour passe par les fentes des volets. Aliénor se réveille au clos des murailles, le matin du tribut."], ["", "Sous la porte, quelqu’un a glissé une feuille pliée."]]));
  }
  if (!newGame && enClos()) { closePanel(); S.started = true; save(); fpsT = 0; fpsN = 0; batirClos(); setScene(true); setCones(true); majClos(); return enterPlay(); }
  return _startPlay(newGame);
};
function closPeutSortir() { const r = V().recit; return enClos() && (r.etape === "reveil" || r.etape === "soir" || r.etape === "lendemain"); }

// La lettre est de Mahaut (décision du 25 novembre 2026). Elle reste anonyme jusqu’à l’acte III.
const LETTRE = "On pèse le pain du palais avec la balance du palais. Faites peser la miche de Maëlle, devant qui vous voudrez, et voyez ce qu’il en reste.";
INTER.push(
  { p: () => CL(-3.35, 0.6), r: 1.7, label: "Lire la lettre", can: () => enClos() && V().recit.lettre === "glissee", act() { lireLettre(); } },
  { p: () => CL(1.2, -2.3), r: 1.6, label: "Les volets", can: () => enClos(), act() {
      const r = V().recit; r.volets = !r.volets; majClos(); sfx("volets");
      say(r.volets ? (M.plage(V()) === 2 ? "Le soir rougit la muraille." : "Le clos s’éveille : un seau au puits, une porte, la poterne qu’on déverrouille.") : "La pièce retombe dans la pénombre."); apres(); } },
  { p: () => CL(0.8, 1.0), r: 1.4, label: "Les provisions", can: () => enClos() && V().recit.etape !== "soir", act() { provisions(); } },
  { p: () => CL(2.6, 1.9), r: 1.6, label: "Préparer un repas", can: () => enClos() && ["soir", "lendemain"].includes(V().recit.etape), act() { repas(); } },
  { p: () => CL(3.3, -0.6), r: 1.5, label: "Le miroir", can: () => enClos(), act() { miroir(); } },
  { p: () => CL(-2.9, -0.7), r: 1.5, label: "Le lit", can: () => enClos() && (V().recit.etape === "nuit" || (V().recit.etape === "soir" && !V().recit.sieste)), act() { lit(); } },
  { p: () => CL(3.2, 6), r: 1.8, label: "Le jardin", can: () => enClos(), act() { amenager("jardin"); } },
  { p: () => CL(1.2, -1.9), r: 1.5, label: "Aménager et fabriquer", can: () => enClos(), act() { amenager("maison"); } },
  { p: () => CL(-11, -3.6), r: 1.8, label: "Le puits des voisins", can: () => enClos(), act() { puits(); } },
  { p: () => CL(-17, 7.2), r: 1.6, label: "Frapper chez Ysabeau", can: () => enClos(), act() { chezYsabeau(); } },
  ...ENSEIGNES.map(e => ({ p: () => CL(e.x, e.z + (e.z < -10 ? 2.2 : 1.4)), r: 1.8, label: e.lab, can: () => enClos(), act() { vitrine(e.b); } })),
  { p: () => CL(-3.25, 0.6), r: 1.3, label: "Ouvrir la porte", can: () => enClos() && V().recit.etape === "lendemain"
    && (!!M.visiteEnCours(V()) || V().recit.entretien?.lieu === "clos"), act() { visite(); } },
  { p: () => CL(-1.65, -0.2), r: 1.2, label: "Laisser passer le temps", can: () => enClos() && V().recit.etape === "lendemain" && M.plage(V()) < 2, act() {
    const v = V(), plage = C.lisible(v.t + 1).plage;
    talk([["", "Le ciel change au-dessus du clos. Attendre jusqu’à la prochaine plage ?"], choix([
      ["Attendre · " + plage, () => { M.avancer(v, 1); setScene(true); majClos(); apres(); talk([["", "La lumière change sous les volets."]], apres); }],
      ["Continuer sa journée", rien]
    ])]);
  } },
  { p: () => CL(-142.5, 0), r: 2.4, get label() { const e = V().recit.etape; return e === "soir" ? "Rejoindre la fête" : e === "lendemain" ? "Vers la place" : "Entrer à l’atelier"; }, can: closPeutSortir, act() { sortir(); } },
  { p: () => CL(-62, -3.6), r: 2.2, label: "La poterne des gardes", can: () => enClos(), act() { talk([["", "La poterne de la cour des gardes. Le matin, quelqu’un la laisse ouverte, on ne sait pas qui."]]); } },
  { p: () => CL(-84, -3.4), r: 2.2, label: "La Caisse des métiers", can: () => enClos(), act() { talk([["", "La Caisse des métiers : un comptoir, un registre, des devis épinglés. On y épargne, on y demande une avance sur un devis."], ["", "« Fermé le jour du tribut. »"]]); } }
);

/* Les vitrines : les articles des catalogues, dans leur quartier. Les adresses vues vont au carnet. */
function vitrine(nom) {
  const v = V(), B = (window.COMMERCES || {})[nom];
  if (!B) return talk([["", nom + " : la boutique est fermée."]]);
  v.enseignes = v.enseignes || {}; v.enseignes[nom] = B.quartier; save();
  const acte = S.act || 1, dispo = B.articles.filter(a => a[3] <= acte).sort((a, b) => a[2] - b[2]);
  const jourT = M.estJourTribut(M.jour(v)) && !v.recit.tribut;
  mode = "panel"; refreshHud();
  panel(`<span class="kick">${esc(B.quartier)}</span><h2>${esc(nom)}</h2>
    <p class="small">${jourT ? "Le volet est mi-clos : le maître est parti porter son sac au palais. On regarde la vitrine." : "On regarde la vitrine."} ${dispo.length} articles en ce moment, ${B.articles.length - dispo.length} autres arriveront plus tard.</p>
    <ul class="vitrine">${dispo.slice(0, 8).map(a => `<li>${esc(a[1])} <span>${a[2]} sou${a[2] > 1 ? "s" : ""}</span></li>`).join("")}</ul>
    <p class="small">L’adresse est notée dans le carnet. Les achats en boutique arriveront avec la Caisse des métiers.</p>
    <div class="row"><button class="pri" data-v="fermer">Continuer</button></div>`);
}

function lireLettre() {
  const r = V().recit; sfx("feuillet"); if (r.lettre === "glissee") sfx("lettre");
  mode = "panel"; refreshHud();
  panel(`<span class="kick">Glissée sous la porte</span><div class="lettre">${esc(LETTRE)}</div><p class="small">Pas de signature. L’écriture est soignée, l’encre fraîche.</p>
    <div class="row"><button class="pri" data-v="lettre-garder">La garder sur soi</button><button class="sec" data-v="lettre-ranger">La ranger dans le coffre</button></div>`);
  if (r.lettre === "glissee") r.lettre = "lue";
  M.savoir(V(), "alienor", "lettre_miche", 1, "lettre", true); majClos(); save();
}
ACTIONS["lettre-garder"] = () => { V().recit.lettre = "gardee"; V().inventaire.lettre = 1; closePanel(); mode = "play"; say("La lettre est dans votre poche. Rien ne vous oblige à en faire quelque chose aujourd’hui."); apres(); };
ACTIONS["lettre-ranger"] = () => { V().recit.lettre = "rangee"; delete V().inventaire.lettre; closePanel(); mode = "play"; say("La lettre est dans le coffre, sous les épreuves gâchées."); apres(); };

function provisions() {
  const v = V(), r = v.recit, j = M.jour(v);
  const lignes = [["", r.provisions ? "Le garde-manger n’a pas changé." : "Sur la table : un quignon d’hier, un fond de sel, des oignons qui germent. La cruche est vide."]];
  r.provisions = true;
  if (!M.applique(v, "quignon:" + j)) lignes.push(choix([["Manger le quignon", () => { M.appliquer(v, "quignon:" + j, () => { v.barres.satiete = Math.min(100, v.barres.satiete + 12); }); talk([["", "Le pain est dur. Il tient au corps jusqu’à l’atelier."]], apres); }], ["Le garder", rien]]));
  talk(lignes, apres);
}
function puits() {
  const v = V();
  if (v.inventaire.eau) return talk([["", "La cruche est déjà pleine."]]);
  v.inventaire.eau = 1; sfx("puits");
  const qui = M.presents(v, "maison_ysabeau").length ? "Chez Ysabeau, une fenêtre s’ouvre, puis se referme." : "Personne au puits : le clos est parti porter son sac.";
  talk([["", "La corde grince, le seau remonte. Vous remplissez la cruche."], ["", qui]], apres);
}
const GRILLES_CLOS = {
  maison: { nom: "Maison", largeur: 5, hauteur: 3, x: -1.5, z: -1.65 },
  jardin: { nom: "Jardin", largeur: 5, hauteur: 3, x: 1, z: 12.7 }
};
const OBJETS_CLOS = {
  tabouret: { nom: "Tabouret", zone: "maison", bois: 2 },
  banc: { nom: "Banc", zone: "maison", bois: 4 },
  bac: { nom: "Bac", zone: "jardin", bois: 2 }
};
const SEMIS_CLOS = {
  chou: { nom: "Chou", jours: 1, produit: "legumes" },
  sauge: { nom: "Sauge", jours: 2, produit: "sauge_recoltee" }
};
let choixClos = null;
const decorClos = new Map();
function amenagement() {
  return V().amenagement || (V().amenagement = {
    objets: [{ type: "tabouret", case: 4 }, { type: "bac", case: 6 }],
    reserve: [], collecte: null
  });
}
function positionCase(zone, index) {
  const g = GRILLES_CLOS[zone];
  return CL(g.x + index % g.largeur, g.z + Math.floor(index / g.largeur));
}
function caseDisponible(zone, index) {
  const p = positionCase(zone, index);
  // Garder une traversée libre devant la porte, le miroir et les meubles du fond.
  if (zone === "maison" && index >= 2 * GRILLES_CLOS.maison.largeur) return false;
  return !blocked(p.x, p.z) && Math.hypot(player.position.x-p.x, player.position.z-p.z) >= .88;
}
function pret(culture) {
  if (!culture || culture.eauJour === null) return false;
  const j = M.jour(V());
  return j >= culture.plante + Math.max(1, SEMIS_CLOS[culture.type].jours - Number(culture.compost)) && j > culture.eauJour;
}
function afficherAmenagement() {
  const state = amenagement();
  state.objets.forEach((objet, id) => {
    const type = OBJETS_CLOS[objet.type], p = positionCase(type.zone, objet.case);
    let rendu = decorClos.get(id);
    if (!rendu || rendu.type !== objet.type) {
      if (rendu) { rendu.g.removeFromParent(); rendu.b.on = false; }
      const g = new THREE.Group();
      const mesh = (geo, c, x, y, z, sx, sy, sz) => {
        const m = new THREE.Mesh(geo, LM(c));
        m.position.set(x,y,z); m.scale.set(sx,sy,sz); m.castShadow=true; g.add(m); return m;
      };
      const taille = objet.type === "banc" ? .72 : .46;
      if (objet.type === "bac") {
        mesh(G.box, WOOD, 0,.15,0,.70,.3,.70);
        mesh(G.box, 0x604631, 0,.305,0,.61,.025,.61);
      } else {
        mesh(G.box, WOOD, 0,.47,0,taille,.10,.42);
        for (const x of [-taille*.38,taille*.38])
          for (const z of [-.15,.15]) mesh(G.box, SEPIA,x,.21,z,.065,.42,.065);
      }
      const plante = mesh(G.s, FORET,0,.4,0,.22,.18,.22);
      scene.add(g);
      rendu = { g, plante, type: objet.type, b: solid(0,0,0,0) };
      decorClos.set(id, rendu);
    }
    rendu.g.position.set(p.x,0,p.z);
    Object.assign(rendu.b, { x0:p.x-.34, x1:p.x+.34, z0:p.z-.34, z1:p.z+.34, on:true, low:true });
    rendu.plante.visible=!!objet.culture;
    rendu.plante.scale.setScalar(pret(objet.culture) ? .34 : .17);
  });
  for (const [id, rendu] of decorClos) {
    if (id < state.objets.length) continue;
    rendu.g.removeFromParent();
    rendu.b.on=false;
    decorClos.delete(id);
  }
}
function amenager(zone, message = "") {
  const grid = GRILLES_CLOS[zone], state = amenagement(), inv = V().inventaire, j = M.jour(V());
  const selection = choixClos?.zone === zone ? choixClos : null;
  const enfant = selection && state.objets.find(o => OBJETS_CLOS[o.type].zone === zone && o.case === selection.case);
  const type = enfant?.type || selection?.type;
  const cellules = Array.from({length:grid.largeur*grid.hauteur}, (_, i) => {
    const objet = state.objets.find(o => OBJETS_CLOS[o.type].zone === zone && o.case === i);
    const libre = !objet && caseDisponible(zone, i), apercu = selection?.cible === i && libre && !!type;
    const nom = objet ? objet.culture ? SEMIS_CLOS[objet.culture.type].nom + (pret(objet.culture) ? " mûr" : "") : OBJETS_CLOS[objet.type].nom
      : apercu ? OBJETS_CLOS[type].nom + " (aperçu)" : libre ? "Libre" : "Passage";
    return `<button data-v="clos-case" data-zone="${zone}" data-i="${i}" aria-label="Case ${i+1}, ${nom}" aria-pressed="${selection?.case === i || apercu}"${apercu ? " data-apercu" : ""}${!libre && !objet ? ' aria-disabled="true"' : ""}>${nom}</button>`;
  }).join("");
  const button = (action,label) => `<button class="sec" data-v="clos-action" data-zone="${zone}" data-k="${action}">${label}</button>`;
  const outils = zone === "maison" ? [
    state.collecte !== j && button("bois","Récupérer 4 morceaux de bois"),
    ...Object.entries(OBJETS_CLOS).map(([k,v])=>button(k,`Fabriquer · ${v.nom} (${v.bois} bois)`)),
    button("compost","Préparer du compost (1 botte de légumes)")
  ] : [
    !enfant?.culture && button("chou","Semer du chou"),
    !enfant?.culture && button("sauge","Semer de la sauge"),
    enfant?.culture && button("eau","Arroser"),
    enfant?.culture && button("fertiliser","Ajouter du compost"),
    pret(enfant?.culture) && button("recolter","Récolter"),
    button("graines","Acheter des graines (2 sous)")
  ];
  const reserve = [...new Set(state.reserve)].filter(k=>OBJETS_CLOS[k].zone===zone)
    .map(k=>button("placer-"+k,`Placer · ${OBJETS_CLOS[k].nom} (${state.reserve.filter(t=>t===k).length})`));
  mode="panel"; refreshHud();
  const commande = selection ? `<div class="row">${selection.cible != null
    ? `<button class="pri" data-v="clos-confirmer" data-zone="${zone}">Confirmer le placement</button>` : ""}${button("annuler","Annuler la sélection")}</div>` : "";
  panel(`<h2>${grid.nom}</h2><p class="small">Sélectionne un objet, puis une case libre pour prévisualiser le placement. Chaque objet occupe une case.</p>
    <div class="grille-clos" style="--colonnes:${grid.largeur}">${cellules}</div>
    ${commande}
    <p class="small" role="status">${esc(message)}</p>
    <p class="small">Bois ${inv.bois_clos||0} · Eau ${inv.eau||0} · Compost ${inv.compost||0} · Graines ${inv.graine_chou||0} chou / ${inv.graine_sauge||0} sauge</p>
    <div class="row">${[...reserve,...outils].filter(Boolean).join("")}</div>
    <div class="row"><button class="pri" data-v="clos-retour">Retour au jeu</button></div>`);
}
ACTIONS["clos-retour"] = () => { choixClos=null; closePanel(); enterPlay(); };
ACTIONS["clos-case"] = b => {
  const zone=b.dataset.zone, index=Number(b.dataset.i), state=amenagement(), g=GRILLES_CLOS[zone];
  if (!g || !Number.isInteger(index) || index<0 || index>=g.largeur*g.hauteur) return;
  const objet=state.objets.find(o=>OBJETS_CLOS[o.type].zone===zone&&o.case===index);
  if (objet) { choixClos={zone,case:index}; return amenager(zone,"Objet sélectionné."); }
  if (choixClos?.zone!==zone) return;
  if (!caseDisponible(zone,index)) return amenager(zone,"Cette case est réservée à la circulation.");
  choixClos.cible=index;
  return amenager(zone,"Vérifie l’emplacement puis confirme, ou choisis une autre case.");
};
ACTIONS["clos-confirmer"] = b => {
  const zone=b.dataset.zone, index=choixClos?.cible, state=amenagement();
  if (choixClos?.zone!==zone || !Number.isInteger(index)) return;
  if (state.objets.some(o=>OBJETS_CLOS[o.type].zone===zone&&o.case===index) || !caseDisponible(zone,index))
    return amenager(zone,"Cette case ne peut plus accueillir cet objet.");
  if (choixClos.type) {
    const i=state.reserve.indexOf(choixClos.type);
    if (i<0) return;
    state.objets.push({type:state.reserve[i],case:index});
    state.reserve.splice(i,1);
  } else {
    const source=state.objets.find(o=>OBJETS_CLOS[o.type].zone===zone&&o.case===choixClos.case);
    if (!source) return;
    source.case=index;
  }
  choixClos=null; afficherAmenagement(); save(); amenager(zone,"Objet placé.");
};
ACTIONS["clos-action"] = b => {
  const zone=b.dataset.zone, action=b.dataset.k, state=amenagement(), v=V(), inv=v.inventaire, j=M.jour(v);
  const bac=choixClos?.zone==="jardin"&&state.objets.find(o=>o.type==="bac"&&o.case===choixClos.case);
  const culture=bac?.culture, recette=OBJETS_CLOS[action];
  const refuser=msg=>amenager(zone,msg);
  const ajouter=(k,n=1)=>{ inv[k]=(inv[k]||0)+n; if(!inv[k])delete inv[k]; };
  let message;
  if(action==="annuler"){choixClos=null;return amenager(zone,"Le placement est inchangé.");}
  if(action==="bois"&&zone==="maison"&&state.collecte!==j){state.collecte=j; ajouter("bois_clos",4);message="Bois récupéré.";}
  else if(recette&&zone==="maison"){
    if((inv.bois_clos||0)<recette.bois)return refuser("Il manque du bois.");
    ajouter("bois_clos",-recette.bois);state.reserve.push(action);message=recette.nom+" fabriqué.";
  } else if(action.startsWith("placer-")&&state.reserve.includes(action.slice(7))&&OBJETS_CLOS[action.slice(7)].zone===zone){
    choixClos={zone,type:action.slice(7)};return amenager(zone,"Choisis une case libre.");
  } else if(action==="compost"&&zone==="maison"){
    if(!inv.legumes)return refuser("Il faut une botte de légumes.");
    ajouter("legumes",-1);ajouter("compost");message="Compost préparé.";
  } else if(action==="graines"&&zone==="jardin"){
    if(v.bourse<2)return refuser("Il faut deux sous.");
    v.bourse-=2; ajouter("graine_chou");ajouter("graine_sauge");message="Une graine de chaque variété.";
  } else if(SEMIS_CLOS[action]&&zone==="jardin"){
    if(!bac||culture)return refuser("Sélectionne un bac vide.");
    if(!inv["graine_"+action])return refuser("Il manque une graine.");
    ajouter("graine_"+action,-1);bac.culture={type:action,plante:j,eauJour:null,compost:false};message="Semis effectué.";
  } else if(action==="eau"&&culture){
    if(culture.eauJour!==null)return refuser("Ce semis a déjà été arrosé.");
    if(!inv.eau)return refuser("Remplis la cruche au puits.");
    ajouter("eau",-1);culture.eauJour=j;message="Semis arrosé.";
  } else if(action==="fertiliser"&&culture){
    if(!inv.compost||culture.compost)return refuser("Il faut du compost et un semis à fertiliser.");
    ajouter("compost",-1);culture.compost=true;message="Compost ajouté.";
  } else if(action==="recolter"&&pret(culture)){
    ajouter(SEMIS_CLOS[culture.type].produit,2);
    ajouter("graine_"+culture.type);
    delete bac.culture;v.competences.culture+=.5;message="Récolte rangée dans l’inventaire.";
  } else return;
  afficherAmenagement();save();amenager(zone,message);
};
function chezYsabeau() {
  const v = V(), ici = M.lieuDe(v, "ysabeau") === "maison_ysabeau";
  if (rencontreDisponible("ysabeau", "maison_ysabeau")) return rencontre("ysabeau", "maison_ysabeau");
  sfx("frapper"); if (ici) setTimeout(() => sfx("porte"), 1200);
  if (!ici) return talk([["", "Vous frappez. Personne. " + (M.estJourTribut(M.jour(v)) ? "Ysabeau est déjà partie pour la place, avec son sac." : "Ysabeau est au marché à cette heure-ci.")],
    choix([!M.applique(v, "mot:ysabeau:" + M.jour(v)) && ["Glisser un mot sous sa porte", () => {
      M.appliquer(v, "mot:ysabeau:" + M.jour(v), () => { M.lier(v, "ysabeau", "alienor", 0.5, 0); M.observer(v, "mot:ysabeau:" + M.jour(v), "ysabeau", "maison_ysabeau", "Aliénor a laissé un mot sous la porte."); });
      save(); talk([["", "Trois lignes à la craie sur un bout d’épreuve : « Passée vous voir. Aliénor. »"]], apres);
    }], ["Repasser plus tard", rien]])]);
  talk([[YS, "« Entre, ma fille, il fait froid sur le seuil. »"], [YS, vary("ys-clos", ["« Tu as mangé ? Non. Évidemment. »", "« Ta mère avait la même façon de frapper. Trois coups, et elle entrait sans attendre. »"])]], apres);
}

/* Le miroir : essayer, puis choisir entre la robe ocre et la robe indigo. */
const ROBES = { ocre: OCRE, indigo: INDIGO };
function robeSVG(c) {
  const hex = "#" + c.toString(16).padStart(6, "0");
  return `<svg viewBox="0 0 110 170" aria-hidden="true"><ellipse cx="55" cy="24" rx="13" ry="15" fill="#e9c9a6" stroke="#221f2b" stroke-width="1.5"/><path d="M42 16 C44 2 66 2 68 16 C66 10 46 10 42 16Z" fill="#6a4a30"/>
  <path d="M40 44 C46 38 64 38 70 44 L74 86 C88 120 98 150 102 164 L8 164 C12 150 22 120 36 86 Z" fill="${hex}" stroke="#221f2b" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M36 86 L74 86" stroke="#221f2b" stroke-width="1.2"/><path d="M40 46 L28 92 M70 46 L82 92" stroke="${hex}" stroke-width="9" stroke-linecap="round"/><path d="M48 44 Q55 52 62 44" fill="none" stroke="#f3ecdd" stroke-width="2"/></svg>`;
}
let essai = null;
function miroir() {
  essai = essai || V().tenue || "ocre"; mode = "panel"; refreshHud();
  panel(`<span class="kick">Le miroir</span><h2>Quelle robe aujourd’hui ?</h2><p class="small">Le miroir est piqué, mais il dit l’essentiel. Essayez, puis choisissez.</p>
    <div class="miroir">${Object.keys(ROBES).map(k => `<button data-v="essayer" data-r="${k}" aria-pressed="${essai === k}">${robeSVG(ROBES[k])}<span>La robe ${k}</span></button>`).join("")}</div>
    <p class="small">${essai === "ocre" ? "L’ocre est la couleur des jours de travail : elle cache l’encre et la farine." : "L’indigo est la teinture des Drapiers : on la remarque, et on remarque celle qui la porte."}</p>
    <div class="row"><button class="pri" data-v="choisir-robe">Mettre la robe ${essai}</button><button class="sec" data-v="fermer">Laisser pour l’instant</button></div>`);
}
ACTIONS.essayer = b => { essai = b.dataset.r; miroir(); };
ACTIONS["choisir-robe"] = () => { const v = V(); v.tenue = essai; closePanel(); mode = "play"; say(`La robe ${essai}. Aliénor lisse le tissu et attache son tablier par-dessus.`); apres(); };
ACTIONS.fermer = () => { closePanel(); mode = "play"; apres(); };

function sortir(avantAtelier) {
  const r = V().recit;
  if (r.etape === "reveil") {
    const reste = [];
    if (r.lettre === "glissee") reste.push("la lettre est encore sur le seuil");
    if (!V().tenue) reste.push("vous n’avez pas choisi de robe");
    return talk([["", reste.length ? "Avant d’entrer : " + reste.join(", ") + "." : "La porte de l’atelier. On entend déjà la presse."], choix([["Entrer à l’atelier", () => partirAtelier(avantAtelier)], ["Pas encore", rien]])]);
  }
  if (r.etape === "soir") return talk([["", "Des rires montent de la place. La Fête de l’Un commence."], choix([["Aller à la fête (acte II)", () => { r.etape = "fete"; save(); startAct2(); }], ["Rester encore un peu", rien]])]);
  if (r.etape === "lendemain") return talk([["", "Le lendemain de la fête, la ville se lève tard. La suite du récit, l’hiver et l’acte III, est en cours d’écriture."], ["", "Votre journée est enregistrée : vous la retrouverez telle quelle."]], apres);
}
function partirAtelier(avantAtelier) {
  fermerDlg(); const v = V();
  mode = "turn"; refreshHud(); sfx("porte");
  wash(() => {
    if (!v.tenue) v.tenue = "ocre";
    v.recit.etape = "ville"; zoneShown.place = 1;
    player.position.set(-19, 0, 7); player.rotation.y = -Math.PI / 2;
    if (avantAtelier) avantAtelier();
    save(); setScene(true); firstExchange = false; startMovie("matin", enterPlay);
  });
}

/* ================= Prise de poste, cloche et tableau des commandes ================= */
const _setStage = setStage;
setStage = function (n) {
  const v = V(), r = v.recit;
  if (n === 1 && S.act === 1 && !r.poste) {
    r.poste = true; save();
    return talk([[AN, "« Avant que la cloche sonne, regarde le tableau, derrière moi : des petites commandes. Ce qui est livré est payé. Rien ne t’y oblige. »"],
      ["", "La cloche de la place sonne trois coups. Le percepteur ouvre le tribut. La file avancera jusqu’au soir : vous la rejoindrez quand vous voudrez."]],
      () => { r.cloche = true; cloche(3); _setStage(1); });
  }
  if (n === 2 && S.act === 1) {
    r.tribut = true;
    if (S.flags.tribut === "paye") M.appliquer(v, "tribut:mesure", () => { v.bourse = Math.max(0, v.bourse - 5); M.noter(v, "Le tribut : 5 sous de votre poche pour la mesure qui manquait."); });
    M.appliquer(v, "tribut:consequences", () => {
      if (S.flags.tribut === "denonce") M.savoir(v, "garin", "garin_denonce", 1, "percepteur", false);
      M.conviction(v, S.flags.tribut === "refus" ? 6 : S.flags.tribut === "denonce" ? -8 : -2,
        { refus: "Elle a posé la question tout haut. Son nom est écrit en grand.", denonce: "Elle a payé avec le nom d’un autre. La phrase du percepteur ne la quitte pas.", paye: "Elle a payé, comme tout le monde. Elle se demande ce que veut dire « comme tout le monde »." }[S.flags.tribut]);
    });
  }
  return _setStage(n);
};
INTER.push({ p: () => ({ x: -22.6, z: 9.2 }), r: 1.8, label: "Le tableau des commandes", can: () => S.act === 1 && V().recit.poste, act() { tableau(); } });
function tableau() {
  const v = V(); mode = "panel"; refreshHud();
  const ex = M.EXAMENS.composer, fait = v.examens.composer === "reussi";
  panel(`<span class="kick">Atelier d’Anselme · ${esc(PL())}</span><h2>Le tableau des commandes</h2><p class="small">Chaque commande affiche ce qu’elle demande avant que vous vous engagiez. Le paiement arrive à la livraison. Endurance actuelle : ${Math.round(v.barres.endurance)}.</p>
  ${Object.keys(M.TRAVAUX).map(id => { const d = M.devis(v, id); return `<div class="devis"><h3>${esc(d.nom)}</h3><p>${esc(d.texte)}</p><dl><dt>Pour</dt><dd>${esc(M.HABITANTS[d.client].nom)}</dd><dt>Délai</dt><dd>${esc(d.delai)}${d.plages ? `, fini ${esc(d.finit === "soir" ? "au soir" : "dans l’" + d.finit)}` : ""}</dd><dt>Paie</dt><dd>${d.paie} sous</dd><dt>Effort</dt><dd>${d.effortReel} d’endurance</dd><dt>Matériaux</dt><dd>${esc(d.materiaux)}</dd><dt>Signature</dt><dd>${esc(d.signature)}</dd></dl>
    ${d.bloque ? `<p class="small">${esc(d.bloque)}</p>` : !d.endurant ? `<p class="small">Trop fatiguée pour l’instant.</p><div class="row"><button class="sec" data-v="pause">Faire une pause</button></div>` : `<div class="row"><button class="pri" data-v="travail" data-w="${id}">S’engager</button></div>`}</div>`; }).join("")}
  <div class="devis"><h3>Épreuve : ${esc(ex.nom)}</h3><p>${fait ? "Réussie. Les commandes de quartier mieux payées vous sont ouvertes." : "Facultative. Ouvre " + esc(ex.ouvre) + ". Vous pouvez la passer aujourd’hui ou plus tard."}</p>${fait ? "" : `<div class="row"><button class="sec" data-v="examen">Passer l’épreuve</button></div>`}</div>
  <div class="row"><button class="pri" data-v="fermer">Retour</button></div>`, true);
}
ACTIONS.pause = () => { const g = M.pause(V()); say(g ? `Un moment assise sur le banc de l’atelier. Endurance +${g}.` : "Encore une pause ? Anselme vous regarde."); apres(); tableau(); };

/* Trois commandes courtes, chacune avec une vraie décision d'atelier. */
const EXOS = {
  ecriteau: { q: "Pour qu’on lise « CAGES » sur l’écriteau, quelle composition poser dans le composteur ?", opts: [["CAGES", false], ["CAGES", true, "envers"], ["SEGAC", false]], ok: "À la presse, les lettres s’impriment à l’endroit. Bertin paie sans lire : il ne sait pas.", ko: "Imprimé, ce serait à l’envers. Les caractères se posent comme dans un miroir. Reprenez." },
  bon: { q: "Bon du fournil : « Livré par le palais : douze boisseaux. Pesé à la balance du palais : douze. Pesé au fournil : onze et demi. À payer : douze. » Quelle ligne corriger ?", opts: [["Livré par le palais : douze boisseaux", false], ["À payer : douze", true], ["Pesé au fournil : onze et demi", false]], ok: "On paie ce qu’on reçoit : onze et demi. Mais sur le bon, la balance du palais a le dernier mot. Vous gardez une copie.", ko: "Ce chiffre-là est juste : il a été pesé. Relisez ce qu’on fait payer à Maëlle." },
  livraison: { q: "Vingt avis pour la rue des Drapiers. Par où commencer ?", opts: [["Par le tailleur, qui affiche en vitrine", true], ["Par la fin de la rue, pour finir près de l’atelier", true]], ok: "Les avis sont livrés. Perrine en prend deux, pour sa voisine qui ne sort plus.", ko: "" },
  affiche: { q: "L’affiche du boucher : « Viande fraîche les mardi, jeudi et samedi. » Que mettre en plus gros ?", opts: [["Les jours", true], ["Le mot « fraîche »", false]], ok: "Les jours se lisent de loin. Le boucher est content : il commandera encore.", ko: "On lit de loin ce qui est gros : pour venir aux halles, il faut d’abord les jours. Reprenez." }
};
ACTIONS.travail = b => {
  const id = b.dataset.w, k = M.accepter(V(), id);
  if (!k) return tableau();
  save(); exo(id, k);
};
function exo(id, k, rate) {
  const e = EXOS[id]; mode = "panel"; refreshHud();
  panel(`<span class="kick">${esc(M.TRAVAUX[id].nom)}</span><p>${esc(e.q)}</p>${rate ? `<p class="small">${esc(e.ko)}</p>` : ""}
  <div class="ch">${e.opts.map((o, i) => `<button data-v="exo" data-w="${id}" data-k="${k}" data-i="${i}">${o[2] ? `<span class="compo envers">${esc(o[0])}</span>` : esc(o[0])}</button>`).join("")}</div>`);
}
ACTIONS.exo = b => {
  const id = b.dataset.w, k = b.dataset.k, o = EXOS[id].opts[+b.dataset.i];
  if (!o[1]) return exo(id, k, true);
  const v = V(), avant = v.bourse;
  M.livrer(v, k);
  closePanel(); mode = "play";
  talk([["", EXOS[id].ok], ["", `${v.bourse - avant} sous dans la bourse. Il est maintenant le ${PL()}.`]], () => { sfx("coins"); setScene(true); apres(); });
};
ACTIONS.examen = () => examen(0, 0);
const EPREUVE = [
  { t: "Anselme pose une ligne dans la galée : « Le pain se vend au poids du roi. » Il manque quelque chose. Quoi ?", o: ["Rien, elle est juste", "Une espace entre deux mots", "Une majuscule"], ok: 1, dit: "« Regarde entre “poids” et “du”. Une espace fine a sauté. »" },
  { t: "Il imprime une épreuve. Une lettre est retournée. Laquelle ?", o: ["Le u de « pain », imprimé comme un n", "Le P majuscule", "Le point final"], ok: 0, dit: "« Le u et le n se ressemblent dans la casse. On ne les confond qu’une fois. »" }
];
function examen(i, faute) {
  if (i >= EPREUVE.length) { M.passerExamen(V(), "composer", true); closePanel(); mode = "play"; return talk([[AN, "« Bien. Tu composeras pour les halles. La prochaine fois, c’est toi qui conduiras le tirage. »"]], apres); }
  const e = EPREUVE[i]; mode = "panel";
  panel(`<span class="kick">Épreuve · composer une commande</span><p>${esc(e.t)}</p>${faute ? `<p class="small">${esc(e.dit)} Reprenez.</p>` : ""}<div class="ch">${e.o.map((o, k) => `<button data-v="rep" data-i="${i}" data-k="${k}">${esc(o)}</button>`).join("")}</div><div class="row"><button class="sec" data-v="fermer">Remettre à plus tard</button></div>`);
}
ACTIONS.rep = b => { const i = +b.dataset.i, e = EPREUVE[i]; if (+b.dataset.k === e.ok) examen(i + 1, false); else examen(i, true); };

/* ================= Courses, pesée de la miche et sujets ================= */
const inter = lab => INTER.find(x => x.label === lab);
const ysI = inter("Parler à Ysabeau"), _ys = ysI.act;
ysI.act = function () {
  const v = V(), temoin = M.sait(v, "ysabeau", "pesee_publique");
  if (S.act === 1 && temoin && M.observer(v, "pesee:ysabeau", "ysabeau", "place", temoin.vu
    ? "Ysabeau dit avoir vu la miche posée sur la balance."
    : "Ysabeau a entendu parler de la pesée publique.")) {
    save();
    return talk([[YS, temoin.vu ? "« J’ai vu la miche sur la balance. Il manquait du poids, oui. J’irai quand même chercher mon pain chez Maëlle. »"
      : "« On m’a raconté pour la miche. Mais raconter une pesée, ce n’est pas avoir vu la balance. »"]], () => _ys.call(this));
  }
  return _ys.call(this);
};
const maelleI = inter("Parler à Maëlle"), _maelle = maelleI.act;
maelleI.act = function () { if (S.act === 1 && S.stage < 2) return fournil(true); return _maelle.call(this); };
INTER.push({ p: () => ({ x: N.maelle.position.x - 1.6, z: N.maelle.position.z - 0.2 }), r: 1.5, label: "Le fournil", can: () => S.act === 1 && S.stage >= 2, act() { fournil(false); } });
function fournil(avantTribut) {
  if (rencontreDisponible("maelle", "fournil")) return rencontre("maelle", "fournil");
  const v = V(), r = v.recit;
  M.saluer(v, "maelle");
  const ouvre = M.ouvert(v, "fournil");
  const conf = M.lien(v, "maelle", "alienor").conf;
  const accueil = !ouvre ? "« Le four est froid à cette heure. Reviens demain matin. »"
    : conf < 0 ? "« Une miche, un sou. Si tu as autre chose à me dire, attends qu’on soit seules. »"
    : conf > 0 ? "« Bonjour, Aliénor. J’ai gardé du pain pour les gens du quartier. »"
    : avantTribut ? "« Une miche ? Un sou. Ce matin j’en garde peu : le reste part au palais avec la farine. »"
    : vary("ma-four", ["« Il m’en reste trois. Après le tribut, on dirait que la ville a moins faim. »", "« Un sou la miche. Le même sou qu’hier, pour moins de pain. »"]);
  const opts = [];
  if (ouvre) opts.push(["Acheter une miche (1 sou)", () => { const a = M.acheter(v, "fournil", "miche"); if (a.ok) sfx("coins"); save(); talk([["", a.ok ? "Maëlle enveloppe la miche dans un linge." : a.raison]], () => fournil(avantTribut)); }]);
  const lettreLue = r.lettre !== "glissee";
  const clients = temoinsFournil(v);
  if (lettreLue && !r.pesee && avantTribut && ouvre && clients.length) {
    opts.push(["Demander qu’on pèse la miche, devant les clientes", peseePublique]);
    opts.push(["Attendre d’être seule avec elle pour parler de la miche", () => { r.peseeAttente = true; save(); talk([["", "Trop de monde autour de l’étal. Après le tribut, la place se videra."]], apres); }]);
  }
  if (lettreLue && !r.pesee && ouvre && (!avantTribut || !clients.length)) opts.push(["Lui parler du poids de la miche, entre vous", peseePrivee]);
  if (!avantTribut && ouvre) {
    const pere = v.sujets["maelle:pere"];
    opts.push([pere ? "Revenir sur le four de son père (insister)" : "Lui demander des nouvelles de son père", () => sujetPere(!!pere)]);
    if (v.sujets["maelle:miche"] && v.inventaire.bon_de_farine) opts.push(["Lui montrer la copie du bon de farine", sujetBon]);
  }
  opts.push(["Rien pour l’instant", rien]);
  talk([[MA, accueil], choix(opts)], apres);
}
const temoinsFournil = v => M.presents(v, "fournil").concat(M.presents(v, "place"))
  .filter(h => !["maelle", "percepteur"].includes(h));
function peseePublique() {
  const v = V(), clients = temoinsFournil(v);
  if (!M.peserMiche(v, "public")) return;
  M.parler(v, "maelle:miche"); save(); sfx("balance");
  talk([[AL, "« Maëlle, tu veux bien peser cette miche ? Là, devant nous. »"], ["", "Maëlle hésite, puis pose la miche sur sa balance. Les clientes se penchent. Il manque un bon quart de livre."],
    [clients.includes("perrine") ? "Perrine" : M.HABITANTS[clients[0]]?.nom || "Une cliente", "« Un quart ! Et on paie le plein. »"], [MA, "« Tu crois que je vole ? Devant tout le monde ? »"], ["", "Maëlle range la miche sans un mot de plus."]], apres);
}
function peseePrivee() {
  const v = V(); if (!M.peserMiche(v, "prive")) return;
  M.parler(v, "maelle:miche"); save();
  talk([[AL, "« Ce matin, on m’a écrit de faire peser ta miche. Je ne l’ai pas fait. Je préfère te le demander. »"], [MA, "« Elle est légère. Je sais. »"],
    [MA, "« La farine me vient du palais. Ils la pèsent sur leur balance avant de me la livrer. Leur boisseau est court. Je paie le plein, je reçois le court, et la miche porte la différence. »"],
    [AL, "« Et si on le disait ? »"], [MA, "« On dirait que c’est moi qui triche. Tu sais comment on regarde une boulangère dont la miche est légère. »"]], apres);
}
function sujetPere(deja) {
  const v = V(), res = M.parler(v, "maelle:pere", { insister: deja });
  if (res === "nouveau") return talk([[MA, "« Il ne descend plus au fournil. Il reste assis devant la fenêtre et il compte ses mains. »"], [MA, "« Ne me demande pas s’il va mieux. »"]], apres);
  return talk([[MA, "« Je t’ai dit de ne pas me le demander. »"], ["", "Maëlle se retourne vers son four. Elle n’en dira pas plus aujourd’hui."]], apres);
}
function sujetBon() {
  const v = V(), res = M.parler(v, "maelle:miche");
  if (res === "suite") {
    M.appliquer(v, "preuve:bon_de_farine:maelle", () => {
      M.savoir(v, "alienor", "miche_legere", 2, "bon", true); M.lier(v, "maelle", "alienor", 1, 1);
      M.observer(v, "preuve:bon_de_farine", "maelle", "fournil", "Maëlle a reconnu sur le bon l’écart entre les quantités payées et livrées.");
    });
    save();
    return talk([[MA, "« C’est mon bon ? Tu l’as corrigé ? »"], [AL, "« Douze payés, onze et demi reçus. Ce n’est pas ta balance qui ment. C’est la leur. »"], [MA, "« Alors il y a deux balances dans cette ville. Une pour ce qu’on doit, une pour ce qu’on reçoit. »"]], apres); }
  return talk([[MA, "« Tu me l’as déjà montré. Je sais lire les chiffres, au moins. »"]], apres);
}

/* Les halles : le boucher, les paniers de Jeanne, le banc du chasseur (jours de marché). */
// D'après l'atlas : les halles au sud-est de la fontaine, avec les étals tournants du marché.
const HALLES = [
  { b: "boucher", lab: "L’étal du boucher", x: 11, z: 15.2, look: { top: BLANC, apron: 0xd8c8b8, legs: SEPIA, hat: "cap", hatc: SIENNE, beard: 0x5a4130 } },
  { b: "paysanne", lab: "Les paniers de Jeanne", x: 15.5, z: 15.2, look: { top: 0x8a6a48, bottom: 0x6e5338, skirt: true, apron: OCRE, hat: "coif" } },
  { b: "chasseur", lab: "Le banc du chasseur", x: 18.4, z: 15.2, look: { top: FORET, legs: SEPIA, hat: "hood", hatc: 0x4f6f4e, pouch: SEPIA } }
];
// Les étals ne sont là qu'à l'acte I : le soir de la fête, cette partie de la place appartient aux tréteaux.
const hallesSolides = [];
const hallesMesh = (() => {
  B.p = []; B.n = []; B.c = []; B.t = []; B.pop();
  const n = boxes.length; stall(11, 13.6, SIENNE, BLANC); stall(15.5, 13.6, OCRE, BLANC); put(G.box, WOOD, 18.4, 0.45, 13.8, 1.8, 0.9, 0.6); solid(17.5, 19.3, 13.5, 14.1);
  // pas de toit : la caméra passe au sud des étals quand Aliénor traverse la place
  hallesSolides.push(...boxes.slice(n)); B.pop();
  const m = wobble(B.mesh(cityPaint), 0.32); B.p = []; B.n = []; B.c = []; B.t = []; scene.add(m); return m;
})();
for (const h of HALLES) { h.g = human(Object.assign({ noOutline: true, x: h.x, z: h.z, ry: 0 }, h.look)); h.c = [h.x, h.z, 0.55, false]; circles.push(h.c); }
// La Caisse des métiers, au nord-est de la place, contre le palais.
dio(0, () => {
  simpleHouse(16, -13.2, 0, 6, 3.4, 4.6, 0xd8c9a4, SLATE); solid(13, 19, -14.9, -11.5);
  put(G.box, SEPIA, 16, 1.2, -11.47, 1.4, 2.4, 0.08); put(G.box, SIENNE, 16, 3.1, -11.45, 3.2, 0.7, 0.06);
  for (const dx of [-2, 2]) put(G.box, 0x2b2f45, 16 + dx, 1.6, -11.47, 0.9, 1.1, 0.08);
});
INTER.push({ p: () => ({ x: 16, z: -10.2 }), r: 2, label: "La Caisse des métiers", can: () => !enClos() && S.act === 1, act() {
  const v = V(); talk([["", "La Caisse des métiers : un comptoir, un registre, des devis épinglés. On y épargne, on y demande une avance sur un devis."], ["", M.estJourTribut(M.jour(v)) ? "« Fermé le jour du tribut. »" : "Le commis lève les yeux : « Revenez avec un devis du menuisier. »"]], apres); } });
function majHalles() { if (!HALLES[0].g) return; const jour = S.act === 1 && !enClos(); hallesMesh.visible = S.act === 1; for (const x of hallesSolides) x.on = S.act === 1; for (const h of HALLES) h.c[3] = h.g.visible = jour && M.ouvert(V(), h.b); }
for (const h of HALLES) INTER.push({ p: () => ({ x: h.x, z: h.z + 0.9 }), r: 1.8, label: h.lab, can: () => S.act === 1, act() { halle(h); } });
function halle(h) {
  const v = V(), B = M.BOUTIQUES[h.b], art = B.articles[0], A = M.ARTICLES[art];
  v.adresses[h.b] = M.horaires(h.b);
  if (!M.ouvert(v, h.b)) return talk([["", `${B.nom} : personne. Une ardoise indique « ${M.horaires(h.b)} ». C’est noté dans le carnet.`]], apres);
  M.saluer(v, B.hab);
  talk([[M.HABITANTS[B.hab].nom, vary("halle-" + h.b, ["« Pour vous ce sera ? »", "« Le tribut ou pas, il faut bien manger. »"])],
    choix([[`Acheter ${A.nom} (${A.prix} sou${A.prix > 1 ? "s" : ""})`, () => { const r = M.acheter(v, h.b, art); if (r.ok) sfx("coins"); talk([["", r.ok ? "C’est dans votre panier." : r.raison]], apres); }], ["Rien, merci", rien]])], apres);
}
function halles() {
  const opts = HALLES.map(h => [h.lab, () => halle(h)]);
  talk([["", "Les marchands des halles ont laissé leurs ardoises devant les étals."], choix(opts.concat([["Repartir", rien]]))], apres);
}

/* Les choix de la fête nourrissent le même journal que les rencontres du jour. */
const _reponseGarin = reponseGarin;
reponseGarin = function (aveu) {
  const v = V();
  M.appliquer(v, "fete:aveu-garin", () => {
    M.observer(v, "fete:aveu-garin", "garin", "place", aveu
      ? "Aliénor a dit à Garin qu’elle avait donné son nom au percepteur. Il a reconnu qu’elle osait lui en parler en face."
      : "Garin a demandé à Aliénor si elle avait donné son nom. Elle l’a nié.");
    if (aveu) M.lier(v, "garin", "alienor", 0, 1);
  });
  return _reponseGarin(aveu);
};
const _maelleFete = A2.maelle;
A2.maelle = function () {
  const v = V(), pesee = v.recit.pesee;
  if (S.stage !== 11 || !pesee) return _maelleFete.call(this);
  const publique = pesee === "public";
  if (!M.observer(v, "fete:maelle", "maelle", "place", publique
    ? "À la fête, Maëlle a demandé qu’Aliénor laisse l’affaire de la miche loin de la foule."
    : "À la fête, Maëlle a remercié Aliénor d’avoir abordé l’affaire de la miche à l’écart.")) return _maelleFete.call(this);
  save();
  return talk([[MA, publique ? "« Ici aussi, il y a du monde. Pour la miche, on parlera à l’écart, si tu veux bien. »"
    : "« Merci de m’avoir parlé à part, ce matin. Au milieu de tout ce bruit, je me rappelle qu’au moins une personne a écouté. »"]],
    () => _maelleFete.call(this));
};
const _choixBastien = choixBastien;
choixBastien = function (etape, options) {
  const faits = {
    b4: ["Aliénor a dansé avec le jeune garde pendant la fête.", "Aliénor a refusé la danse pour continuer son travail.", "Aliénor lui a dit qu’elle ne dansait pas avec la garde."],
    b6: ["Le jeune garde a confié qu’il avait appris à lire sur les édits.", "Aliénor a remercié le jeune garde. Il lui a dit de se méfier au lendemain de la fête.", "Le jeune garde a laissé l’affiche en place.", "Le jeune garde lisait toujours l’affiche quand Aliénor est repartie."]
  }[etape];
  if (!faits) return _choixBastien(etape, options);
  return _choixBastien(etape, options.map(([libelle, action], i) => [libelle, () => {
    M.observer(V(), "fete:" + etape, "bastien", "place", faits[i], bstate().nom ? "Bastien" : "Le jeune garde");
    action();
  }]));
};

/* Au tribut : le rappel des deux balances, pour qui a vu peser la miche. */
const perI = inter("Parler au percepteur"), _per = perI.act;
perI.act = function () {
  if (S.act === 1 && S.stage === 1 && M.sait(V(), "alienor", "miche_legere") && !V().recit.balances) {
    V().recit.balances = true;
    return talk([["", "Sur la table du percepteur, la balance du palais, ses poids de cuivre bien astiqués."], ["", "Ce matin, au fournil, une autre balance disait que la miche de Maëlle était légère. Deux balances. Et c’est toujours la même main qui perd."]], () => _per.call(this));
  }
  return _per.call(this);
};

/* ================= Le soir au clos, la fête, la nuit ================= */
const anI = inter("Parler à Anselme"), _an = anI.act;
anI.act = function () {
  if (S.act === 1 && S.stage > 5 && V().recit.etape === "ville") return talk([[AN, vary("an6v", ["« Repose-toi. Ce soir, garde les yeux ouverts. »", "« Une fête, c’est un tribut qu’on paie en riant. Tu verras. »"])],
    choix([["Rentrer au clos avant la fête", rentrerSoir], ["Attendre le soir ici (acte II)", () => startAct2()], ["Rester encore sur la place", () => talk([[AN, "« Prends ton temps. Le soir viendra bien assez tôt. »"]])]])]);
  return _an.call(this);
};
function rentrerSoir() {
  fermerDlg(); const v = V(); M.avancerJusqua(v, C.tDe(M.jour(v), 2));
  versClos("soir", CL(3.0, 0.6), () => { const r = v.recit, p = [["", "Le soir tombe sur le clos. Les volets des voisins se ferment un à un."]];
    if (r.peseeHorsChamp) p.push(["", "Au puits, une voisine raconte qu’on a pesé la miche de Maëlle cet après-midi, devant tout le fournil. Perrine, paraît-il. On ne parle que de ça."]);
    talk(p); });
}
const _startAct2 = startAct2;
startAct2 = function () { fermerDlg(); const v = V(); M.avancerJusqua(v, C.tDe(M.jour(v), 2)); v.recit.etape = "fete"; save(); return _startAct2(); };
function repas() {
  const v = V(), dispo = ["miche", "viande", "gibier", "legumes", "sauge_recoltee"].filter(k => v.inventaire[k]);
  const cle = "repas:clos:" + M.jour(v);
  if (M.applique(v, cle) || (v.recit.repas && v.recit.etape === "soir")) return talk([["", "Le repas est fini. Le feu baisse."]]);
  const manger = () => {
    let texte = "Ce n’est pas grand-chose. C’est chaud.";
    M.appliquer(v, cle, () => {
      if (v.recit.etape === "soir") v.recit.repas = true;
      if (!dispo.length) v.barres.satiete = Math.min(100, v.barres.satiete + 10);
      else {
        const gain = M.manger(v, dispo);
        texte = gain >= 40 ? "Un vrai repas, au coin du feu. Aliénor mange lentement, pour une fois." : "Un repas simple, au coin du feu.";
      }
    });
    save(); talk([["", texte]], apres);
  };
  const menu = dispo.length ? "Sur la table : " + dispo.map(k => M.ARTICLES[k].nom).join(", ") + "." : "Rien à cuire. Un fond de soupe aux oignons, et de l’eau du puits.";
  talk([["", menu], choix([[dispo.length ? "Tout préparer" : "Se contenter de la soupe", manger], ["Plus tard", rien]])]);
}
function lit() {
  const v = V(), r = v.recit;
  if (r.etape === "soir") return talk([["", "S’allonger un moment avant la fête ?"], choix([["Se reposer un peu", () => { r.sieste = true; v.barres.endurance = Math.min(100, v.barres.endurance + 15); talk([["", "Une demi-heure, les yeux ouverts au plafond. Des voix passent sous la fenêtre, vers la place."]], apres); }], ["Non, pas maintenant", rien]])]);
  talk([["", "Le jour se lève derrière la muraille. Il est trop tôt pour dormir et trop tard pour veiller."], choix([["Dormir", dormir], ["Pas encore", rien]])]);
}
function dormir() {
  fermerDlg(); const v = V();
  M.avancerJusqua(v, C.tDe(M.jour(v), 2));
  M.dormir(v, true);
  v.recit.etape = "lendemain"; save();
  mode = "turn"; refreshHud();
  wash(() => { setScene(true); majClos(); player.position.set(CL(-2.2, -0.6).x, 0, CL(-2.2, -0.6).z); snapCam(); mode = "play"; refreshHud(); revealDir = 1;
    talk([["", "Aliénor dort jusqu’à la cloche de tierce. La nuit a été courte : la presse a tourné jusqu’à l’aube."], ["", M.almanach(v).date + "."], ["", "On frappe à la porte."]], apres); });
}
const _showEnd2 = showEnd2;
showEnd2 = function () {
  _showEnd2();
  const row = ov.querySelector(".box .row");
  if (row && !enClos()) row.insertAdjacentHTML("afterbegin", `<button class="pri" data-v="rentrer-nuit">Rentrer dormir au clos</button>`);
};
ACTIONS["rentrer-nuit"] = () => { closePanel(); versClos("nuit", CL(2.8, 0.6), () => talk([["", "Le clos dort encore. Vos mains sentent l’encre et la colle."]])); };

/* ================= Le lendemain : la visite ================= */
function visite() {
  const v = V();
  if (v.recit.entretien?.lieu === "clos") return recevoir(v.recit.entretien, true);
  const vi = M.visiteEnCours(v); if (!vi) return;
  sfx("frapper"); setTimeout(() => sfx("porte"), 900);
  const qui = M.HABITANTS[vi.hab].nom;
  talk([["", `Sur le seuil : ${qui}.`], choix([
    ["Ouvrir et la faire entrer", () => recevoir(vi)],
    ["Prendre rendez-vous pour cet après-midi", () => {
      const e = M.reporter(v, vi.id);
      if (!e) return;
      save();
      const lieu = e.lieu === "maison_ysabeau" ? "chez moi" : "au fournil";
      talk([[qui, `« Cet après-midi, alors. Retrouve-moi ${lieu}. Tu as promis. »`]], apres);
    }],
    ["Ne pas répondre", () => { M.avancer(v, 1); setScene(true); save(); talk([["", "Les pas s’éloignent. Plus tard, vous trouvez un mot glissé sous la porte."]], apres); }]
  ])]);
}
function rencontreDisponible(hab, lieu) {
  const v = V(), e = M.rendezVous(v, hab, lieu);
  if (v.recit.entretien?.hab === hab && v.recit.entretien.lieu === lieu) return true;
  return !!e && e.t === v.t && M.lieuDe(v, hab) === lieu;
}
function rencontre(hab, lieu) {
  const v = V(), entretien = v.recit.entretien;
  if (entretien?.hab === hab && entretien.lieu === lieu) return recevoir(entretien, true);
  const e = M.honorerRendezVous(v, hab, lieu);
  if (e) recevoir({ hab, motif: e.motif, id: e.id, lieu }, true);
}
function recevoir(vi, rendezVous = false) {
  const v = V();
  if (!rendezVous && !M.recevoir(v, vi.id)) return;
  v.recit.entretien = { hab: vi.hab, motif: vi.motif, id: vi.id, lieu: vi.lieu || "clos" };
  save();
  const L = {
    reproche: [[MA, "« Hier, devant tout le fournil, tu as fait peser ma miche. Perrine n’achète plus chez moi. Elle va chez le boulanger des Drapiers. »"],
      [MA, "« Tu veux savoir pourquoi elle est légère ? La farine me vient du palais, pesée sur leur balance. Leur boisseau est court. »"],
      choix([["« Je ne savais pas. Je le dirai, à ceux qui étaient là. »", () => { M.savoir(v, "alienor", "miche_legere", 2, "maelle", false); M.lier(v, "maelle", "alienor", 1, 1); M.conviction(v, 3, "Elle a eu raison de peser la miche et tort de le faire ainsi. Elle peut réparer la seconde moitié."); M.engager(v, { id: "rectifier:place", de: "alienor", a: "maelle", quoi: "rectifier", t: v.t + 3 }); talk([[MA, "« Dis-le. Mais dis-le bien. »"]], fin); }],
        ["« La balance ne ment pas. »", () => { M.savoir(v, "alienor", "miche_legere", 2, "maelle", false); M.lier(v, "maelle", "alienor", -1, 0); M.conviction(v, -2, "La balance ne ment pas. Mais elle n’a pas dit qui pesait la farine."); talk([[MA, "« Non. C’est la leur qui ment. »"]], fin); }]])],
    bon_de_farine: [[MA, "« Je t’ai apporté ça. C’est le bon de la dernière livraison. Tu sais lire. Dis-moi si j’ai raison. »"],
      ["", "Douze boisseaux payés. Onze et demi reçus. Sous les chiffres, le sceau du palais."],
      choix([["« Tu as raison. Garde-le précieusement. »", () => { v.inventaire.bon_de_farine = 1; M.savoir(v, "alienor", "miche_legere", 2, "bon", true); M.lier(v, "maelle", "alienor", 1, 1); M.conviction(v, 3, "Un papier dit ce que la balance cache. C’est son métier de faire parler le papier."); talk([[MA, "« Garde-le, toi. Chez moi, on fouille. »"]], fin); }],
        ["« Il vaudrait mieux le brûler. »", () => { M.lier(v, "maelle", "alienor", -0.5, 0); M.conviction(v, -3, "Elle a conseillé le feu. Elle sait mieux que personne ce qu’on brûle à Sarlande."); talk([[MA, "« On brûle déjà bien assez de papier dans cette ville. »"]], fin); }]])],
    lire: [[MA, "« Hier, Perrine a fait peser ma miche devant tout le fournil. Elle avait reçu une lettre. »"],
      [MA, "« On m’en a glissé une aussi, cette nuit. Je ne sais pas la lire. Personne ne le sait, à part toi. Tu me la lis ? »"],
      ["", "Même papier, même écriture que la vôtre. « Ils pèsent votre farine à la balance du palais. Demandez-leur la leur. »"],
      choix([["« J’ai reçu la même, hier matin. »", () => { M.lier(v, "maelle", "alienor", 1, 2); M.savoir(v, "maelle", "lettre_miche", 1, "alienor", false); M.conviction(v, 2, "Elle a dit la vérité sur la lettre. Maëlle sait maintenant qu’elles sont deux."); talk([[MA, "« Et tu n’as rien fait ? … Non. Tu as bien fait. Perrine a fait pour deux. »"]], fin); }],
        ["Lire sans parler de la vôtre", () => { M.conviction(v, -1, "Elle a gardé la lettre pour elle. Maëlle ne lui a rien demandé de plus."); talk([[MA, "« Demandez-leur la leur… Comme si on pouvait. »"]], fin); }]])],
    conseil: [[YS, "« On dit que des lettres courent sous les portes. Ne t’en mêle pas, ma fille. »"], [YS, "« Ta mère aussi recevait des lettres. »"]]
  }[vi.motif];
  const motif = {
    reproche: "Maëlle a expliqué pourquoi la pesée lui a fait perdre une cliente.",
    bon_de_farine: "Maëlle a apporté le bon de livraison de farine.",
    lire: "Maëlle a demandé à Aliénor de lui lire sa lettre.",
    conseil: "Ysabeau s’est souvenue des lettres que recevait la mère d’Aliénor."
  }[vi.motif];
  function conclure() {
    if (motif) M.observer(v, vi.id, vi.hab, vi.lieu || "clos", motif);
    delete v.recit.entretien;
  }
  for (const ligne of L || []) if (ligne.choices) {
    ligne.choices = ligne.choices.map(([texte, choisir]) => [texte, () => {
      M.appliquer(v, vi.id + ":choix", () => { conclure(); choisir(); });
      save();
    }]);
  }
  talk(L || [], fin);
  function fin() {
    conclure();
    const nouvelles = [];
    if (M.motifEcart(v, "ysabeau")) nouvelles.push("En passant, Ysabeau dit qu’elle va acheter son pain chez Maëlle, ce matin, « pour qu’on la voie le faire ».");
    if (M.motifEcart(v, "garin")) nouvelles.push("On raconte au puits que Garin a été convoqué au palais pour la double mesure. La tannerie est fermée.");
    if (v.fournisseurs.perrine && vi.motif !== "reproche") nouvelles.push("Perrine, dit-on, achète désormais son pain rue des Drapiers.");
    talk(nouvelles.map(t => ["", t]), apres);
  }
}

/* Reprise au milieu d'une journée au clos : le décor est rebâti avant de rendre la main. */
// start() ramène sur la place toute position hors des limites de la carte : on rend au clos la sienne.
// Ce dont la ville à l’échelle (jeu/ville.js) a besoin pour se raccorder au clos et à l’atelier.
window.Vie = { V, CL, enClos, sortir, versClos, vitrine, batirClos, majClos, apres, maelle: fournil, halles, rencontreDisponible, rencontre };
if (S.started && S.pos && S.pos[1] > 1300) { player.position.set(S.pos[0], 0, S.pos[1]); batirClos(); }
refreshHud();
})();
