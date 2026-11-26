/* Sarlande à l'échelle de l'atlas : le trajet du clos à l'imprimerie, aux halles et au quai, à pied, sur le relief réel.

   Une zone marchable de plus, construite à côté des scènes existantes : la place des actes I et II garde
   pour l'instant son décor resserré. Le terrain, les bâtiments et les rues viennent de jeu/atlas.js et
   passent tous par Atlas.versScene ; la zone est seulement décalée de VILLE.x sur l'axe est, loin de la carte.

   Raccords : depuis le seuil de la maison, trajet à pied dans l’atlas ; retour au même seuil.
   L’imprimerie accueille les scènes d’atelier existantes et permet de ressortir du côté des Drapiers.
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
const LARGE = 3.2, COEUR = 2.4, PRES = 8, NCH = Object.keys(A.CHEMINS).length, fixe = new Uint8Array(GW * GH), cheminDe = new Int8Array(GW * GH).fill(-1), croise = new Uint8Array(GW * GH);
for (const [n, pts] of VOIES.entries()) for (let j = 1; j < pts.length; j++) {
  const [ax, ay, az] = pts[j - 1], [bx, by, bz] = pts[j];
  const P = n < NCH ? PRES : LARGE; // près d'un autre chemin nivelé, les deux profils ne s'accordent pas toujours
  cellules(Math.min(ax, bx) - P, Math.max(ax, bx) + P, Math.min(ay, by) - P, Math.max(ay, by) + P, (i, x, y) => {
    const { t, d } = proj(x, y, ax, ay, bx, by);
    if (n < NCH && d <= PRES) { if (cheminDe[i] >= 0 && cheminDe[i] !== n) croise[i] = 1; cheminDe[i] = n; }
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

/* ================= Le tissu urbain =================
   L'atlas ne donne que les lieux du récit. Entre eux, une ville médiévale est faite de maisons mitoyennes
   qui bordent chaque rue, l'arrière donnant sur des cours. On les aligne ici le long des chemins et des ruelles,
   dans l'enceinte, sans jamais empiéter sur une rue, un lieu de l'atlas ou ses abords (ses portes restent dégagées). */
