/* L'atlas de Sarlande : relief, secteurs, sites et voies, et le seul passage vers la scène 3D.

   Repère de l'atlas (25 novembre 2026) : 1 unité = 1 m, X vers l'est, Y vers le sud.
   Grille de 601 × 641 pixels, centre du premier pixel en (0, 40), pas de 1 m.
   Altitude locale en mètres = valeur brute / 1000 − 10.

   Repère de la scène Three.js : y vers le haut, x vers l'est, z vers le sud (le nord est à −z).
   L'unique transformation, utilisée pour la caméra, les collisions, les personnages et la carte :

       x = X − 340        z = Y − 429        y = altitude − 8,81

   L'origine est la fontaine de la place (site « fontaine », centre (340, 429), sol à 8,81 m) :
   le sol de la place reste à y = 0, comme dans les scènes existantes. Aucune rotation, aucune
   mise à l'échelle : un mètre de l'atlas est un mètre de la scène.

   Aucun accès au DOM ni à Three.js : ce fichier se teste sous Node. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./atlas_donnees.js"));
  else root.Atlas = factory(root.ATLAS_DONNEES);
})(typeof self !== "undefined" ? self : this, function (D) {
  "use strict";
  const W = D.largeur, H = D.hauteur, Y0 = D.y0;
  const ORIGINE = { X: 340, Y: 429, alt: 8.81 };

  /* Valeurs brutes, sans retouche : Uint16 petit-boutiste. */
  function decode64(s) {
    if (typeof Buffer !== "undefined") { const b = Buffer.from(s, "base64"); return new Uint8Array(b.buffer, b.byteOffset, b.length); }
    const bin = atob(s), u = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    return u;
  }
  const octets = decode64(D.hauteurs);
  const brut = new Uint16Array(W * H);
  for (let i = 0; i < brut.length; i++) brut[i] = octets[2 * i] | (octets[2 * i + 1] << 8);
  const secteurs = new Uint8Array(W * H);
  for (let i = 0, k = 0; i < D.secteurs.length; i += 2) { secteurs.fill(D.secteurs[i], k, k + D.secteurs[i + 1]); k += D.secteurs[i + 1]; }

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const dans = (X, Y) => X >= 0 && X <= W - 1 && Y >= Y0 && Y <= Y0 + H - 1;
  const brutA = (c, r) => brut[clamp(r, 0, H - 1) * W + clamp(c, 0, W - 1)];

  /* Altitude en mètres, interpolée entre les quatre centres de pixels voisins. */
  function altitude(X, Y) {
    const c = clamp(X, 0, W - 1), r = clamp(Y - Y0, 0, H - 1);
    const c0 = Math.floor(c), r0 = Math.floor(r), fc = c - c0, fr = r - r0;
    const v = brutA(c0, r0) * (1 - fc) * (1 - fr) + brutA(c0 + 1, r0) * fc * (1 - fr) + brutA(c0, r0 + 1) * (1 - fc) * fr + brutA(c0 + 1, r0 + 1) * fc * fr;
    return v / 1000 - 10;
  }
  function valeurBrute(X, Y) { return brutA(Math.round(X), Math.round(Y - Y0)); }

  function secteur(X, Y) {
    if (!dans(X, Y)) return null;
    const n = secteurs[Math.round(Y - Y0) * W + Math.round(X)];
    return n ? { n, nom: D.nomsSecteurs[n] } : null;
  }

  /* Passage atlas ↔ scène. */
  const versScene = (X, Y, alt) => ({ x: X - ORIGINE.X, y: (alt === undefined ? altitude(X, Y) : alt) - ORIGINE.alt, z: Y - ORIGINE.Y });
  const depuisScene = (x, z) => ({ X: x + ORIGINE.X, Y: z + ORIGINE.Y });
  const solScene = (x, z) => altitude(x + ORIGINE.X, z + ORIGINE.Y) - ORIGINE.alt;

  /* Sites : emprise, centre et cote de sol. */
  const SITES = {};
  for (const s of D.sites) {
    const p = s.polygone_xy_m.slice(0, -1);
    const X = p.reduce((a, q) => a + q[0], 0) / p.length, Y = p.reduce((a, q) => a + q[1], 0) / p.length;
    SITES[s.id] = { id: s.id, nom: s.nom, surface: s.surface, polygone: s.polygone_xy_m, cote: s.cote_sol_m, centre: { X, Y }, scene: versScene(X, Y, s.cote_sol_m) };
  }
  function dansPolygone(X, Y, poly) {
    let dedans = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j];
      if ((yi > Y) !== (yj > Y) && X < ((xj - xi) * (Y - yi)) / (yj - yi) + xi) dedans = !dedans;
    }
    return dedans;
  }
  const sitesEn = (X, Y) => Object.values(SITES).filter(s => dansPolygone(X, Y, s.polygone));

  /* Voies avec profil : [X, Y, cote]. Longueur et pente maximale sur une fenêtre glissante de 10 m. */
  function longueur(pts) { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; }
  function penteMax(pts, fenetre = 10) {
    const s = [0]; for (let i = 1; i < pts.length; i++) s.push(s[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const cote = d => { let i = 1; while (i < s.length - 1 && s[i] < d) i++; const t = (d - s[i - 1]) / ((s[i] - s[i - 1]) || 1); return pts[i - 1][2] + t * (pts[i][2] - pts[i - 1][2]); };
    let m = 0;
    for (let d = 0; d + fenetre <= s[s.length - 1] + 1e-9; d += 0.5) m = Math.max(m, Math.abs(cote(d + fenetre) - cote(d)) / fenetre);
    return m * 100;
  }
  const CHEMINS = D.chemins, PROFILS = D.profils, RUELLES = D.ruelles;
  const cheminScene = id => CHEMINS[id].map(([X, Y, c]) => versScene(X, Y, c));

  return {
    ORIGINE, LARGEUR: W, HAUTEUR: H, Y0, REPERE: D.repere,
    SITES, CHEMINS, PROFILS, RUELLES, ENCEINTE: D.enceinte, BRAS_OCCIDENTAL: D.brasOccidental, NOMS_SECTEURS: D.nomsSecteurs,
    altitude, valeurBrute, secteur, dans, versScene, depuisScene, solScene, sitesEn, dansPolygone, longueur, penteMax, cheminScene
  };
});
