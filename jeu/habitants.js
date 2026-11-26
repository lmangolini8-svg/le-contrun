/* Les habitants de Sarlande à l'échelle de l'atlas.

   Les habitants nommés sont là où leur agenda les place (jeu/monde.js : domicile, lieu par plage,
   jours de marché, jour du tribut, écarts motivés). Quand la plage change, ils rejoignent leur nouveau
   lieu à pied, par les rues ; sur place, ils vont et viennent entre deux ou trois points de leur poste.
   Des passants traversent la ville entre les portes, la fontaine, les halles et le quai ; ils sont moins
   nombreux le soir. On peut saluer chacun : ils rapportent ce qui se dit dans leur quartier.
   Chargé après jeu/ville.js. */
"use strict";
(function () {
const A = Atlas, W = Ville, M = Monde, Vie = window.Vie;
const V = () => Vie.V();

/* Où se tient-on, pour chaque lieu de monde.js : points de l'atlas [X, Y] (accrochés au réseau des rues). */
const POSTES = {
  imprimerie: [[249, 433], [245, 434]],
  fournil: [[300, 418], [305, 420], [297, 421]],
  rue_du_four: [[296, 403], [301, 404]],
  place: [[334, 421], [346, 418], [338, 437]],
  halles: [[355, 443], [362, 443], [369, 443]],
  drapiers: [[268, 402], [281, 399], [290, 404]],
  quai: [[330, 468], [345, 469], [372, 470]],
  tannerie: [[139, 418], [150, 420]],
  maison_ysabeau: [[497, 432], [503, 431]],
  palais: [[342, 388], [336, 389]]
};
const LOOKS = {
  anselme: { likeness: "anselme", top: 0x4a3a30, apron: 0xcdb98c, legs: NUIT, hat: "beret", hatc: SIENNE, flare: true },
  ysabeau: { likeness: "ysabeau", top: SAUGE, bottom: 0x7f9478, skirt: true, hat: "coif", shawl: FORET, cape: FORET },
  bertin: { likeness: "bertin", top: OCRE, legs: SEPIA, hat: "hood", hatc: FORET, pouch: SEPIA, cape: FORET },
  garin: { likeness: "garin", top: 0xd9c79c, apron: SIENNE, legs: SEPIA, hat: "cap", hatc: SEPIA, beard: 0x6a5040, pouch: 0x6e5338 },
  maelle: { likeness: "maelle", top: PETROLE, bottom: 0x286070, skirt: true, apron: BLANC, hat: "braid", hair: 0xd6a94e },
  percepteur: { likeness: "percepteur", top: NUIT, bottom: 0x161c34, skirt: true, hat: "toque", flare: true },
  perrine: { top: 0x6b4a5a, bottom: 0x4a3a4f, skirt: true, hat: "coif", shawl: 0xb88a3e, pouch: 0x5a2433 },
  jeanne: { top: 0x8a6a48, bottom: 0x6e5338, skirt: true, apron: OCRE, hat: "coif", burden: "panier" },
  boucher: { top: BLANC, apron: 0xd8c8b8, legs: SEPIA, hat: "cap", hatc: SIENNE, beard: 0x5a4130 },
  chasseur: { top: FORET, legs: SEPIA, hat: "hood", hatc: 0x4f6f4e, pouch: SEPIA }
};
/* Ce qu'ils disent quand on les salue, selon le lieu où on les trouve. */
const MOTS = {
  anselme: { imprimerie: "« Tu flânes ? La presse n’attend pas, mais elle ne s’enfuit pas non plus. »", _: "« Je prends l’air. L’encre finit par vous monter à la tête. »" },
  maelle: { fournil: "« La fournée de midi sort bientôt. Repasse, si tu veux du chaud. »", rue_du_four: "« Le four refroidit. Moi aussi. »", _: "« Je cours. Le pain ne se cuit pas tout seul. »" },
  ysabeau: { place: "« Je fais le marché. Ta mère prenait toujours le pain le plus cuit. »", maison_ysabeau: "« Entre deux portes, ma fille, on se parle mieux qu’à la fontaine. »", _: "« Ne traîne pas trop dehors. »" },
  garin: { tannerie: "« Ne reste pas là, l’odeur colle aux habits. »", quai: "« Le soir, au moins, le quai sent l’eau. »", place: "« Trente ans que je porte ce sac jusqu’à l’estrade. »", _: "« Salut, petite. »" },
  perrine: { drapiers: "« Les avis de la Saint-Michel ? Pose-les là, sur le comptoir. »", _: "« On se croise partout, ces jours-ci. »" },
  jeanne: { halles: "« Des choux, des raves, des poireaux. Trois pièces, comme toujours. »", place: "« On attend notre tour. Toujours le même tour. »", _: "« Bonjour. »" },
  boucher: { halles: "« La viande du jour. Le reste, demande au palais ce qu’il en a fait. »", _: "« Bonjour. »" },
  chasseur: { halles: "« Un lièvre, ce matin. Pas plus. Les bois sont gardés. »", _: "« Hm. »" },
  bertin: { place: "« Tu as vu mes cages ? Les oiseaux chantent mieux que les crieurs. »", rue_du_four: "« Je rentre. Les cages, ça pèse au bout d’un jour. »", _: "« Bonjour, Aliénor. »" },
  percepteur: { _: "Le percepteur vous regarde sans vous voir. « Circulez. »" }
};
const QUARTIER_DE_SECTEUR = { 5: "imprimerie", 6: "place", 7: "place", 8: "clos", 9: "quai" };

/* ================= Marcheurs ================= */
const marcheurs = [];
let pret = false, tVu = null, file = []; // file : marcheurs en attente d'un calcul de chemin, un par image
function poser(m, X, Y) { const q = W.versScene(X, Y); m.g.position.set(q.x, q.y, q.z); m.X = X; m.Y = Y; }
function allerA(m, X, Y) { m.but = { X, Y }; m.pts = null; if (!file.includes(m)) { if (m.hab) file.unshift(m); else file.push(m); } } // les habitants passent avant les passants
function creerMarcheur(o) {
  const g = human(Object.assign({ noOutline: true, x: 0, z: 0 }, o.look));
  if (o.i !== undefined) figureSize(g, o.i);
  g.visible = false;
  const m = Object.assign({ g, X: 0, Y: 0, pts: null, k: 0, attente: 0, vitesse: o.vitesse || 1.25 }, o);
  marcheurs.push(m); return m;
}
function suivant(m) {
  if (m.hab) { const P = POSTES[m.lieu]; if (!P) return; const [X, Y] = place(m, P); m.attente = 6 + Math.random() * 14; return allerA(m, X, Y); }
  const B = BUTS[Math.floor(Math.random() * BUTS.length)]; m.attente = 2 + Math.random() * 6; allerA(m, B[0], B[1]);
}
let BUTS = [];
function preparer() {
  pret = true;
  // l'imprimerie et le fournil : devant leur vraie porte
  for (const [lieu, id] of [["imprimerie", "presse"], ["fournil", "maelle"]]) { const d = W.dehorsAtlas(id); if (d) POSTES[lieu] = [[d.X, d.Y], [d.X + 1.5, d.Y], [d.X - 1.5, d.Y]]; }
  BUTS = Object.keys(W.PORTES).map(id => W.dehorsAtlas(id)).filter(Boolean).map(d => [d.X, d.Y])
    .concat([[340, 420], [362, 443], [349, 469], [300, 466], [278, 398], [395, 430], [470, 456]]);
  for (const hab of Object.keys(LOOKS)) creerMarcheur({ hab, look: LOOKS[hab], nom: M.HABITANTS[hab].nom, vitesse: hab === "percepteur" ? 0.9 : 1.15 });
  for (let i = 0; i < 16; i++) {
    const m = creerMarcheur({ i: 700 + i, look: crowdLook(700 + i), passant: true, vitesse: 1.0 + seeded(700 + i, 30) * 0.6 });
    const B = BUTS[(i * 7) % BUTS.length], d = W.accroche(B[0] + seeded(i, 31) * 6 - 3, B[1] + seeded(i, 32) * 6 - 3); if (d) poser(m, d[0], d[1]);
    m.rang = i;
  }
}
/* Qui est là : l'agenda pour les habitants, la plage pour le nombre de passants. */
// Chacun sa place : autour du point du poste, des places espacées de 1,3 m, sur un sol praticable et libre.
function place(m, P) {
  const autres = marcheurs.filter(o => o !== m && o.g.visible).map(o => o.but || (o.pts && o.pts[o.pts.length - 1] ? { X: o.pts[o.pts.length - 1][0], Y: o.pts[o.pts.length - 1][1] } : { X: o.X, Y: o.Y }));
  const libre = (X, Y) => W.praticable(X, Y) && W.estRelie(X, Y) && autres.every(o => Math.hypot(o.X - X, o.Y - Y) > 1.2);
  const k0 = marcheurs.indexOf(m);
  for (let r = 0; r < 4; r++) for (let a = 0; a < 8; a++) {
    const [X0, Y0] = P[0], ang = (a + k0) * Math.PI / 4, X = X0 + Math.cos(ang) * 1.3 * r, Y = Y0 + Math.sin(ang) * 1.3 * r; // autour du point principal du poste
    if (libre(X, Y)) return [X, Y];
  }
  return P[k0 % P.length];
}
function recenser(depart) {
  const v = V(), plage = M.plage(v), nuit = S.act === 2 || plage === 2;
  for (const m of marcheurs) {
    if (m.passant) { const vis = m.rang < (nuit ? 5 : plage === 1 ? 12 : 16); if (vis && !m.g.visible && !m.pts) suivant(m); m.g.visible = vis; continue; }
    const lieu = M.lieuDe(v, m.hab), P = POSTES[lieu], avant = m.g.visible;
    m.lieu = lieu;
    if (!P) { m.g.visible = false; m.pts = null; continue; }
    const pl = place(m, P);
    if (!avant || depart) { const d = W.accroche(...pl); if (d) poser(m, d[0], d[1]); m.g.visible = !!d; m.attente = 3 + Math.random() * 6; m.pts = null; }
    else allerA(m, ...pl); // la plage a changé : il rejoint son nouveau lieu à pied
  }
}
function pas(m, dt) {
  const U = m.g.userData;
  if (!m.g.visible) return;
  if (partner === m.g || (mode === "dialog" && Math.hypot(m.g.position.x - player.position.x, m.g.position.z - player.position.z) < 3)) {
    faceTo(m.g, player.position.x, player.position.z, dt, 4); animate(m.g, false, dt); return;
  }
  if (!m.pts || m.k >= m.pts.length) {
    animate(m.g, false, dt);
    if (m.pts && m.k >= m.pts.length) { m.pts = null; }
    if (!m.but && (m.attente -= dt) <= 0) suivant(m);
    return;
  }
  const [X, Y] = m.pts[m.k], dx = X - m.X, dy = Y - m.Y, d = Math.hypot(dx, dy), s = m.vitesse * dt;
  // Personne ne traverse personne : devant un passant ou Aliénor, on fait un pas de côté, sinon on attend.
  const ux = dx / (d || 1), uy = dy / (d || 1), gene = obstacle(m, m.X + ux * 0.7, m.Y + uy * 0.7);
  if (gene) {
    m.gene = (m.gene || 0) + dt;
    for (const c of [1, -1]) { const nx = m.X - uy * c * s, ny = m.Y + ux * c * s; if (W.praticable(nx, ny) && !obstacle(m, nx, ny)) { m.X = nx; m.Y = ny; break; } }
    if (m.gene > 3) { m.gene = 0; m.attente = 1; m.but = m.pts[m.pts.length - 1] ? { X: m.pts[m.pts.length - 1][0], Y: m.pts[m.pts.length - 1][1] } : null; m.pts = null; if (m.but && !file.includes(m)) file.push(m); }
    const q0 = W.versScene(m.X, m.Y); m.g.position.set(q0.x, q0.y, q0.z); animate(m.g, false, dt); return;
  }
  m.gene = 0;
  if (d <= s) { m.X = X; m.Y = Y; m.k++; } else { m.X += dx / d * s; m.Y += dy / d * s; }
  const q = W.versScene(m.X, m.Y); m.g.position.set(q.x, q.y, q.z);
  faceTo(m.g, q.x + dx, q.z + dy, dt, 8); animate(m.g, true, dt, 8.5 * m.vitesse);
}
// Quelqu'un (un autre marcheur visible, ou Aliénor) occupe-t-il ce point, à 0,6 m près ?
function obstacle(m, X, Y) {
  const P = W.depuisScene(player.position.x, player.position.z); if (Math.hypot(P.X - X, P.Y - Y) < 0.65) return true;
  for (const o of marcheurs) if (o !== m && o.g.visible && Math.hypot(o.X - X, o.Y - Y) < 0.6 && Math.hypot(o.X - X, o.Y - Y) < Math.hypot(o.X - m.X, o.Y - m.Y)) return true;
  return false;
}
function vivre(dt) {
  if (!W.enVille()) return;
  if (!pret) { preparer(); recenser(true); }
  const t = V().t, k = S.act + ":" + t;
  if (k !== tVu) { const depart = tVu === null; tVu = k; recenser(depart); }
  const m = file.shift();
  if (m && m.but) { const pts = W.chemin({ X: m.X, Y: m.Y }, m.but); m.but = null; if (pts && pts.length > 1) { m.pts = pts; m.k = 1; } }
  for (const x of marcheurs) pas(x, dt);
}
const _charTick = charTick;
charTick = function (dt) { _charTick(dt); try { vivre(dt); } catch (e) { console.error(e); } };

/* ================= Saluer ================= */
const proche = (filtre, r) => { const P = player.position; let best = null, bd = r; for (const m of marcheurs) { if (!m.g.visible || !filtre(m)) continue; const d = Math.hypot(m.g.position.x - P.x, m.g.position.z - P.z); if (d < bd) { bd = d; best = m; } } return best; };
function rumeur(q) {
  const v = V();
  for (const f of Object.keys(M.FAITS)) { if (!M.FAITS[f].circule) continue; const n = M.versionDansQuartier(v, f, q); if (n) return M.FAITS[f].v[n]; }
  return null;
}
function saluer(m) {
  const v = V(); M.saluer(v, m.hab);
  const mots = MOTS[m.hab] || {}, q = (M.LIEUX[m.lieu] || {}).q, r = q && rumeur(q), L = [[m.nom, mots[m.lieu] || mots._ || "« Bonjour. »"]];
  if (r && m.hab !== "percepteur") L.push([m.nom, "« On dit dans le quartier : " + r.charAt(0).toLowerCase() + r.slice(1).replace(/\.$/, "") + ". »"]);
  v.croises = v.croises || {}; v.croises[m.hab] = { lieu: m.lieu, t: v.t }; // le carnet sait où on l'a vu
  talk(L, Vie.apres);
}
function parlerPassant(m) {
  const X = m.X, Y = m.Y, s = A.secteur(X, Y), q = s && QUARTIER_DE_SECTEUR[s.n], r = q && rumeur(q);
  const banal = ["« Belle journée pour la Saint-Michel. »", "« Pardon, je suis pressé. »", "« Le tribut, encore. Comme chaque année. »", "« Vous êtes la fille de l’imprimerie, non ? »", "« Les rues montent, ici. On a les jambes de la ville. »"];
  talk([["Un passant", r ? "« Vous savez ce qu’on raconte ? " + r + " »" : banal[(m.rang + V().t) % banal.length]]], Vie.apres);
}
INTER.push(
  { p: () => { const m = proche(x => x.hab, 2.2); return m ? { x: m.g.position.x, z: m.g.position.z } : { x: 1e9, z: 1e9 }; }, r: 2.2,
    get label() { const m = proche(x => x.hab, 2.2); return m ? "Saluer " + (m.hab === "boucher" || m.hab === "chasseur" || m.hab === "percepteur" ? m.nom.toLowerCase() : m.nom) : "Saluer"; },
    can: () => W.enVille() && !!proche(x => x.hab, 2.2), act() { const m = proche(x => x.hab, 2.2); if (m) saluer(m); } },
  { p: () => { const m = proche(x => x.passant, 2); return m ? { x: m.g.position.x, z: m.g.position.z } : { x: 1e9, z: 1e9 }; }, r: 2,
    label: "Parler à un passant", can: () => W.enVille() && !!proche(x => x.passant, 2) && !proche(x => x.hab, 2.2), act() { const m = proche(x => x.passant, 2); if (m) parlerPassant(m); } }
);

window.Habitants = { marcheurs, POSTES, recenser: () => recenser(false), present: hab => { const m = marcheurs.find(x => x.hab === hab); return m && m.g.visible ? { lieu: m.lieu, X: m.X, Y: m.Y, enRoute: !!(m.but || (m.pts && m.k < m.pts.length)), vers: m.pts ? m.pts[m.pts.length - 1] : null } : null; } };
})();