const dansPoly = (X, Y, P) => { let o = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, yi] = P[i], [xj, yj] = P[j]; if ((yi > Y) !== (yj > Y) && X < (xj - xi) * (Y - yi) / (yj - yi) + xi) o = !o; } return o; };
const INTRA = new Uint8Array(GW * GH);
for (let i = 0; i < INTRA.length; i++) { const [X, Y] = centre(i); INTRA[i] = dansPoly(X, Y, A.ENCEINTE) ? 1 : 0; }
const hasard = (a, b) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); };
const SANS_MAISON = new Set([3, 11, 12, 13, 14, 15]); // palais et jardins, hors les murs, rivière
const RIVE = 6.2; // dans le secteur du quai, rien ne se bâtit au ras de l'eau
const occupe = new Uint8Array(GW * GH);
for (const s of SITES) { const b = rect(s), m = s.surface === "garden" || s.surface === "yard" || s.surface === "hall" ? 1.2 : 2.2; cellules(b.x0 - m, b.x1 + m, b.y0 - m, b.y1 + m, i => { occupe[i] = 1; }); }
const TISSU = [];
{ const RECUL = LARGE + 0.55, MARGE_OBB = MARGE;
  const obb = (C, t, n, w, d, pad, f) => { const hw = w / 2 + pad, hd = d / 2 + pad, ex = Math.abs(t[0]) * hw + Math.abs(n[0]) * hd, ey = Math.abs(t[1]) * hw + Math.abs(n[1]) * hd;
    cellules(C[0] - ex, C[0] + ex, C[1] - ey, C[1] + ey, (i, x, y) => { const dx = x - C[0], dy = y - C[1]; if (Math.abs(dx * t[0] + dy * t[1]) <= hw && Math.abs(dx * n[0] + dy * n[1]) <= hd) f(i); }); };
  const libre = (C, t, n, w, d) => { let ok = true; obb(C, t, n, w, d, 0.2, i => { if (!ok) return; const [X, Y] = centre(i), q = A.secteur(X, Y);
    if (grille[i] !== 0 || occupe[i] || !INTRA[i] || !q || SANS_MAISON.has(q.n) || (q.n === 9 && A.altitude(X, Y) < RIVE)) ok = false; });
    if (!ok) return false; for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { const X = C[0] + t[0] * a * w / 2 + n[0] * b * d / 2, Y = C[1] + t[1] * a * w / 2 + n[1] * b * d / 2; if (cel(X, Y) < 0) return false; } return true; };
  for (const [v, pts] of RUES.entries()) {
    // la rue est parcourue d'un bout à l'autre, quelle que soit la densité de ses points
    const S = [0]; for (let i = 1; i < pts.length; i++) S.push(S[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const Ltot = S[S.length - 1]; if (Ltot < 6) continue;
    const au = s => { let i = 1; while (i < pts.length - 1 && S[i] < s) i++; const L = (S[i] - S[i - 1]) || 1, f = Math.max(0, Math.min(1, (s - S[i - 1]) / L));
      return { P: [pts[i - 1][0] + f * (pts[i][0] - pts[i - 1][0]), pts[i - 1][1] + f * (pts[i][1] - pts[i - 1][1])], i }; };
    const dir = (a, b) => { const p = au(a).P, q = au(b).P, L = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1; return [(q[0] - p[0]) / L, (q[1] - p[1]) / L]; };
    const j = v;
    for (const side of [-1, 1]) {
      let u = 1.5;
      while (u < Ltot - 1.5 && TISSU.length < 420) {
        const k = hasard(v * 31 + side * 7, u), w = Math.min(Ltot - u - 0.5, 5 + 3.5 * k);
        if (w < 4) break;
        const m = u + w / 2, t = dir(Math.max(0, m - w / 2), Math.min(Ltot, m + w / 2)), n = [-t[1] * side, t[0] * side], M = au(m).P;
        const F = [M[0] + n[0] * RECUL, M[1] + n[1] * RECUL];
        // la maison prend la profondeur que lui laisse l'îlot, entre 5 et 11 m
        let d = 11 - 3 * hasard(u, v + side), C = null;
        for (; d >= 5; d -= 1) { const c = [F[0] + n[0] * d / 2, F[1] + n[1] * d / 2]; if (libre(c, t, n, w, d)) { C = c; break; } }
        if (C) {
          obb(C, t, n, w, d, 0, i => { occupe[i] = 1; });
          obb(C, t, n, w, d, MARGE_OBB, i => { if (grille[i] !== RUE) grille[i] = MUR; });
          TISSU.push({ C, F, t, n, w, d, k, rue: v < NCH });
          u += w;
        } else u += 1;
      }
    }
  }
}

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

// La caméra ne traverse pas les maisons de la ville : la ligne de vue ne doit croiser aucun mur de la grille.
const _camClear = camClear;
camClear = function (ax, az, bx, bz) {
  if (!_camClear(ax, az, bx, bz)) return false;
  if (ax < 2500 && bx < 2500) return true;
  const L = Math.hypot(bx - ax, bz - az), n = Math.ceil(L / 0.35);
  for (let k = 0; k < n; k++) { const p = DS(ax + (bx - ax) * k / n, az + (bz - az) * k / n), i = cel(p.X, p.Y); if (i >= 0 && grille[i] === MUR) return false; }
  return true;
};

/* Le réseau relié : ce qu'on atteint à pied depuis la place. Une porte s'ouvre toujours de ce côté. */
const relie = new Uint8Array(GW * GH);
{ const pile = [cel(340, 415)]; relie[pile[0]] = 1;
  while (pile.length) { const i = pile.pop(), [X, Y] = centre(i);
    for (const [dx, dy] of [[R, 0], [-R, 0], [0, R], [0, -R]]) { const j = cel(X + dx, Y + dy); if (j < 0 || relie[j]) continue; const [nX, nY] = centre(j);
      if (!praticable(nX, nY) || Math.abs(sol(nX, nY) - sol(X, Y)) > PAS_MAX * R) continue; relie[j] = 1; pile.push(j); } } }
const estRelie = (X, Y) => { const i = cel(X, Y); return i >= 0 && relie[i] === 1; };

/* Chemin à pied entre deux points de l'atlas (A* sur la grille, huit voisins, mêmes pas qu'Aliénor),
   puis raccourci en lignes droites quand la vue est libre. Rend une suite de points [X, Y], ou null. */
const VOISINS = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, 1.414], [1, -1, 1.414], [-1, 1, 1.414], [-1, -1, 1.414]];
function passe(i, j) { const [X, Y] = centre(i), [x, y] = centre(j); return relie[j] === 1 && Math.abs(sol(x, y) - sol(X, Y)) <= PAS_MAX * Math.hypot(x - X, y - Y); }
function accroche(X, Y, rayon = 8) {
  const i0 = cel(X, Y); if (i0 >= 0 && relie[i0]) return i0;
  let best = -1, bd = Infinity;
  cellules(X - rayon, X + rayon, Y - rayon, Y + rayon, (i, x, y) => { if (!relie[i]) return; const d = Math.hypot(x - X, y - Y); if (d < bd) { bd = d; best = i; } });
  return best;
}
const gCout = new Float32Array(GW * GH), vient = new Int32Array(GW * GH), marque = new Uint32Array(GW * GH); let tour = 0;
function chemin(a, b) {
  const s = accroche(a.X, a.Y), t = accroche(b.X, b.Y); if (s < 0 || t < 0) return null;
  tour++; const [tx, ty] = centre(t), h = i => { const [x, y] = centre(i); return Math.hypot(x - tx, y - ty) / R; };
  const tas = [[h(s), s]]; gCout[s] = 0; vient[s] = -1; marque[s] = tour;
  const pousser = e => { tas.push(e); let k = tas.length - 1; while (k) { const p = (k - 1) >> 1; if (tas[p][0] <= tas[k][0]) break; [tas[p], tas[k]] = [tas[k], tas[p]]; k = p; } };
  const tirer = () => { const top = tas[0], last = tas.pop(); if (tas.length) { tas[0] = last; let k = 0; for (;;) { const l = 2 * k + 1, r = l + 1; let m = k; if (l < tas.length && tas[l][0] < tas[m][0]) m = l; if (r < tas.length && tas[r][0] < tas[m][0]) m = r; if (m === k) break; [tas[m], tas[k]] = [tas[k], tas[m]]; k = m; } } return top; };
  let n = 0;
  while (tas.length && n++ < 200000) {
    const [f, i] = tirer(); if (i === t) break; if (f - h(i) > gCout[i] + 1e-6) continue;
    const c = i % GW, r = (i - c) / GW;
    for (const [dc, dr, w] of VOISINS) { const cc = c + dc, rr = r + dr; if (cc < 0 || rr < 0 || cc >= GW || rr >= GH) continue; const j = rr * GW + cc;
      const g = gCout[i] + w; if (marque[j] === tour && g >= gCout[j]) continue; if (!passe(i, j)) continue;
      marque[j] = tour; gCout[j] = g; vient[j] = i; pousser([g + h(j), j]); }
  }
  if (marque[t] !== tour) return null;
  const pts = []; for (let i = t; i >= 0; i = vient[i]) pts.push(centre(i)); pts.reverse();
  const libre = (p, q) => { const L = Math.hypot(q[0] - p[0], q[1] - p[1]), n = Math.ceil(L / 0.25); let prev = p;
    for (let k = 1; k <= n; k++) { const x = p[0] + (q[0] - p[0]) * k / n, y = p[1] + (q[1] - p[1]) * k / n, i = cel(x, y); if (i < 0 || !relie[i] || Math.abs(sol(x, y) - sol(...prev)) > PAS_MAX * (L / n) + 0.02) return false; prev = [x, y]; } return true; };
  const out = [pts[0]]; let k = 0;
  while (k < pts.length - 1) { let m = Math.min(pts.length - 1, k + 60); while (m > k + 1 && !libre(pts[k], pts[m])) m--; out.push(pts[m]); k = m; }
  return out;
}

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
const paves = new THREE.MeshLambertMaterial({ vertexColors: true });
paves.onBeforeCompile = sh => {
  sh.vertexShader = sh.vertexShader.replace("#include <common>", `#include <common>
    attribute float pave;
    varying vec2 vSolAtlas;
    varying float vPave;
  `).replace("#include <begin_vertex>", `#include <begin_vertex>
    vSolAtlas = position.xz;
    vPave = pave;
  `);
  sh.fragmentShader = sh.fragmentShader.replace("#include <common>", `#include <common>
    varying vec2 vSolAtlas;
    varying float vPave;
  `).replace("#include <color_fragment>", `#include <color_fragment>
    vec2 joints = vSolAtlas / vec2(0.48, 0.29);
    joints.x += 0.5 * mod(floor(joints.y), 2.0);
    vec2 ip = floor(joints), fp = fract(joints);
    vec2 bords = min(fp, 1.0 - fp);
    float ombre = 1.0 - smoothstep(0.028, 0.105, min(bords.x, bords.y));
    float nuance = fract(sin(dot(ip, vec2(41.73, 93.67))) * 2763.39);
    float grain = fract(sin(dot(floor(vSolAtlas * 3.1), vec2(12.99, 78.23))) * 43758.5);
    float route = mix(1.0, (0.88 + 0.2 * nuance) * (1.0 - 0.27 * ombre), smoothstep(0.7, 0.94, vPave));
    route *= mix(1.0, 0.9 + 0.16 * grain, smoothstep(0.3, 0.6, vPave) * (1.0 - smoothstep(0.7, 0.94, vPave)));
    diffuseColor.rgb *= route;
  `);
};
let bati = false;

