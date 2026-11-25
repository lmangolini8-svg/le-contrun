/* Sarlande à l'échelle de l'atlas : le trajet du clos à l'imprimerie, aux halles et au quai, à pied, sur le relief réel.

   Une zone marchable de plus, construite à côté des scènes existantes : la place des actes I et II garde
   pour l'instant son décor resserré. Le terrain, les bâtiments et les rues viennent de jeu/atlas.js et
   passent tous par Atlas.versScene ; la zone est seulement décalée de VILLE.x sur l'axe est, loin de la carte.

   Raccords : au bas du clos, « Traverser la ville à pied » ; à la porte de la maison d'Aliénor, retour
   au clos ; à la porte de l'imprimerie, l'atelier (même suite que l'ancienne rue du clos).
   Chargé après jeu/vie.js, dont il reprend quelques fonctions par window.Vie. */
"use strict";
(function () {
const T0 = performance.now();
const A = Atlas, Vie = window.Vie, M = Monde;
const VILLE = { x: 3000, z: 0 };
const X0 = 100, X1 = 540, Y0 = 374, Y1 = 496; // emprise construite : des Drapiers au clos, de la place au quai
const PENTE_MAX = 0.22; // hors des rues, on ne grimpe pas plus raide (les rues, elles, sont nivelées)
const enVille = () => player.position.x > 2500;
const VS = (X, Y, alt) => { const s = A.versScene(X, Y, alt === undefined ? sol(X, Y) : alt); return { x: s.x + VILLE.x, y: s.y, z: s.z + VILLE.z }; };
const DS = (x, z) => A.depuisScene(x - VILLE.x, z - VILLE.z);
const solV = (x, z) => { const p = DS(x, z); return sol(p.X, p.Y) - A.ORIGINE.alt; };

/* ================= Grille de marche, 0,5 m =================
   Le relief brut garde ses ressauts (murs de terrasse, talus) : on ne marche pas dessus tel quel.
   Le sol de marche suit le profil des voies (chemins de l'atlas, cotes de voirie proposées) sur les rues,
   le profil lissé de l'axe pour les ruelles, et le relief lissé sur 4,5 m ailleurs. Le maillage suit ce même sol. */
const R = 0.5, GW = Math.round((X1 - X0) / R), GH = Math.round((Y1 - Y0) / R);
const RUE = 1, MUR = 2, grille = new Uint8Array(GW * GH), haut = new Float32Array(GW * GH), dRue = new Float32Array(GW * GH).fill(Infinity);
const cel = (X, Y) => { const c = Math.floor((X - X0) / R), r = Math.floor((Y - Y0) / R); return c < 0 || r < 0 || c >= GW || r >= GH ? -1 : r * GW + c; };
const centre = i => [X0 + (i % GW + 0.5) * R, Y0 + (Math.floor(i / GW) + 0.5) * R];
function proj(px, py, ax, ay, bx, by) { const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy || 1; const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / L)); return { t, d: Math.hypot(px - ax - t * dx, py - ay - t * dy) }; }
const distSeg = (px, py, ax, ay, bx, by) => proj(px, py, ax, ay, bx, by).d;
function cellules(x0, x1, y0, y1, f) {
  for (let Y = Math.max(Y0, Math.floor(y0 / R) * R); Y < Math.min(Y1, y1); Y += R) for (let X = Math.max(X0, Math.floor(x0 / R) * R); X < Math.min(X1, x1); X += R) {
    const cx = X + R / 2, cy = Y + R / 2, i = cel(cx, cy); if (i >= 0) f(i, cx, cy);
  }
}
// relief lissé : moyenne glissante séparable sur 9 cellules
{ const k = 4, tmp = new Float32Array(GW * GH);
  for (let i = 0; i < haut.length; i++) haut[i] = A.altitude(...centre(i));
  for (let r = 0; r < GH; r++) for (let c = 0; c < GW; c++) { let s = 0, n = 0; for (let d = -k; d <= k; d++) { const cc = c + d; if (cc >= 0 && cc < GW) { s += haut[r * GW + cc]; n++; } } tmp[r * GW + c] = s / n; }
  for (let r = 0; r < GH; r++) for (let c = 0; c < GW; c++) { let s = 0, n = 0; for (let d = -k; d <= k; d++) { const rr = r + d; if (rr >= 0 && rr < GH) { s += tmp[rr * GW + c]; n++; } } haut[r * GW + c] = s / n; } }
