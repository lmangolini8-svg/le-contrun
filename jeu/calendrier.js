/* Calendrier de Sarlande
   Calendrier julien (en usage en 1550), Pâques julienne, millésime des actes officiels
   qui change à Pâques sur le modèle lyonnais, trois plages par jour.

   Le temps de jeu est un compteur continu : t = jour * 3 + plage.
   Le jour 0 est le réveil du premier matin. La date affichée est calculée séparément.
   Utilisable tel quel dans la page (window.Calendrier) et sous Node (require). */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Calendrier = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* Décisions encore ouvertes pour Lucas : date exacte du réveil et jour annuel du tribut.
     Valeurs provisoires : la Saint-Michel, terme traditionnel des redevances. */
  const DEPART = { a: 1550, m: 9, j: 29, aFixer: true };
  const TRIBUT = { m: 9, j: 29, aFixer: true };

  const PLAGES = ["matin", "après-midi", "soir"];
  const JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  const JOURS_MARCHE = [3, 6]; // mercredi et samedi

  const div = (a, b) => Math.floor(a / b);

  /* Numéro de jour julien depuis une date du calendrier julien. */
  function jdn(a, m, j) {
    const k = div(14 - m, 12), y = a + 4800 - k, mm = m + 12 * k - 3;
    return j + div(153 * mm + 2, 5) + 365 * y + div(y, 4) - 32083;
  }
  /* Date julienne depuis un numéro de jour julien. */
  function depuisJdn(n) {
    const c = n + 32082, d = div(4 * c + 3, 1461), e = c - div(1461 * d, 4), m = div(5 * e + 2, 153);
    return { j: e - div(153 * m + 2, 5) + 1, m: m + 3 - 12 * div(m, 10), a: d - 4800 + div(m, 10) };
  }
  /* Pâques dans le calendrier julien (algorithme de Meeus). */
  function paques(a) {
    const x = a % 4, y = a % 7, z = a % 19, d = (19 * z + 15) % 30, e = (2 * x + 4 * y - d + 34) % 7;
    const s = d + e + 114;
    return { a, m: div(s, 31), j: (s % 31) + 1 };
  }

  const J0 = jdn(DEPART.a, DEPART.m, DEPART.j);
  const jdnDuJour = jour => J0 + jour;
  const jourDe = (a, m, j) => jdn(a, m, j) - J0;
  const jourPaques = a => { const p = paques(a); return jourDe(p.a, p.m, p.j); };

  /* Millésime des actes officiels : l'année change à Pâques (style de Pâques, Lyon). */
  function millesimeOfficiel(jour) {
    const d = depuisJdn(jdnDuJour(jour));
    return jour >= jourPaques(d.a) ? d.a : d.a - 1;
  }

  const FETES_FIXES = [
    [1, 1, "la Circoncision"], [1, 6, "l’Épiphanie"], [2, 2, "la Chandeleur"], [3, 25, "l’Annonciation"],
    [6, 24, "la Saint-Jean"], [6, 29, "la Saint-Pierre"], [8, 15, "l’Assomption"], [9, 29, "la Saint-Michel"],
    [11, 1, "la Toussaint"], [11, 11, "la Saint-Martin"], [12, 25, "Noël"]
  ];
  const FETES_MOBILES = [
    [-47, "Mardi gras"], [-46, "les Cendres"], [-7, "les Rameaux"], [-2, "le Vendredi saint"], [0, "Pâques"],
    [39, "l’Ascension"], [49, "la Pentecôte"], [60, "la Fête-Dieu"]
  ];

  function fetesDuJour(jour) {
    const d = depuisJdn(jdnDuJour(jour)), out = [];
    for (const [m, j, n] of FETES_FIXES) if (d.m === m && d.j === j) out.push(n);
    const p = jourPaques(d.a);
    for (const [k, n] of FETES_MOBILES) if (jour === p + k) out.push(n);
    if (d.m === TRIBUT.m && d.j === TRIBUT.j) out.push("le jour du tribut");
    return out;
  }
  /* Prochaine fête à partir d'un jour : { jour, nom, dans }. */
  function prochaineFete(jour, horizon = 400) {
    for (let k = 1; k <= horizon; k++) { const f = fetesDuJour(jour + k); if (f.length) return { jour: jour + k, nom: f[0], dans: k }; }
    return null;
  }

  const jourSemaine = jour => ((jdnDuJour(jour) + 1) % 7 + 7) % 7; // 0 = dimanche
  const estJourDeMarche = jour => JOURS_MARCHE.includes(jourSemaine(jour));
  const jourDuT = t => div(t, 3);
  const plageDuT = t => ((t % 3) + 3) % 3;
  const tDe = (jour, plage) => jour * 3 + plage;

  function date(jour) { const d = depuisJdn(jdnDuJour(jour)); return Object.assign(d, { sem: jourSemaine(jour) }); }

  /* Date lisible pour l'almanach et le carnet. */
  function lisible(t) {
    const jour = jourDuT(t), d = date(jour), off = millesimeOfficiel(jour);
    const base = `${JOURS[d.sem]} ${d.j === 1 ? "1er" : d.j} ${MOIS[d.m - 1]} ${d.a}`;
    return {
      date: base, plage: PLAGES[plageDuT(t)],
      actes: off !== d.a ? `${off} dans les actes, l’année y change à Pâques` : "",
      fetes: fetesDuJour(jour), marche: estJourDeMarche(jour)
    };
  }

  return { DEPART, TRIBUT, PLAGES, JOURS, MOIS, JOURS_MARCHE, jdn, depuisJdn, paques, jourDe, jourPaques, millesimeOfficiel,
    fetesDuJour, prochaineFete, jourSemaine, estJourDeMarche, jourDuT, plageDuT, tDe, date, lisible };
});