function remplacerFacade(fichier, support, centre, largeur, hauteur, profondeur, angle) {
  const cle = "ville/" + fichier;
  if (!_glbCache[cle]) {
    _glbCache[cle] = gltfLoader().then(loader => new Promise((ok, ko) =>
      loader.load("modeles/" + cle + ".glb", gltf => ok(decorMaterials(gltf.scene)), undefined, ko)));
  }
  _glbCache[cle].then(modele => {
    const copie = modele.clone();
    copie.rotation.y = angle;
    const volume = new THREE.Box3().setFromObject(copie);
    const taille = volume.getSize(new THREE.Vector3());
    if (taille.x <= 0 || taille.y <= 0 || taille.z <= 0) return;
    const axe = volume.getCenter(new THREE.Vector3()), groupe = new THREE.Group();
    groupe.scale.set(largeur / taille.x, hauteur / taille.y, profondeur / taille.z);
    groupe.position.set(centre.x - axe.x * groupe.scale.x, centre.y - volume.min.y * groupe.scale.y, centre.z - axe.z * groupe.scale.z);
    groupe.name = fichier + " (atlas)";
    groupe.add(copie);
    scene.add(groupe);
    support.visible = false;
  }).catch(e => console.warn("Façade atlas indisponible : " + fichier, e));
}