const lisse = haut.slice();
// voies : [X, Y, cote] ; les ruelles reçoivent le relief de leur axe, lissé sur ± 6 m
function profilRuelle(pts) {
  const S = [0]; for (let i = 1; i < pts.length; i++) S.push(S[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const at = s => { let i = 1; while (i < pts.length - 1 && S[i] < s) i++; const t = Math.max(0, Math.min(1, (s - S[i - 1]) / ((S[i] - S[i - 1]) || 1))); return [pts[i - 1][0] + t * (pts[i][0] - pts[i - 1][0]), pts[i - 1][1] + t * (pts[i][1] - pts[i - 1][1])]; };
  return pts.map((_, i) => { let h = 0, n = 0; for (let s = Math.max(0, S[i] - 6); s <= Math.min(S[S.length - 1], S[i] + 6); s += 0.5) { h += A.altitude(...at(s)); n++; } return [pts[i][0], pts[i][1], h / n]; });
}
const VOIES = [...Object.values(A.CHEMINS), ...Object.values(A.RUELLES).map(profilRuelle)];
const RUES = VOIES.map(v => v.map(p => [p[0], p[1]]));
const LARGE = 3.2, COEUR = 2.4, PRES = 8, NCH = Object.keys(A.CHEMINS).length, fixe = new Uint8Array(GW * GH), chemin = new Int8Array(GW * GH).fill(-1), croise = new Uint8Array(GW * GH);
for (const [n, pts] of VOIES.entries()) for (let j = 1; j < pts.length; j++) {
  const [ax, ay, az] = pts[j - 1], [bx, by, bz] = pts[j];
  const P = n < NCH ? PRES : LARGE; // près d'un autre chemin nivelé, les deux profils ne s'accordent pas toujours
  cellules(Math.min(ax, bx) - P, Math.max(ax, bx) + P, Math.min(ay, by) - P, Math.max(ay, by) + P, (i, x, y) => {
    const { t, d } = proj(x, y, ax, ay, bx, by);
    if (n < NCH && d <= PRES) { if (chemin[i] >= 0 && chemin[i] !== n) croise[i] = 1; chemin[i] = n; }
    if (d > LARGE || d >= dRue[i]) return;
    dRue[i] = d; grille[i] = RUE; const z = az + t * (bz - az), w = d <= COEUR ? 0 : (d - COEUR) / (LARGE - COEUR);
    haut[i] = z * (1 - w) + lisse[i] * w;
    fixe[i] = n < NCH && d <= 1.2 ? 1 : 0;
  });
}
const BATI = new Set(["roof", "church", "cloister", "stone", "water"]);
const OUVERT = new Set(["yard", "hall", "garden", "gate"]);
const rect = s => { const xs = s.polygone.map(p => p[0]), ys = s.polygone.map(p => p[1]); return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) }; };
const SITES = Object.values(A.SITES).filter(s => { const b = rect(s); return b.x1 > X0 && b.x0 < X1 && b.y1 > Y0 && b.y0 < Y1; });
for (const s of SITES) if (OUVERT.has(s.surface)) { const b = rect(s); cellules(b.x0, b.x1, b.y0, b.y1, i => { if (grille[i] !== MUR) grille[i] = RUE; }); }
// Là où deux voies se croisent à des cotes différentes, le sol sauterait d'un profil à l'autre :
// on le détend sur les rues, axes des chemins nivelés tenus fixes, pour en faire des rampes.
{ const libres = [];
  for (let r = 1; r < GH - 1; r++) for (let c = 1; c < GW - 1; c++) { const i = r * GW + c; if (grille[i] === RUE && !(fixe[i] && !croise[i])) libres.push(i); }
  const L = Int32Array.from(libres);
  for (let it = 0; it < 240; it++) for (let k = 0; k < L.length; k++) { const i = L[k]; haut[i] = (haut[i - 1] + haut[i + 1] + haut[i - GW] + haut[i + GW]) / 4; } }
const MARGE = 0.45; // le rayon d'Aliénor : les murs se tiennent à distance
for (const s of SITES) if (BATI.has(s.surface) && s.id !== "pont") { const b = rect(s); cellules(b.x0 - MARGE, b.x1 + MARGE, b.y0 - MARGE, b.y1 + MARGE, i => { grille[i] = MUR; }); }

