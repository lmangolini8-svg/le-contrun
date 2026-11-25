/* Monde de Sarlande : état commun de la partie et simulation hors champ.

   Tout ce qui doit survivre à une reprise vit dans un seul objet sérialisable, `vie`,
   rangé dans la sauvegarde existante (S.vie). Les règles du cahier des charges :
   - un compteur de temps continu (t = jour * 3 + plage), converti à part pour l'affichage ;
   - un journal des effets déjà appliqués : un versement, une livraison ou la résolution
     d'une plage ne se rejouent jamais après un rechargement ;
   - des habitants qui ont un domicile, un lieu de travail et un agenda, qui s'en écartent
     pour une raison, qui savent des choses (fait, version, provenance) et se les transmettent ;
   - des liens dans chaque sens, une réputation publique distincte de la confiance privée ;
   - des engagements, des visites, des sujets de conversation mémorisés ;
   - quatre barres visibles : Repos, Satiété, Endurance, Convictions.
   Aucun accès au DOM ni à Three.js : ce fichier se teste sous Node. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./calendrier.js"));
  else root.Monde = factory(root.Calendrier);
})(typeof self !== "undefined" ? self : this, function (Cal) {
  "use strict";
  const VERSION = 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* Hachage déterministe : la même partie rechargée donne les mêmes rencontres hors champ. */
  function hache(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

  /* ================= Lieux et quartiers ================= */
  const LIEUX = {
    clos: { q: "clos", nom: "le clos des murailles" },
    maison_ysabeau: { q: "clos", nom: "chez Ysabeau" },
    place: { q: "place", nom: "la grande place" },
    fournil: { q: "place", nom: "le fournil de Maëlle" },
    halles: { q: "place", nom: "les halles" },
    palais: { q: "place", nom: "la porte du palais" },
    rue_du_four: { q: "place", nom: "la rue du Four" },
    imprimerie: { q: "imprimerie", nom: "l’imprimerie d’Anselme" },
    drapiers: { q: "drapiers", nom: "la rue des Drapiers" },
    quai: { q: "quai", nom: "le quai" },
    tannerie: { q: "quai", nom: "la tannerie" },
    parvis: { q: "parvis", nom: "le parvis" },
    campagne: { q: "dehors", nom: "hors les murs" }
  };
  const QUARTIERS = ["clos", "place", "imprimerie", "drapiers", "quai", "parvis", "dehors"];

  /* ================= Habitants =================
     agenda : lieu par plage [matin, après-midi, soir], `dim` pour le dimanche,
     `marche` les jours de marché, `tribut` le jour du tribut. Les écarts ponctuels sont dans vie.ecarts. */
  const HABITANTS = {
    anselme: { nom: "Maître Anselme", domicile: "imprimerie", agenda: ["imprimerie", "imprimerie", "imprimerie"], dim: ["parvis", "imprimerie", "imprimerie"], bavard: 1 },
    maelle: { nom: "Maëlle", domicile: "rue_du_four", agenda: ["fournil", "fournil", "rue_du_four"], dim: ["parvis", "rue_du_four", "rue_du_four"], bavard: 2 },
    ysabeau: { nom: "Ysabeau", domicile: "maison_ysabeau", agenda: ["place", "maison_ysabeau", "maison_ysabeau"], dim: ["parvis", "maison_ysabeau", "maison_ysabeau"], bavard: 3 },
    garin: { nom: "Garin", domicile: "quai", agenda: ["tannerie", "tannerie", "quai"], tribut: ["place", "tannerie", "quai"], bavard: 1 },
    perrine: { nom: "Perrine", domicile: "drapiers", agenda: ["place", "drapiers", "drapiers"], bavard: 3 },
    jeanne: { nom: "Jeanne", domicile: "campagne", agenda: ["campagne", "campagne", "campagne"], marche: ["halles", "campagne", "campagne"], tribut: ["place", "place", "campagne"], bavard: 2 },
    boucher: { nom: "Le boucher", domicile: "halles", agenda: ["halles", "halles", "halles"], bavard: 1 },
    chasseur: { nom: "Le chasseur", domicile: "campagne", agenda: ["campagne", "campagne", "campagne"], marche: ["halles", "campagne", "campagne"], bavard: 1 },
    bertin: { nom: "Bertin", domicile: "place", agenda: ["place", "place", "rue_du_four"], bavard: 3 },
    percepteur: { nom: "Le percepteur", domicile: "palais", agenda: ["palais", "palais", "palais"], tribut: ["place", "place", "palais"], bavard: 0 }
  };

  /* ================= Boutiques et articles ================= */
  const ARTICLES = {
    miche: { nom: "une miche", prix: 1, satiete: 30 },
    viande: { nom: "un morceau de viande", prix: 3, satiete: 45, feu: true },
    gibier: { nom: "un lièvre", prix: 4, satiete: 50, feu: true },
    legumes: { nom: "une botte de légumes", prix: 1, satiete: 15 },
    eau: { nom: "une cruche d’eau", prix: 0, satiete: 0 }
  };
  const BOUTIQUES = {
    fournil: { nom: "Le fournil de Maëlle", hab: "maelle", lieu: "fournil", jours: [1, 2, 3, 4, 5, 6], plages: [0, 1], articles: ["miche"] },
    boucher: { nom: "L’étal du boucher", hab: "boucher", lieu: "halles", jours: [2, 4, 6], plages: [0, 1], tribut: true, articles: ["viande"] },
    chasseur: { nom: "Le chasseur", hab: "chasseur", lieu: "halles", jours: [3, 6], plages: [0], articles: ["gibier"] },
    paysanne: { nom: "Les paniers de Jeanne", hab: "jeanne", lieu: "halles", jours: [3, 6], plages: [0], tribut: true, articles: ["legumes"] }
  };

  /* ================= Travaux à l'atelier =================
     Le devis montre délai, paie, effort, matériaux et signature avant tout engagement. */
  const TRAVAUX = {
    ecriteau: { nom: "Composer un écriteau", client: "bertin", plages: 1, paie: 12, effort: 30, materiaux: "papier et encre de l’atelier", signature: "sans nom, au nom de l’atelier", texte: "Les prix des cages de Bertin, en grosses lettres." },
    bon: { nom: "Corriger un bon de farine", client: "maelle", plages: 0, paie: 6, effort: 10, materiaux: "épreuve fournie par le fournil", signature: "le bon reste au nom du fournil", texte: "Relire les poids et les sommes d’un bon de livraison de farine." },
    livraison: { nom: "Livrer des tirages", client: "perrine", plages: 1, paie: 10, effort: 25, materiaux: "vingt avis déjà tirés", signature: "aucune", texte: "Porter les avis de la Saint-Michel aux boutiques de la rue des Drapiers." },
    affiche: { nom: "Composer une affiche de marché", client: "boucher", plages: 1, paie: 20, effort: 35, materiaux: "papier et encre de l’atelier", signature: "atelier d’Anselme", texte: "Une affiche pour les halles.", examen: "composer" }
  };
  const EXAMENS = {
    composer: { nom: "Composer une commande", ouvre: "les commandes de quartier mieux payées" },
    tirer: { nom: "Conduire un tirage", ouvre: "la responsabilité d’un tirage", requis: "composer" },
    signer: { nom: "Signer de son nom", ouvre: "les publications signées", requis: "tirer" }
  };

  /* ================= Faits, versions et sujets ================= */
  const FAITS = {
    lettre_miche: { circule: true, v: { 1: "Quelqu’un glisse sous les portes une lettre qui demande de faire peser la miche de Maëlle." } },
    miche_legere: { circule: true, v: { 1: "La miche de Maëlle pèse moins que ce qu’annonce son prix.", 2: "La farine arrive au fournil déjà pesée par la balance du palais, et cette balance compte court. La miche est légère parce que la mesure du palais est fausse." } },
    pesee_publique: { circule: true, v: { 1: "Aliénor a fait peser la miche de Maëlle devant les clients." } },
    confidence_maelle: { circule: false, v: { 1: "Maëlle a confié à Aliénor, en privé, d’où vient le poids qui manque." } },
    garin_denonce: { circule: true, v: { 1: "Quelqu’un a désigné Garin au percepteur." } }
  };
  const SUJETS = {
    "maelle:miche": { hab: "maelle", titre: "Le poids de la miche", fait: "miche_legere", objet: "bon_de_farine", perso: false },
    "maelle:pere": { hab: "maelle", titre: "Le four de son père", perso: true },
    "ysabeau:mere": { hab: "ysabeau", titre: "Ta mère", perso: true },
    "anselme:livre": { hab: "anselme", titre: "Le livre brûlé", perso: true },
    "garin:sac": { hab: "garin", titre: "Trente ans de sacs", perso: false }
  };

  /* ================= Création et migration ================= */
  function creer(graine) {
    const vie = {
      v: VERSION, graine: graine == null ? 1550 : graine, t: Cal.tDe(0, 0), seq: 0,
      journal: {}, bourse: 20, inventaire: { lettre: 1, robe_ocre: 1, robe_indigo: 1 },
      tenue: null, reglage: "souple",
      barres: { repos: 80, satiete: 55, endurance: 85, convictions: 50 }, conviction: "Aliénor ne sait pas encore ce qu’elle pense de ce matin.",
      pauses: {}, sait: { alienor: {} }, rel: {}, reputation: {}, rumeurs: {}, ecarts: [], engagements: [],
      visites: [], sujets: {}, salues: {}, examens: {}, competences: { imprimerie: 0, culture: 0, artisanat: 0, enquete: 0, transmission: 0 },
      travaux: {}, adresses: {}, fournisseurs: {}, evenements: [],
      recit: { etape: "reveil", lettre: "glissee", volets: false, cruche: false, jardin: false, provisions: false, pesee: null, tribut: false, poste: false, cloche: false, repas: false, nuit: false, lendemain: null }
    };
    for (const k in HABITANTS) vie.sait[k] = {};
    // Perrine a reçu la même lettre : si personne n'a fait peser la miche, elle le fera l'après-midi.
    engager(vie, { id: "perrine:pesee", de: "perrine", quoi: "peser_miche", t: Cal.tDe(0, 1), lieu: "fournil" });
    savoir(vie, "perrine", "lettre_miche", 1, "lettre", false);
    return vie;
  }

  /* Partie enregistrée avant la refonte : on garde tout, on ajoute l'état du monde,
     et l'ouverture n'est pas rejouée si le joueur l'avait déjà dépassée. */
  function migrer(S) {
    if (!S || typeof S !== "object") return S;
    if (!S.vie || typeof S.vie !== "object" || S.vie.v !== VERSION) {
      const ancien = S.vie && typeof S.vie === "object" ? S.vie : null;
      S.vie = Object.assign(creer(), ancien || {}, { v: VERSION });
      if (!ancien && S.started && ((S.stage || 0) > 0 || (S.act || 1) > 1)) {
        const r = S.vie.recit;
        Object.assign(r, { etape: "ville", ancienne: true, lettre: "lue", poste: true, cloche: true, tribut: (S.stage || 0) >= 2 || (S.act || 1) > 1 });
        S.vie.journal["perrine:pesee"] = 0;
      }
    }
    S.v = VERSION;
    return S;
  }

  /* ================= Journal : chaque effet ne s'applique qu'une fois ================= */
  function applique(vie, id) { return Object.prototype.hasOwnProperty.call(vie.journal, id); }
  function appliquer(vie, id, fn) { if (applique(vie, id)) return false; vie.journal[id] = vie.t; if (fn) fn(); return true; }
  function noter(vie, texte) { vie.evenements.push({ t: vie.t, texte }); if (vie.evenements.length > 80) vie.evenements.shift(); }

  /* ================= Temps ================= */
  const jour = vie => Cal.jourDuT(vie.t), plage = vie => Cal.plageDuT(vie.t);
  const estJourTribut = j => { const d = Cal.date(j); return d.m === Cal.TRIBUT.m && d.j === Cal.TRIBUT.j; };

  function lieuDe(vie, hab, t) {
    t = t == null ? vie.t : t;
    const e = vie.ecarts.find(x => x.hab === hab && x.t === t);
    if (e) return e.lieu;
    const h = HABITANTS[hab], j = Cal.jourDuT(t), p = Cal.plageDuT(t);
    let a = h.agenda;
    if (estJourTribut(j) && h.tribut) a = h.tribut;
    else if (Cal.jourSemaine(j) === 0 && h.dim) a = h.dim;
    else if (Cal.estJourDeMarche(j) && h.marche) a = h.marche;
    return a[p];
  }
  function motifEcart(vie, hab, t) { const e = vie.ecarts.find(x => x.hab === hab && x.t === (t == null ? vie.t : t)); return e ? e.motif : null; }
  function ecarter(vie, hab, t, lieu, motif) {
    vie.ecarts = vie.ecarts.filter(x => !(x.hab === hab && x.t === t));
    vie.ecarts.push({ hab, t, lieu, motif });
  }
  function presents(vie, lieu, t) { return Object.keys(HABITANTS).filter(h => lieuDe(vie, h, t) === lieu); }

  /* Avance d'une ou plusieurs plages. Chaque plage terminée est résolue une seule fois. */
  function avancer(vie, n = 1) {
    for (let i = 0; i < n; i++) { resoudrePlage(vie, vie.t); vie.t++; usure(vie); }
    return vie.t;
  }
  function avancerJusqua(vie, t) { while (vie.t < t) avancer(vie, 1); return vie.t; }

  /* Effets d'une plage sur les barres : la satiété baisse, l'endurance suit la satiété. */
  function usure(vie) {
    const k = vie.reglage === "exigeant" ? 1.5 : 1, b = vie.barres;
    b.satiete = clamp(b.satiete - 12 * k, 0, 100);
    if (b.satiete < 20) b.endurance = clamp(b.endurance - 8 * k, 0, 100);
  }

  /* ================= Barres ================= */
  function effort(vie, cout) {
    const b = vie.barres, k = vie.reglage === "exigeant" ? 1.3 : 1, c = Math.round(cout * k);
    return { cout: c, ok: b.endurance >= c, manque: Math.max(0, c - b.endurance), options: b.endurance >= c ? [] : ["pause", "reporter", "aide", "fractionner"] };
  }
  function depenser(vie, cout) { const e = effort(vie, cout); vie.barres.endurance = clamp(vie.barres.endurance - e.cout, 0, 100); return e; }
  function pause(vie) {
    const k = vie.t; vie.pauses[k] = (vie.pauses[k] || 0) + 1;
    if (vie.pauses[k] > 2) return 0;
    const gain = vie.barres.satiete >= 50 ? 15 : 8;
    vie.barres.endurance = clamp(vie.barres.endurance + gain, 0, 100);
    return gain;
  }
  function manger(vie, ids) {
    let gain = 0;
    for (const id of ids) { if (!vie.inventaire[id]) continue; vie.inventaire[id]--; if (!vie.inventaire[id]) delete vie.inventaire[id]; gain += ARTICLES[id] ? ARTICLES[id].satiete : 0; }
    vie.barres.satiete = clamp(vie.barres.satiete + gain, 0, 100);
    return gain;
  }
  function conviction(vie, delta, phrase) { vie.barres.convictions = clamp(vie.barres.convictions + delta, 0, 100); if (phrase) vie.conviction = phrase; }

  /* Dormir, le soir venu, jusqu'au matin suivant. Une nuit courte (après une nuit blanche à la presse) repose mal. */
  function dormir(vie, courte) {
    const j = jour(vie), id = "nuit:" + j;
    if (plage(vie) !== 2 || applique(vie, id)) return false;
    resoudrePlage(vie, vie.t);
    appliquer(vie, id, () => {
      const b = vie.barres, nourrie = b.satiete >= 40;
      b.repos = courte ? clamp(35 + (nourrie ? 10 : 0), 0, 100) : clamp(70 + (nourrie ? 20 : 5) + Math.round(b.repos * 0.1), 0, 100);
      b.satiete = clamp(b.satiete - 15, 0, 100);
      b.endurance = clamp(Math.round(30 + b.repos * 0.7), 0, 100);
      vie.t = Cal.tDe(j + 1, 0);
      vie.recit.nuit = true;
      noter(vie, courte ? "Une nuit trop courte." : "Une nuit de sommeil.");
      prevoirLendemain(vie);
    });
    return true;
  }

  /* ================= Savoirs, liens et rumeurs ================= */
  function savoir(vie, hab, fait, v, src, constate) {
    const s = vie.sait[hab] || (vie.sait[hab] = {}), cur = s[fait];
    if (cur && cur.v >= v) return false;
    s[fait] = { v, src, t: vie.t, vu: !!constate };
    const q = hab === "alienor" ? null : LIEUX[lieuDe(vie, hab)] && LIEUX[lieuDe(vie, hab)].q;
    if (q && FAITS[fait] && FAITS[fait].circule) {
      const r = vie.rumeurs[fait] || (vie.rumeurs[fait] = {});
      if (!r[q] || r[q].v < v) r[q] = { v, t: vie.t };
    }
    return true;
  }
  const sait = (vie, hab, fait) => (vie.sait[hab] || {})[fait] || null;
  function lien(vie, de, a) { const k = de + ">" + a; return vie.rel[k] || (vie.rel[k] = { aff: 0, conf: 0 }); }
  function lier(vie, de, a, aff, conf) { const l = lien(vie, de, a); l.aff = clamp(l.aff + (aff || 0), -5, 5); l.conf = clamp(l.conf + (conf || 0), -5, 5); return l; }
  function reputer(vie, q, d) { vie.reputation[q] = clamp((vie.reputation[q] || 0) + d, -5, 5); }
  /* Ce qu'un quartier croit d'un fait : la version la plus récente qui l'a atteint. */
  const versionDansQuartier = (vie, fait, q) => ((vie.rumeurs[fait] || {})[q] || {}).v || 0;

  /* Les habitants réunis dans un même lieu pendant une plage se transmettent ce qu'ils savent. */
  function transmettre(vie, t) {
    const parLieu = {};
    for (const h in HABITANTS) (parLieu[lieuDe(vie, h, t)] = parLieu[lieuDe(vie, h, t)] || []).push(h);
    for (const lieu in parLieu) {
      const g = parLieu[lieu].sort();
      for (const a of g) for (const f of Object.keys(vie.sait[a] || {}).sort()) {
        if (!FAITS[f] || !FAITS[f].circule) continue;
        const sa = vie.sait[a][f];
        for (const b of g) {
          if (a === b) continue;
          const sb = (vie.sait[b] || {})[f];
          if (sb && sb.v >= sa.v) continue;
          const chance = 25 + 12 * HABITANTS[a].bavard + 6 * lien(vie, a, b).aff;
          if (hache(`${vie.graine}|${t}|${a}|${b}|${f}`) % 100 < chance) savoir(vie, b, f, sa.v, a, false);
        }
      }
    }
  }

  /* ================= Engagements et visites ================= */
  function engager(vie, e) {
    if (vie.engagements.some(x => x.id === e.id)) return null;
    const n = Object.assign({ etat: "prevu" }, e); vie.engagements.push(n); return n;
  }
  function tenir(vie, id) { const e = vie.engagements.find(x => x.id === id); if (e && e.etat === "prevu") { e.etat = "tenu"; return true; } return false; }
  function annuler(vie, id) { const e = vie.engagements.find(x => x.id === id); if (e && e.etat === "prevu") e.etat = "annule"; }

  /* Effets des engagements entre habitants, résolus hors champ. */
  const EFFETS = {
    peser_miche(vie, e) {
      if (vie.recit.pesee) { e.etat = "annule"; return; } // Aliénor s'en est déjà chargée
      const t = e.t, temoins = presents(vie, "fournil", t).concat(presents(vie, "place", t));
      savoir(vie, e.de, "miche_legere", 1, "vu", true);
      savoir(vie, "maelle", "miche_legere", 1, "vu", true);
      savoir(vie, "maelle", "lettre_miche", 1, e.de, false);
      for (const h of temoins) savoir(vie, h, "miche_legere", 1, e.de, true);
      lier(vie, "maelle", e.de, -1, -1);
      vie.fournisseurs.perrine = "drapiers";
      vie.recit.peseeHorsChamp = e.de;
      e.etat = "tenu";
      noter(vie, `${HABITANTS[e.de].nom} a fait peser la miche de Maëlle devant le fournil.`);
    }
  };

  function resoudrePlage(vie, t) {
    appliquer(vie, "plage:" + t, () => {
      for (const e of vie.engagements) {
        if (e.t !== t || e.etat !== "prevu") continue;
        if (EFFETS[e.quoi]) EFFETS[e.quoi](vie, e);
        else if (e.a === "alienor" || e.de === "alienor") {
          e.etat = "manque";
          const autre = e.de === "alienor" ? e.a : e.de;
          if (HABITANTS[autre]) lier(vie, autre, "alienor", -1, -1);
          noter(vie, `Un rendez-vous manqué avec ${HABITANTS[autre] ? HABITANTS[autre].nom : autre}.`);
        }
      }
      for (const v of vie.visites) if (v.t === t && v.etat === "attend") {
        v.etat = "manquee";
        vie.inventaire["mot_" + v.hab] = 1;
        noter(vie, `${HABITANTS[v.hab].nom} est passée et a laissé un mot.`);
      }
      transmettre(vie, t);
      // Une rectification qui atteint un client le ramène à son ancien fournisseur.
      if (vie.fournisseurs.perrine && (sait(vie, "perrine", "miche_legere") || {}).v >= 2) delete vie.fournisseurs.perrine;
    });
  }

  function visiteEnCours(vie) { return vie.visites.find(v => v.t === vie.t && v.etat === "attend") || null; }
  function recevoir(vie, id) { const v = vie.visites.find(x => x.id === id); if (!v || v.etat !== "attend") return null; v.etat = "recue"; lier(vie, v.hab, "alienor", 1, 0); return v; }
  function reporter(vie, id) {
    const v = vie.visites.find(x => x.id === id); if (!v || v.etat !== "attend") return null;
    v.etat = "reportee";
    return engager(vie, { id: "rdv:" + v.id, de: "alienor", a: v.hab, quoi: "rendre_visite", t: vie.t + 1, lieu: lieuDe(vie, v.hab, vie.t + 1), motif: v.motif });
  }

  /* ================= Le lendemain : un motif compréhensible pour aborder Aliénor ================= */
  function motifLendemain(vie) {
    const m = vie.sait.maelle || {};
    if (m.pesee_publique) return { hab: "maelle", motif: "reproche" };
    if (m.confidence_maelle) return { hab: "maelle", motif: "bon_de_farine" };
    if (m.miche_legere) return { hab: "maelle", motif: "lire" };
    return { hab: "ysabeau", motif: "conseil" };
  }
  function prevoirLendemain(vie) {
    if (vie.recit.lendemain) return;
    const j = jour(vie), m = motifLendemain(vie);
    vie.recit.lendemain = m.motif;
    vie.visites.push({ id: "visite:" + m.hab + ":" + j, hab: m.hab, t: Cal.tDe(j, 0), motif: m.motif, etat: "attend" });
    // Garin, s'il a été désigné, est convoqué au palais au lieu d'aller à la tannerie.
    if (sait(vie, "garin", "garin_denonce")) ecarter(vie, "garin", Cal.tDe(j, 0), "palais", "convoqué au palais pour la double mesure");
    // Ysabeau achète son pain au fournil par solidarité quand la rumeur a touché Maëlle.
    if (vie.sait.maelle && vie.sait.maelle.miche_legere) ecarter(vie, "ysabeau", Cal.tDe(j, 0), "fournil", "acheter son pain chez Maëlle, pour qu’on la voie le faire");
  }

  /* ================= La pesée de la miche ================= */
  function peserMiche(vie, mode) {
    if (vie.recit.pesee) return false;
    vie.recit.pesee = mode;
    annuler(vie, "perrine:pesee");
    savoir(vie, "alienor", "miche_legere", 1, "vu", true);
    if (mode === "public") {
      const temoins = presents(vie, "fournil").concat(presents(vie, "place"));
      for (const h of temoins) { savoir(vie, h, "miche_legere", 1, "vu", true); savoir(vie, h, "pesee_publique", 1, "vu", true); }
      savoir(vie, "maelle", "pesee_publique", 1, "vu", true);
      lier(vie, "maelle", "alienor", -1, -2);
      reputer(vie, "place", 1);
      conviction(vie, 4, "Elle a dit tout haut ce que la balance montrait. Elle ne sait pas encore ce que cela a coûté à Maëlle.");
    } else {
      savoir(vie, "alienor", "miche_legere", 2, "maelle", false);
      savoir(vie, "maelle", "confidence_maelle", 1, "vu", true);
      lier(vie, "maelle", "alienor", 1, 2);
      conviction(vie, 2, "Elle a choisi d’écouter Maëlle avant de parler. La mesure du palais ne quitte plus ses pensées.");
    }
    return true;
  }

  /* ================= Sujets de conversation ================= */
  function signature(vie, s) {
    const f = s.fait ? (sait(vie, "alienor", s.fait) || {}).v || 0 : 0;
    return f + (s.objet && vie.inventaire[s.objet] ? 10 : 0);
  }
  /* Retourne "nouveau", "suite" (fait nouveau), "insiste" (choix explicite) ou "deja" (déjà traité). */
  function parler(vie, cle, opts) {
    const s = SUJETS[cle]; if (!s) return null;
    const m = vie.sujets[cle], sig = signature(vie, s);
    if (!m) { vie.sujets[cle] = { n: 1, t: vie.t, sig }; return "nouveau"; }
    if (sig > m.sig) { m.sig = sig; m.n++; m.t = vie.t; return "suite"; }
    if (opts && opts.insister) {
      m.n++; m.insiste = (m.insiste || 0) + 1;
      if (s.perso) lier(vie, s.hab, "alienor", -1, -1);
      return "insiste";
    }
    return "deja";
  }
  function saluer(vie, hab) { appliquer(vie, `salut:${hab}:${jour(vie)}`, () => lier(vie, hab, "alienor", 0.25, 0)); }

  /* ================= Boutiques ================= */
  function ouvert(vie, b, t) {
    const B = BOUTIQUES[b]; t = t == null ? vie.t : t;
    const j = Cal.jourDuT(t), p = Cal.plageDuT(t);
    if (!B.plages.includes(p)) return false;
    if (B.tribut && estJourTribut(j)) return true;
    return B.jours.includes(Cal.jourSemaine(j)) && lieuDe(vie, B.hab, t) === B.lieu;
  }
  function horaires(b) {
    const B = BOUTIQUES[b];
    return `${B.jours.map(d => Cal.JOURS[d]).join(", ")} · ${B.plages.map(p => Cal.PLAGES[p]).join(" et ")}`;
  }
  function acheter(vie, b, article) {
    const B = BOUTIQUES[b], A = ARTICLES[article];
    if (!B || !A || !B.articles.includes(article)) return { ok: false, raison: "Cet article n’est pas vendu ici." };
    vie.adresses[b] = horaires(b);
    if (!ouvert(vie, b)) return { ok: false, raison: "Fermé à cette heure-ci. " + horaires(b) + "." };
    if (vie.bourse < A.prix) return { ok: false, raison: "Votre bourse n’y suffit pas." };
    vie.bourse -= A.prix; vie.inventaire[article] = (vie.inventaire[article] || 0) + 1;
    saluer(vie, B.hab);
    return { ok: true, prix: A.prix };
  }

  /* ================= Travaux et examens ================= */
  function devis(vie, id) {
    const w = TRAVAUX[id]; if (!w) return null;
    const e = effort(vie, w.effort), fin = vie.t + w.plages, ex = w.examen && !(vie.examens[w.examen] === "reussi");
    let bloque = null;
    if (ex) bloque = `Il faut d’abord réussir l’épreuve « ${EXAMENS[w.examen].nom} ».`;
    else if (vie.travaux[id + ":" + jour(vie)]) bloque = "Déjà fait aujourd’hui.";
    else if (!vie.recit.tribut && jour(vie) === 0 && Cal.plageDuT(fin) >= 2) bloque = "Le tribut se clôt au soir : il faut d’abord porter le sac.";
    return Object.assign({ id, delai: w.plages ? `${w.plages} plage${w.plages > 1 ? "s" : ""}` : "quelques instants", finit: Cal.PLAGES[Cal.plageDuT(fin)] }, w, { effortReel: e.cout, endurant: e.ok, options: e.options, bloque });
  }
  function accepter(vie, id) {
    const d = devis(vie, id); if (!d || d.bloque || !d.endurant) return null;
    const k = id + ":" + jour(vie);
    vie.travaux[k] = { etat: "accepte", t0: vie.t, fin: vie.t + d.plages };
    engager(vie, { id: "travail:" + k, de: "alienor", a: d.client, quoi: "livrer", t: vie.t + d.plages + 1 });
    return k;
  }
  /* Achever et livrer : le paiement arrive à la livraison, une seule fois. */
  function livrer(vie, k) {
    const w = vie.travaux[k]; if (!w || w.etat === "livre") return false;
    const id = k.split(":")[0], T = TRAVAUX[id];
    depenser(vie, T.effort);
    avancerJusqua(vie, w.fin);
    appliquer(vie, "paie:" + k, () => {
      vie.bourse += T.paie; w.etat = "livre"; tenir(vie, "travail:" + k);
      vie.competences.imprimerie += 1; lier(vie, T.client, "alienor", 0.5, 0.5);
      noter(vie, `${T.nom} : ${T.paie} sous.`);
      if (id === "bon") savoir(vie, "alienor", "miche_legere", Math.max(1, (sait(vie, "alienor", "miche_legere") || {}).v || 1), "bon", true);
      if (id === "bon") vie.inventaire.bon_de_farine = 1;
    });
    return true;
  }
  function passerExamen(vie, id, reussi) {
    const E = EXAMENS[id]; if (!E) return false;
    if (E.requis && vie.examens[E.requis] !== "reussi") return false;
    if (vie.examens[id] === "reussi") return true;
    vie.examens[id] = reussi ? "reussi" : "echoue";
    if (reussi) { vie.competences.imprimerie += 2; noter(vie, `Épreuve réussie : ${E.nom}.`); }
    return reussi;
  }

  /* ================= Affichage ================= */
  function almanach(vie) {
    const l = Cal.lisible(vie.t), p = Cal.prochaineFete(jour(vie));
    return Object.assign(l, { prochaine: p ? `${p.nom} dans ${p.dans} jour${p.dans > 1 ? "s" : ""}` : "" });
  }

  return {
    VERSION, LIEUX, QUARTIERS, HABITANTS, ARTICLES, BOUTIQUES, TRAVAUX, EXAMENS, FAITS, SUJETS,
    creer, migrer, applique, appliquer, noter, jour, plage, estJourTribut, lieuDe, motifEcart, ecarter, presents,
    avancer, avancerJusqua, effort, depenser, pause, manger, conviction, dormir,
    savoir, sait, lien, lier, reputer, versionDansQuartier, transmettre,
    engager, tenir, annuler, resoudrePlage, visiteEnCours, recevoir, reporter, motifLendemain, prevoirLendemain,
    peserMiche, parler, saluer, ouvert, horaires, acheter, devis, accepter, livrer, passerExamen, almanach, hache
  };
});