const JARDIN = new Uint8Array(GW * GH);
for (const s of SITES) if (s.surface === "garden") { const b = rect(s); cellules(b.x0, b.x1, b.y0, b.y1, i => { JARDIN[i] = 1; }); }
const TEINTES = { 5: 0x8f9466, 6: 0x939766, 7: 0x8a8f66, 8: 0x7f8c5c, 9: 0x857866, 15: 0x5f7a86 };
const FACADES_ATLAS = { presse: "imprimerie", maelle: "maison_pierre", tail: "maison1", coif: "maison2", fard: "maison_pierre" };
function construireRelief(x0, y0, x1, y1) {
  const nx = x1 - x0 + 1, ny = y1 - y0 + 1;
  const pos = new Float32Array(nx * ny * 3), col = new Float32Array(nx * ny * 3), norm = new Float32Array(nx * ny * 3);
  const pave = new Float32Array(nx * ny), idx = [];
  const c = new THREE.Color(), normal = new THREE.Vector3();
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const X = x0 + i, Y = y0 + j, s = VS(X, Y, sol(X, Y)), k = j * nx + i, q = A.secteur(X, Y), g = grille[cel(X, Y)];
    pos.set([s.x, s.y, s.z], k * 3);
    normal.set(sol(X - 0.5, Y) - sol(X + 0.5, Y), 1, sol(X, Y - 0.5) - sol(X, Y + 0.5)).normalize();
    normal.toArray(norm, k * 3);
    const ci = cel(X, Y), intra = ci >= 0 && INTRA[ci], jardin = ci >= 0 && JARDIN[ci];
    c.set(g === RUE ? (q && q.n === 9 ? 0x8a7a64 : 0xa89878) : intra && !jardin ? 0x9b8b70 : (TEINTES[q && q.n] || 0x7f8c5c));
    if (g === RUE && ci >= 0 && dRue[ci] < 0.45 && cheminDe[ci] >= 0) c.multiplyScalar(0.78); // la rigole, au milieu du chemin
    pave[k] = g === RUE && q?.n !== 9 ? 1 : intra && !jardin ? 0.62 : 0;
    const v = 0.94 + 0.06 * Math.sin(X * 12.9898 + Y * 78.233);
    col.set([c.r * v, c.g * v, c.b * v], k * 3);
    if (i < nx - 1 && j < ny - 1) idx.push(k, k + nx, k + 1, k + 1, k + nx, k + nx + 1);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  geo.setAttribute("pave", new THREE.BufferAttribute(pave, 1));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  const relief = new THREE.Mesh(geo, paves);
  relief.receiveShadow = true;
  return relief;
}

function batirVille() {
  if (bati) return;
  bati = true;
  // Lots visibles indépendamment, sans dessiner toute la bande de 440 m à chaque image.
  const terrain = new THREE.Group();
  terrain.name = "Sarlande à l’échelle : relief";
  const tailleLot = 48;
  for (let Y = Y0; Y < Y1; Y += tailleLot) {
    for (let X = X0; X < X1; X += tailleLot) {
      terrain.add(construireRelief(X, Y, Math.min(X1, X + tailleLot), Math.min(Y1, Y + tailleLot)));
    }
  }
  scene.add(terrain);
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
        const p = PORTES[s.id];
        // en attendant leurs propres façades, les boutiques du récit empruntent une maison Meshy (version légère)
        const fichier = VILLE_MESHY && p && (FACADES_ATLAS[s.id] || (s.surface === "roof" ? ["maison1_loin", "maison2_loin", "maison_pierre_loin"][k % 3] : null));
        const repli = fichier ? new Builder() : null;
        const facade = repli ? repli.put.bind(repli) : put;
        facade(G.box, s.surface === "church" ? ST2 : COULEURS[k % COULEURS.length], m.x, (bas + top) / 2, m.z, w, top - bas, d);
        facade(G.prism, s.surface === "church" ? SLATE : [TILE, SLATE, LAUZE][k % 3], m.x, top, m.z, w + 0.8, span * 0.5, d + 0.8, w > d ? Math.PI / 2 : 0);
        facade(G.box, SEPIA, m.x, haut + 2.9, m.z, w + 0.06, 0.12, d + 0.06);
        solid(m.x - w / 2, m.x + w / 2, m.z - d / 2, m.z + d / 2).low = false;
        if (repli) {
          const support = repli.mesh(cityPaint);
          scene.add(support);
          const seuil = VS(p.dehors.X, p.dehors.Y).y;
          if (seuil > bas) put(G.box, ST, m.x, (bas + seuil) / 2, m.z, w, seuil - bas, d);
          remplacerFacade(fichier, support, { x: m.x, y: seuil - 0.01, z: m.z }, w, h + 2.8, d, Math.atan2(p.nx, p.ny));
        }
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
        const repli = s.id === "fontaine" && VILLE_MESHY ? new Builder() : null;
        const bassin = repli ? repli.put.bind(repli) : put;
        bassin(G.c16, ST, m.x, m.y + 0.45, m.z, Math.min(w, d) * 0.9, 0.9, Math.min(w, d) * 0.9);
        bassin(G.c16, 0x6f8fa6, m.x, m.y + 0.86, m.z, Math.min(w, d) * 0.75, 0.05, Math.min(w, d) * 0.75);
        if (s.id === "fontaine") bassin(G.c8, ST2, m.x, m.y + 1.6, m.z, 0.3, 2.2, 0.3);
        if (repli) {
          const support = repli.mesh(cityPaint);
          scene.add(support);
          remplacerFacade("fontaine", support, m, w, 4.65, d, 0);
        }
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
  batirTissu();
  flushWin();
}

/* Les maisons du tissu : pierre au rez-de-chaussée, étages en colombages ou enduit, encorbellement,
   toit de tuiles, de lauzes ou d'ardoise, gouttereau ou pignon sur rue. Toutes fusionnées en un seul maillage. */