/* Sol de marche, interpolé entre les centres des cellules. Hors de l'emprise : le relief de l'atlas. */
function sol(X, Y) {
  const c = (X - X0) / R - 0.5, r = (Y - Y0) / R - 0.5;
  if (c < 0 || r < 0 || c > GW - 1 || r > GH - 1) return A.altitude(X, Y);
  const c0 = Math.min(GW - 2, Math.floor(c)), r0 = Math.min(GH - 2, Math.floor(r)), fc = c - c0, fr = r - r0, i = r0 * GW + c0;
  return haut[i] * (1 - fc) * (1 - fr) + haut[i + 1] * fc * (1 - fr) + haut[i + GW] * (1 - fc) * fr + haut[i + GW + 1] * fc * fr;
}
const PAS_MAX = 0.6; // un pas ne monte pas plus de 60 % : marches de ruelle, pas de talus
function praticable(X, Y) {
  const i = cel(X, Y); if (i < 0 || grille[i] === MUR) return false;
  const q = A.secteur(X, Y); if (!q || q.n === 15) return false;
  if (grille[i] === RUE) return true;
  const h = sol(X, Y), g = Math.hypot(sol(X + R, Y) - h, sol(X, Y + R) - h) / R;
  return g <= PENTE_MAX;
}
const _blocked = blocked;
blocked = function (x, z) {
  if (x < 2500) return _blocked(x, z);
  const p = DS(x, z); if (!praticable(p.X, p.Y)) return true;
  const P = player.position, d = Math.hypot(x - P.x, z - P.z);
  if (d > 0.02 && d < 0.6 && P.x > 2500) { const q = DS(P.x, P.z); if (Math.abs(sol(p.X, p.Y) - sol(q.X, q.Y)) > PAS_MAX * Math.max(d, 0.25)) return true; }
  return false;
};

/* Le réseau relié : ce qu'on atteint à pied depuis la place. Une porte s'ouvre toujours de ce côté. */
const relie = new Uint8Array(GW * GH);
{ const pile = [cel(340, 415)]; relie[pile[0]] = 1;
  while (pile.length) { const i = pile.pop(), [X, Y] = centre(i);
    for (const [dx, dy] of [[R, 0], [-R, 0], [0, R], [0, -R]]) { const j = cel(X + dx, Y + dy); if (j < 0 || relie[j]) continue; const [nX, nY] = centre(j);
      if (!praticable(nX, nY) || Math.abs(sol(nX, nY) - sol(X, Y)) > PAS_MAX * R) continue; relie[j] = 1; pile.push(j); } } }
const estRelie = (X, Y) => { const i = cel(X, Y); return i >= 0 && relie[i] === 1; };

/* ================= Portes : sur le côté du bâtiment qui regarde la rue ================= */
function porte(s) {
  const b = rect(s); let best = null;
  const bords = [[b.x0, b.y0, b.x1, b.y0, 0, -1], [b.x1, b.y0, b.x1, b.y1, 1, 0], [b.x0, b.y1, b.x1, b.y1, 0, 1], [b.x0, b.y0, b.x0, b.y1, -1, 0]];
  for (const [ax, ay, bx, by, nx, ny] of bords) {
    const L = Math.hypot(bx - ax, by - ay);
    for (let t = 1.2; t <= L - 1.2; t += 0.5) {
      const X = ax + (bx - ax) * t / L, Y = ay + (by - ay) * t / L, oX = X + nx * 1.3, oY = Y + ny * 1.3;
      if (!estRelie(oX, oY)) continue;
      let d = Infinity; for (const pts of RUES) for (let i = 1; i < pts.length; i++) d = Math.min(d, distSeg(oX, oY, ...pts[i - 1], ...pts[i]));
      if (!best || d < best.d) best = { X, Y, nx, ny, d, dehors: { X: oX, Y: oY } };
    }
  }
  return best;
}
const ENSEIGNES = { tail: "Tailleur", coif: "Coiffeuse", fard: "Marchande de fards et parures", men: "Menuisier", tap: "Tapissière", pep: "Pépiniériste",
  rel: "Relieuse-papetière", hor: "Horloger et fabricant d’automates", bro: "Brocanteur", tein: "Teinturier", pot: "Potière et verrier", fer: "Ferronnier" };
const ENSEIGNE_LAB = { tail: "Le tailleur", coif: "La coiffeuse", fard: "La marchande de fards", men: "Le menuisier", tap: "La tapissière", pep: "Le pépiniériste",
  rel: "La relieuse-papetière", hor: "L’horloger", bro: "Le brocanteur", tein: "Le teinturier", pot: "La potière et le verrier", fer: "Le ferronnier" };
const COULEURS = [0xe8dcc0, 0xeed2b4, 0xe2d6bc, 0xecd9a6, BLANC, 0xd8c9a4];
const PORTES = {};
for (const s of SITES) if (s.surface === "roof" || s.surface === "church") { const p = porte(s); if (p) PORTES[s.id] = p; }

/* ================= Construction, à la première visite ================= */
let bati = false;
function batirVille() {
  if (bati) return; bati = true;
  // le relief, maille de 1 m, teinté par matière : pavés des rues, limon du quai, jardins du clos
  const nx = X1 - X0 + 1, ny = Y1 - Y0 + 1, pos = new Float32Array(nx * ny * 3), col = new Float32Array(nx * ny * 3), idx = [];
  const c = new THREE.Color(), TEINTES = { 5: 0x8f9466, 6: 0x939766, 7: 0x8a8f66, 8: 0x7f8c5c, 9: 0x857866, 15: 0x5f7a86 };
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const X = X0 + i, Y = Y0 + j, s = VS(X, Y, sol(X, Y)), k = j * nx + i, q = A.secteur(X, Y), g = grille[cel(X, Y)];
    pos.set([s.x, s.y, s.z], k * 3);
    c.set(g === RUE ? (q && q.n === 9 ? 0x8a7a64 : 0xa89878) : (TEINTES[q && q.n] || 0x7f8c5c)); // pavés et limon ; herbe et terre battue
    const v = 0.94 + 0.06 * Math.sin(X * 12.9898 + Y * 78.233);
    col.set([c.r * v, c.g * v, c.b * v], k * 3);
    if (i < nx - 1 && j < ny - 1) idx.push(k, k + nx, k + 1, k + 1, k + nx, k + nx + 1);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3)); geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  geo.setIndex(idx); geo.computeVertexNormals();
  const relief = new THREE.Mesh(geo, VC); relief.receiveShadow = true; relief.name = "Sarlande à l’échelle : relief"; scene.add(relief);
  // la rivière, au pied du quai
  const eau = new THREE.Mesh(new THREE.PlaneGeometry(X1 - X0, 40), LM(0x7f9fb0)); eau.rotation.x = -Math.PI / 2;
  const e0 = VS((X0 + X1) / 2, 490, 2.9); eau.position.set(e0.x, e0.y, e0.z); scene.add(eau);

  dio(0, () => {
    for (const s of SITES) {
      const b = rect(s), w = b.x1 - b.x0, d = b.y1 - b.y0, m = VS((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, s.cote);
      const coins = [[b.x0, b.y0], [b.x1, b.y0], [b.x0, b.y1], [b.x1, b.y1]].map(([X, Y]) => VS(X, Y).y);
      const bas = Math.min(m.y, ...coins) - 0.3, haut = Math.max(m.y, ...coins);
      const k = Math.abs(Math.round(b.x0 * 7 + b.y0 * 13));
      if (s.surface === "roof" || s.surface === "church") {
        const h = s.surface === "church" ? 11 : 5.2 + (k % 3) * 0.9, top = haut + h, span = Math.min(w, d);
        put(G.box, s.surface === "church" ? ST2 : COULEURS[k % COULEURS.length], m.x, (bas + top) / 2, m.z, w, top - bas, d);
        put(G.prism, s.surface === "church" ? SLATE : [TILE, SLATE, LAUZE][k % 3], m.x, top, m.z, w + 0.8, span * 0.5, d + 0.8, w > d ? Math.PI / 2 : 0);
        put(G.box, SEPIA, m.x, haut + 2.9, m.z, w + 0.06, 0.12, d + 0.06); // colombage
        solid(m.x - w / 2, m.x + w / 2, m.z - d / 2, m.z + d / 2).low = false;
        const p = PORTES[s.id];
        if (p) {
          const q = VS(p.X, p.Y), ry = p.nx ? Math.PI / 2 : 0, y0 = VS(p.dehors.X, p.dehors.Y).y;
          put(G.box, 0x3a2c22, q.x + p.nx * 0.06, y0 + 1.1, q.z + p.ny * 0.06, 1.3, 2.2, 0.12, ry);
          if (ENSEIGNES[s.id] || s.id === "presse" || s.id === "maelle") put(G.box, s.id === "presse" ? INDIGO : SIENNE, q.x + p.nx * 0.9, y0 + 2.9, q.z + p.ny * 0.9, 1.1, 0.7, 0.06, ry);
          for (const dx of [-2.2, 2.2]) put(G.box, 0x2b2f45, q.x + p.nx * 0.07 + (p.ny ? dx : 0), y0 + 1.6, q.z + p.ny * 0.07 + (p.nx ? dx : 0), 0.9, 1.0, 0.08, ry);
        }
      } else if (s.surface === "hall") { // les halles : piliers et grand toit, ouvertes à la marche
        for (let X = b.x0 + 0.5; X <= b.x1; X += 4.5) for (const Y of [b.y0 + 0.5, b.y1 - 0.5]) { const p = VS(X, Y); put(G.box, WOOD, p.x, p.y + 2.3, p.z, 0.35, 4.6, 0.35); }
        put(G.prism, TILE, m.x, m.y + 4.6, m.z, w + 1.5, 3.4, d + 1.5, Math.PI / 2);
      } else if (s.id === "fontaine" || s.id.startsWith("puits")) {
        put(G.c16, ST, m.x, m.y + 0.45, m.z, Math.min(w, d) * 0.9, 0.9, Math.min(w, d) * 0.9); put(G.c16, 0x6f8fa6, m.x, m.y + 0.86, m.z, Math.min(w, d) * 0.75, 0.05, Math.min(w, d) * 0.75);
        if (s.id === "fontaine") put(G.c8, ST2, m.x, m.y + 1.6, m.z, 0.3, 2.2, 0.3);
      } else if (s.id === "lavoir") {
        put(G.box, ST, m.x, m.y + 0.3, m.z, w, 0.6, d); put(G.box, 0x6f8fa6, m.x, m.y + 0.55, m.z, w - 0.6, 0.05, d - 0.6);
        put(G.prism, TILE, m.x, m.y + 2.6, m.z, w + 1, 1.4, d + 1, Math.PI / 2);
      } else if (s.id === "pont") { // tablier au-dessus du lit, trois arches
        put(G.box, ST2, m.x, VS(112, 488, 6.2).y, m.z, w, 0.8, d);
        for (const Y of [478, 488, 498]) { const p = VS((b.x0 + b.x1) / 2, Y, 2); put(G.box, ST, p.x, p.y + 1.8, p.z, w, 3.6, 2.2); }
      } else if (s.id === "grue") {
        put(G.box, WOOD, m.x, m.y + 3.5, m.z, 0.5, 7, 0.5); put(G.box, WOOD, m.x + 2.5, m.y + 6.8, m.z, 5.5, 0.35, 0.35);
        put(G.c16, WOOD, m.x - 1.4, m.y + 1.8, m.z, 3.4, 0.6, 3.4, 0, 0, Math.PI / 2); solid(m.x - 0.4, m.x + 0.4, m.z - 0.4, m.z + 0.4);
      } else if (s.id === "estrade") {
        put(G.box, WOOD, m.x, m.y + 0.5, m.z, w, 1, d);
      }
    }
  });
  flushWin();
}