const MURS_HAUT = [0xeee2c8, 0xe8d6b0, 0xf0dcc0, 0xe4d2a8, 0xd9c9a6, 0xece4d4];
const VOLETS = [0x6f8a78, 0x2f6b78, 0xa9583a, 0x4a5578, 0x7a5a3a, 0x9cae8c];
const AUVENTS = [0xa9583a, 0x2f6b78, 0xd6a94e, 0x6f8a78];
function maisonTissu(h) {
  const { C, F, t, n, w, d, k } = h, r = (a) => hasard(k * 97 + a, C[0] + C[1]);
  const c = VS(C[0], C[1]), f = VS(F[0], F[1]);
  const coins = [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b2]) => VS(C[0] + t[0] * a * w / 2 + n[0] * b2 * d / 2, C[1] + t[1] * a * w / 2 + n[1] * b2 * d / 2).y);
  const bas = Math.min(f.y, ...coins) - 0.4, rue = f.y; // la façade se règle sur la rue
  const ry = Math.atan2(-n[0], -n[1]), z = d / 2; // l'avant local regarde la rue
  B.push(c.x, c.z, ry);
  const pierre = r(1) < 0.3, etages = r(2) < 0.35 ? 1 : 2, he = 2.7, rdc = 3.0;
  const enc = pierre ? 0 : 0.35, haut = rue + rdc + etages * he;
  const mur = MURS_HAUT[Math.floor(r(3) * MURS_HAUT.length)], volet = VOLETS[Math.floor(r(4) * VOLETS.length)];
  // rez-de-chaussée de pierre, enfoncé dans la pente
  if (r(5) < 0.5) { // enduit sur un socle de pierre
    put(G.box, ST2, 0, (bas + rue + 0.7) / 2, 0, w + 0.06, rue + 0.7 - bas, d + 0.06, 0, 0, 0, 4);
    put(G.box, MURS_HAUT[Math.floor(r(15) * MURS_HAUT.length)], 0, rue + 0.7 + (rdc - 0.7) / 2, 0, w, rdc - 0.7, d, 0, 0, 0, 7);
  } else { // pierre de taille, cordon sous l'étage
    put(G.box, r(16) < 0.5 ? ST : ST2, 0, (bas + rue + rdc) / 2, 0, w, rue + rdc - bas, d, 0, 0, 0, 4);
    put(G.box, ST2, 0, rue + rdc - 0.08, z + 0.05, w + 0.1, 0.16, 0.14, 0, 0, 0, 4);
  }
  // étages : pierre ou pans de bois en encorbellement
  put(G.box, pierre ? ST : mur, 0, rue + rdc + etages * he / 2, enc / 2, w + (pierre ? 0 : 0.2), etages * he, d + enc, 0, 0, 0, pierre ? 4 : 7);
  if (!pierre) {
    const zf = z + enc + 0.02, nb = Math.max(2, Math.round(w / 1.6));
    for (let e = 0; e <= etages; e++) put(G.box, TB, 0, rue + rdc + e * he, zf, w + 0.25, 0.18, 0.12, 0, 0, 0, 6);
    for (let i = 0; i <= nb; i++) { const x = -w / 2 + i * w / nb; put(G.box, TB, x, rue + rdc + etages * he / 2, zf, 0.14, etages * he, 0.1, 0, 0, 0, 6); }
    if (r(6) < 0.6) for (let e = 0; e < etages; e++) for (let i = 0; i < nb; i += 2) { const x = -w / 2 + (i + 0.5) * w / nb, sg = (i / 2 + e) % 2 ? 1 : -1;
      put(G.box, TB, x, rue + rdc + e * he + he / 2, zf, 0.1, he * 1.05, 0.08, 0, 0, sg * Math.atan2(w / nb, he)); }
  }
  // fenêtres et volets
  const nf = Math.max(1, Math.round(w / 2.6));
  for (let e = 0; e < etages; e++) for (let i = 0; i < nf; i++) {
    const x = -w / 2 + (i + 0.5) * w / nf, y = rue + rdc + e * he + 1.35, zf = z + enc + 0.06;
    put(G.box, WIN, x, y, zf, 0.75, 1.1, 0.05);
    if (r(10 + i + e) < 0.7) for (const sx of [-1, 1]) put(G.box, volet, x + sx * 0.6, y, zf + 0.02, 0.42, 1.1, 0.05);
    if (r(20 + i + e) < 0.18) put(G.box, [0xc94a3a, 0xd9b84a, 0x8a6aa0][i % 3], x, y - 0.72, zf + 0.18, 0.85, 0.22, 0.3); // jardinière
  }
  // rez-de-chaussée : porte et seuil, parfois une échoppe sous auvent
  const dx = (r(7) - 0.5) * (w - 2.2);
  put(G.box, 0x4b3829, dx, rue + 1.05, z + 0.03, 1.05, 2.1, 0.08, 0, 0, 0, 6);
  put(G.box, ST2, dx, rue + 2.2, z + 0.06, 1.35, 0.22, 0.14, 0, 0, 0, 4);
  put(G.box, ST2, dx, rue + 0.06, z + 0.35, 1.4, 0.16, 0.6, 0, 0, 0, 4);
  if (h.rue && r(8) < 0.45 && w > 6) {
    const sx = dx > 0 ? -w / 4 : w / 4;
    put(G.box, 0x2a2c33, sx, rue + 1.4, z + 0.03, 2.0, 1.6, 0.06);
    put(G.box, WOOD, sx, rue + 0.85, z + 0.3, 2.2, 0.1, 0.55, 0, 0, 0, 6);
    put(G.box, AUVENTS[Math.floor(r(9) * AUVENTS.length)], sx, rue + 2.55, z + 0.55, 2.5, 0.05, 1.1, 0, 0.35, 0);
  } else put(G.box, WIN, dx > 0 ? -w / 4 : w / 4, rue + 1.5, z + 0.04, 0.7, 0.9, 0.05);
  // toit
  const toit = r(11), rf = toit < 0.45 ? TILE : toit < 0.8 ? LAUZE : SLATE;
  if (w < 6.5 && r(12) < 0.6) { // pignon sur rue
    const rh = w * 0.75; put(G.prism, rf, 0, haut, enc / 2, w + 0.5, rh, d + enc + 0.6, 0, 0, 0, 5);
    put(G.prism, pierre ? ST : mur, 0, haut, z + enc + 0.04, w, rh * 0.96, 0.06, 0, 0, 0, pierre ? 4 : 7);
    put(G.box, WIN, 0, haut + rh * 0.35, z + enc + 0.09, 0.55, 0.65, 0.05);
  } else { // gouttereau sur rue
    put(G.prism, rf, 0, haut, enc / 2, d + enc + 0.7, d * 0.42, w + 0.25, Math.PI / 2, 0, 0, 5);
    if (r(13) < 0.5) { put(G.box, pierre ? ST : mur, 0, haut + 0.55, z - 0.6, 0.9, 1.0, 0.9, 0, 0, 0, 7); put(G.prism, rf, 0, haut + 1.05, z - 0.6, 1.1, 0.5, 1.1, 0, 0, 0, 5); }
  }
  put(G.box, 0xa8937c, (r(14) - 0.5) * w * 0.6, haut + d * 0.32, -d * 0.15, 0.6, 1.6, 0.6, 0, 0, 0, 4); // cheminée
  B.pop();
  return haut;
}
/* ================= Les maisons Meshy du tissu, dessinées en série =================
   Chaque modèle Meshy est envoyé à la carte graphique une seule fois, pour toutes ses copies (InstancedMesh),
   en trois niveaux : le modèle complet de près, sa version légère à distance moyenne, la maison dessinée au loin.
   La maison dessinée d'une maison remplacée s'efface dans le shader (texture de visibilité, une case par maison). */