/* ================= Raccords ================= */
const dehors = id => { const p = PORTES[id], q = VS(p.dehors.X, p.dehors.Y); return { x: q.x, z: q.z }; };
function entrerVille() {
  mode = "turn"; refreshHud(); sfx("porte");
  wash(() => { batirVille(); const q = dehors("maison"); player.position.set(q.x, solV(q.x, q.z), q.z); player.rotation.y = -Math.PI / 2; setScene(true); enterPlay(); refreshHud(); save();
    say("Sarlande à l’échelle de l’atlas : le clos, les Drapiers, l’imprimerie, les halles et le quai.", 4); });
}
function quitterVille(fn) { player.position.y = 0; fn(); }
INTER.push(
  { p: () => Vie.CL(-34, 0), r: 2.4, label: "Traverser la ville à pied", can: () => Vie.enClos(), act() { entrerVille(); } },
  { p: () => dehors("maison"), r: 2, label: "Rentrer au clos", can: () => enVille(), act() { quitterVille(() => Vie.versClos(Vie.V().recit.etape, Vie.CL(-5.4, 0.6))); } },
  { p: () => dehors("presse"), r: 2.2, get label() { const e = Vie.V().recit.etape; return e === "soir" ? "Rejoindre la fête" : "Entrer à l’atelier"; }, can: () => enVille(), act() {
      const e = Vie.V().recit.etape;
      if (e === "reveil" || e === "soir" || e === "lendemain") return Vie.sortir();
      mode = "turn"; refreshHud(); sfx("porte");
      wash(() => quitterVille(() => { player.position.set(-19, 0, 7); player.rotation.y = -Math.PI / 2; setScene(true); enterPlay(); refreshHud(); save(); }));
    } },
  ...Object.entries(ENSEIGNES).filter(([id]) => PORTES[id]).map(([id, nom]) => ({ p: () => dehors(id), r: 1.8, label: ENSEIGNE_LAB[id], can: () => enVille(), act() { Vie.vitrine(nom); } })),
  { p: () => dehors("maelle"), r: 1.8, label: "Le fournil de Maëlle", can: () => enVille(), act() { talk([["", "Le fournil de Maëlle, entre l’imprimerie et la fontaine. L’odeur du pain chaud déborde sur la rue."]], Vie.apres); } },
  { p: () => dehors("caisse"), r: 2, label: "La Caisse des métiers", can: () => enVille(), act() { talk([["", "La Caisse des métiers, au nord-est de la place. Un registre, des devis épinglés."]], Vie.apres); } },
  { p: () => { const q = VS(362, 443); return { x: q.x, z: q.z }; }, r: 2.4, label: "Les halles", can: () => enVille(), act() { talk([["", "Les halles, au sud-est de la fontaine. Les jours de marché, les étals tournants s’y installent : boucher, paniers de Jeanne, banc du chasseur."]], Vie.apres); } },
  { p: () => { const q = VS(349, 469); return { x: q.x, z: q.z }; }, r: 2.6, label: "Le quai", can: () => enVille(), act() { talk([["", "Le quai, quatre mètres au-dessus du zéro de la ville. La rue courte descend de la place à 11 % ; les charrettes prennent le détour de l’est, 202 m sans dépasser 3 %."]], Vie.apres); } }
);