const MESHY_TISSU = [{ id: "maison1", pans: true }, { id: "maison2", pans: true }, { id: "maison_pierre", pans: false }];
const PRES_LOD = 30, MOYEN_LOD = 90; // mètres
const meshyTissu = { modeles: [], vis: null, pret: false };
function batirTissu() {
  // la maison dessinée : un seul maillage, chaque sommet sait à quelle maison il appartient
  const debut = [];
  dio(0, () => { for (const h of TISSU) { debut.push(B.p.length / 3); h.haut = maisonTissu(h); } debut.push(B.p.length / 3); });
  const dessin = scene.children[scene.children.length - 1];
  for (const id in PORTES) { const p = PORTES[id], q = VS(p.dehors.X, p.dehors.Y); put(G.box, ST2, q.x - p.nx * 0.6, q.y + 0.06, q.z - p.ny * 0.6, p.nx ? 0.7 : 1.6, 0.16, p.nx ? 1.6 : 0.7); }
  const gl = renderer.getContext();
  if (!VILLE_MESHY || !dessin || !dessin.geometry || gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) < 1) return;
  const N = TISSU.length, hid = new Float32Array(dessin.geometry.attributes.position.count);
  for (let i = 0; i < N; i++) hid.fill(i, debut[i], debut[i + 1]);
  dessin.geometry.setAttribute("hid", new THREE.BufferAttribute(hid, 1));
  const vis = new THREE.DataTexture(new Uint8Array(N * 4).fill(255), N, 1, THREE.RGBAFormat); vis.needsUpdate = true;
  const mat = dessin.material.clone(), base = dessin.material.onBeforeCompile;
  mat.onBeforeCompile = sh => { base.call(mat, sh); sh.uniforms.visTissu = { value: vis };
    sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nattribute float hid; uniform sampler2D visTissu;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nif (texture2D(visTissu, vec2((hid + 0.5) / " + N.toFixed(1) + ", 0.5)).r < 0.5) transformed = vec3(0.0, -9999.0, 0.0);"); };
  mat.customProgramCacheKey = () => "sarlande-tissu-" + N;
  dessin.material = mat; meshyTissu.vis = vis;
  // chaque maison reçoit un modèle : pierre pour les maisons de pierre, colombages sinon
  const charge = f => { const cle = "ville/" + f; if (!_glbCache[cle]) _glbCache[cle] = gltfLoader().then(L => new Promise((ok, ko) => L.load("modeles/" + cle + ".glb", g => ok(decorMaterials(g.scene)), undefined, ko))); return _glbCache[cle]; };
  const parModele = MESHY_TISSU.map(() => []);
  TISSU.forEach((h, i) => { const pierre = hasard(h.k * 97 + 1, h.C[0] + h.C[1]) < 0.3; const m = pierre ? 2 : (i % 2); parModele[m].push(i); });
  MESHY_TISSU.forEach((M, m) => Promise.all([charge(M.id), charge(M.id + "_loin")]).then(([pres, loin]) => {
    const niveaux = [pres, loin].map((racine, niv) => {
      let mesh = null; racine.updateMatrixWorld(true); racine.traverse(o => { if (o.isMesh && !mesh) mesh = o; });
      const im = new THREE.InstancedMesh(mesh.geometry, mesh.material, parModele[m].length);
      im.count = 0; im.castShadow = niv === 0; im.receiveShadow = true; // au-delà de 30 m, l'ombre ne se voit plus
      im.frustumCulled = false; im.name = M.id + " (tissu, en série)"; // les copies sont loin de l'origine du modèle
      scene.add(im); return { im, monde: mesh.matrixWorld.clone(), boite: new THREE.Box3().setFromObject(racine) };
    });
    const t = new THREE.Matrix4(), r = new THREE.Matrix4(), sc = new THREE.Matrix4();
    const places = parModele[m].map(i => {
      const h = TISSU[i], c = VS(h.C[0], h.C[1]), rueY = VS(h.F[0], h.F[1]).y, ang = Math.atan2(-h.n[0], -h.n[1]);
      // la façade du modèle regarde vers +z : on l'oriente vers la rue et on l'ajuste à la parcelle
      return niveaux.map(nv => { const b = nv.boite, tl = b.getSize(new THREE.Vector3()), ce = b.getCenter(new THREE.Vector3());
        t.makeTranslation(-ce.x, -b.min.y, -ce.z);
        sc.makeScale(h.w / tl.x, (h.haut - rueY + h.d * 0.42) / tl.y, h.d / tl.z);
        r.makeRotationY(ang);
        const M4 = new THREE.Matrix4().makeTranslation(c.x, rueY - 0.25, c.z).multiply(r).multiply(sc).multiply(t).multiply(nv.monde);
        return M4; });
    });
    meshyTissu.modeles.push({ niveaux, maisons: parModele[m], places });
    majTissu(true);
  }).catch(e => console.warn("Maison Meshy indisponible : " + M.id, e)));
}
let dernierTissu = 0;
function majTissu(force) {
  const now = performance.now(); if (!force && now - dernierTissu < 250) return; dernierTissu = now;
  const vis = meshyTissu.vis; if (!vis) return;
  const P = player.position, dans = enVille(), d = vis.image.data;
  for (const mo of meshyTissu.modeles) {
    let n0 = 0, n1 = 0;
    mo.maisons.forEach((i, k) => {
      const h = TISSU[i], c = VS(h.C[0], h.C[1], 0), dist = dans ? Math.hypot(c.x - P.x, c.z - P.z) : Infinity;
      const niveau = dist < PRES_LOD ? 0 : dist < MOYEN_LOD ? 1 : 2;
      if (niveau === 0) mo.niveaux[0].im.setMatrixAt(n0++, mo.places[k][0]);
      else if (niveau === 1) mo.niveaux[1].im.setMatrixAt(n1++, mo.places[k][1]);
      d[i * 4] = niveau === 2 ? 255 : 0;
    });
    mo.niveaux[0].im.count = n0; mo.niveaux[1].im.count = n1;
    mo.niveaux[0].im.instanceMatrix.needsUpdate = true; mo.niveaux[1].im.instanceMatrix.needsUpdate = true;
  }
  vis.needsUpdate = true;
}
setInterval(() => majTissu(false), 250);

/* ================= Raccords ================= */
const dehors = id => {
  const { X, Y } = PORTES[id].dehors;
  return VS(X, Y);
};
const seuilMaison = () => Vie.CL(-5.5, 0.6);
const seuilAtelier = () => ({ x: -18.5, z: 9.6 });
const inscrireAtelier = () => { Vie.V().seuilAtelier = "presse"; };

function passerDansVille(id) {
  mode = "turn"; refreshHud(); sfx("porte");
  wash(() => {
    batirVille();
    const q = dehors(id), p = PORTES[id];
    player.position.set(q.x, q.y, q.z);
    player.rotation.y = Math.atan2(p.nx, p.ny);
    setScene(true); enterPlay(); save();
  });
}
function entrerAtelier() {
  const e = Vie.V().recit.etape;
  if (e === "reveil" || e === "soir" || e === "lendemain") return Vie.sortir(inscrireAtelier);
  mode = "turn"; refreshHud(); sfx("porte");
  wash(() => {
    player.position.set(-19, 0, 7);
    player.rotation.y = -Math.PI / 2;
    inscrireAtelier();
    setScene(true); enterPlay(); save();
  });
}
INTER.push(
  { p: seuilMaison, r: 1.7, label: "Traverser la ville à pied", can: () => Vie.enClos(), act() { passerDansVille("maison"); } },
  { p: () => dehors("maison"), r: 2, label: "Rentrer au clos", can: () => enVille(), act() {
      player.position.y = 0;
      Vie.versClos(Vie.V().recit.etape, seuilMaison(), save);
    } },
  { p: () => dehors("presse"), r: 2.2, get label() { return Vie.V().recit.etape === "soir" ? "Rejoindre la fête" : "Entrer à l’atelier"; }, can: () => enVille(), act: entrerAtelier },
  { p: seuilAtelier, r: 1.5, label: "Sortir vers les Drapiers", can: () => !enVille() && !Vie.enClos() && S.act === 1 && Vie.V().seuilAtelier === "presse", act() { passerDansVille("presse"); } },
  ...Object.entries(ENSEIGNES).filter(([id]) => PORTES[id]).map(([id, nom]) => ({ p: () => dehors(id), r: 1.8, label: ENSEIGNE_LAB[id], can: () => enVille(), act() { Vie.vitrine(nom); } })),
  { p: () => dehors("maelle"), r: 1.8, label: "Le fournil de Maëlle", can: () => enVille(), act() {
      if (Vie.rencontreDisponible?.("maelle", "fournil")) return Vie.rencontre("maelle", "fournil");
      if (Vie.maelle) return Vie.maelle(!Vie.V().recit.tribut);
      talk([["", "Le fournil de Maëlle, entre l’imprimerie et la fontaine. L’odeur du pain chaud déborde sur la rue."]], Vie.apres);
    } },
  { p: () => dehors("caisse"), r: 2, label: "La Caisse des métiers", can: () => enVille(), act() { talk([["", "La Caisse des métiers, au nord-est de la place. Un registre, des devis épinglés."]], Vie.apres); } },
  { p: () => { const q = VS(362, 443); return { x: q.x, z: q.z }; }, r: 2.4, label: "Les halles", can: () => enVille(), act() {
      if (Vie.halles) return Vie.halles();
      talk([["", "Les halles, au sud-est de la fontaine. Les jours de marché, les étals tournants s’y installent : boucher, paniers de Jeanne, banc du chasseur."]], Vie.apres);
    } },
  { p: () => { const q = VS(349, 469); return { x: q.x, z: q.z }; }, r: 2.6, label: "Le quai", can: () => enVille(), act() { talk([["", "Le quai, quatre mètres au-dessus du zéro de la ville. La rue courte descend de la place à 11 % ; les charrettes prennent le détour de l’est, 202 m sans dépasser 3 %."]], Vie.apres); } }
);