/* Le sol suit le relief ; la caméra suit Aliénor en hauteur. */
const _charTick = charTick;
charTick = function (dt) { if (enVille()) player.position.y = solV(player.position.x, player.position.z); _charTick(dt); };
const _freeView = freeView;
freeView = function () { const v = _freeView(); if (enVille()) { v[1] += player.position.y; v[4] += player.position.y; } return v; };
const _zoneOf = zoneOf; zoneOf = function () { return enVille() ? "ville" : _zoneOf(); };
const _targetNow = targetNow, _targetName = targetName, _objText = objText;
const versAtelier = () => ["reveil", "soir"].includes(Vie.V().recit.etape);
targetNow = function () { return enVille() ? dehors(versAtelier() ? "presse" : "maison") : _targetNow(); };
targetName = function () { return enVille() ? (versAtelier() ? "l’atelier" : "votre maison") : _targetName(); };
objText = function () {
  if (!enVille()) return _objText();
  return versAtelier() ? "Du clos à l’imprimerie, à pied : la rue des Drapiers monte vers l’ouest. La place et ses halles sont au centre, le quai en contrebas, au sud." : "Sarlande à pied. La maison est au clos, à l’est, au-dessus de la rivière.";
};
const _startPlay = startPlay;
startPlay = function (newGame) {
  if (!newGame && enVille()) { closePanel(); S.started = true; save(); fpsT = 0; fpsN = 0; batirVille(); setScene(true); setCones(true); return enterPlay(); }
  return _startPlay(newGame);
};

console.info("Ville à l’échelle : grille prête en", Math.round(performance.now() - T0), "ms");
window.Ville = { VILLE, enVille, praticable, estRelie, sol, solScene: solV, PAS_MAX, batirVille, PORTES, versScene: VS, depuisScene: DS };
// start() ramène sur la place toute position hors de la carte : on rend à la ville la sienne.
if (S.started && S.pos && S.pos[0] > 2500 && !blocked(S.pos[0], S.pos[1])) { batirVille(); player.position.set(S.pos[0], solV(S.pos[0], S.pos[1]), S.pos[1]); }
})();