/* Le sol suit le relief ; la caméra suit Aliénor en hauteur. */
const _charTick = charTick;
charTick = function (dt) { if (enVille()) player.position.y = solV(player.position.x, player.position.z); _charTick(dt); };
const _freeView = freeView, camVille = { a: null };
freeView = function () {
  const v = _freeView(); if (!enVille()) return v;
  v[1] += player.position.y; v[4] += player.position.y;
  // Dans les rues étroites, la caméra tourne autour d'Aliénor jusqu'à un angle dégagé, de préférence derrière elle ;
  // l'angle trouvé est gardé tant qu'il reste libre. En dernier recours, elle se rapproche et s'élève.
  const P = player.position, dx = v[0] - P.x, dz = v[2] - P.z, lx = v[3] - P.x, lz = v[5] - P.z;
  const tourne = (a, x, z) => [x * Math.cos(a) + z * Math.sin(a), -x * Math.sin(a) + z * Math.cos(a)];
  const libre = a => { const [x, z] = tourne(a, dx, dz); return camClear(P.x + x, P.z + z, P.x, P.z); };
  const derriere = Math.atan2(-Math.sin(player.rotation.y), -Math.cos(player.rotation.y)) - Math.atan2(dx, dz);
  let a = null;
  if (camVille.a !== null && libre(camVille.a)) a = camVille.a;
  else for (const c of [0, derriere, 0.5, -0.5, 1, -1, 1.6, -1.6, 2.2, -2.2, Math.PI]) if (libre(c)) { a = c; break; }
  camVille.a = a;
  if (a !== null) {
    if (a) { const [x, z] = tourne(a, dx, dz), [x2, z2] = tourne(a, lx, lz); v[0] = P.x + x; v[2] = P.z + z; v[3] = P.x + x2; v[5] = P.z + z2; }
    return v;
  }
  let k = 1;
  while (k > 0.2 && !camClear(P.x + dx * k, P.z + dz * k, P.x, P.z)) k -= 0.1;
  v[0] = P.x + dx * k; v[2] = P.z + dz * k; v[1] += (1 - k) * 3.2;
  const f = 0.25 + 0.75 * k;
  v[3] = P.x + lx * f; v[5] = P.z + lz * f; v[4] = P.y + 1.1 + (v[4] - P.y - 1.1) * f;
  return v;
};
const _zoneOf = zoneOf; zoneOf = function () { return enVille() ? "ville" : _zoneOf(); };
const _targetNow = targetNow, _targetName = targetName, _objText = objText;
const versAtelier = () => ["reveil", "soir"].includes(Vie.V().recit.etape);
targetNow = function () {
  if (enVille()) return dehors(versAtelier() ? "presse" : "maison");
  if (Vie.enClos() && versAtelier()) return seuilMaison();
  return _targetNow();
};
targetName = function () {
  if (enVille()) return versAtelier() ? "l’atelier" : "votre maison";
  if (Vie.enClos() && versAtelier()) return "la sortie du clos";
  return _targetName();
};
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
window.Ville = { TISSU: () => TISSU.length, tissuMeshy: () => meshyTissu.modeles.map(m => [m.niveaux[0].im.count, m.niveaux[1].im.count]), VILLE, enVille, praticable, estRelie, chemin, accroche: (X, Y) => { const i = accroche(X, Y); return i < 0 ? null : centre(i); }, dehorsAtlas: id => PORTES[id] && PORTES[id].dehors, sol, solScene: solV, PAS_MAX, batirVille, PORTES, versScene: VS, depuisScene: DS };
// start() ramène sur la place toute position hors de la carte : on rend à la ville la sienne.
if (S.started && Array.isArray(S.pos) && Number.isFinite(S.pos[0]) && Number.isFinite(S.pos[1]) && S.pos[0] > 2500) {
  batirVille();
  const [x, z] = S.pos;
  const p = DS(x, z);
  const i = accroche(p.X, p.Y);
  const q = estRelie(p.X, p.Y) ? { x, y: solV(x, z), z } :
    i >= 0 ? VS(...centre(i)) : dehors("maison");
  player.position.set(q.x, q.y, q.z);
}
})();
