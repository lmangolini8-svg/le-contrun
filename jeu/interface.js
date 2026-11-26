/* Carte, inventaire, carnet et collections partagent la sauvegarde du jeu. */
"use strict";
(function () {
  const onglets = { carte: "Carte", inventaire: "Inventaire", carnet: "Carnet", collections: "Collections" };
  const lieux = {
    maison: ["Maison et jardin d’Aliénor", [0, 0], null],
    puits: ["Puits des voisins", [-11, -5], null],
    maison_ysabeau: ["Chez Ysabeau", [-17, 7.2], null],
    drapiers: ["Rue des Drapiers", [-124, 0], null],
    presse: ["Imprimerie d’Anselme", [-142.5, 0], [-20, 7]],
    maelle: ["Fournil de Maëlle", null, [-10, -2]],
    halles: ["Halles", [-84, 0], [9, 7]],
    fontaine: ["Fontaine", null, [0, 3]],
    estrade: ["Estrade du tribut", null, [0, -13]],
    garde: ["Cour des gardes", null, [42, -4]],
    poterne: ["Poterne", [-62, 0], [24, -2]],
    chap: ["Chapelle des gardes", null, [52, -2]],
    quai: ["Quai", null, [15, 26]]
  };
  const catégories = {
    provisions: "Provisions", matériaux: "Matériaux", récoltes: "Graines et récoltes",
    mobilier: "Mobilier", tenues: "Tenues", récit: "Objets de récit"
  };
  const objets = {
    eau: ["Cruche d’eau", "provisions", "La remplir au puits. Elle sert à arroser les semis."],
    quignon: ["Quignon de pain", "provisions", "Un morceau de pain conservé dans les provisions."],
    bois_clos: ["Bois de récupération", "matériaux", "Bois pour les recettes de l’atelier de la maison."],
    compost: ["Compost", "matériaux", "Fertilise un semis dans le jardin."],
    graine_chou: ["Graine de chou", "récoltes", "À semer dans un bac du jardin."],
    graine_sauge: ["Graine de sauge", "récoltes", "À semer dans un bac du jardin."],
    sauge_recoltee: ["Sauge récoltée", "récoltes", "Sauge du jardin d’Aliénor."],
    legumes: ["Botte de légumes", "récoltes", "Pour les repas et la préparation du compost."],
    lettre: ["Lettre sans signature", "récit", "La feuille trouvée sous la porte du clos."],
    bon_de_farine: ["Bon de farine", "récit", "Pièce à montrer à Maëlle quand le sujet se présente."],
    mot_maelle: ["Mot de Maëlle", "récit", "Un mot déposé pour vous."],
    mot_ysabeau: ["Mot d’Ysabeau", "récit", "Un mot déposé pour vous."]
  };
  const planches = { clos: "marche", place: "marche", cour: "cour", quai: "quai", archives: "archives", foret: "foret", portesCite: "portes", fete: "fete" };
  const carnetNatif = showCarnet, majHud = refreshHud, majPersonnage = charTick;
  let onglet = "carnet", vue = null, objectif = "", détail = "", catégorie = "tout", repère = "", reprise = null;
  let retourFocus = null;

  function état() {
    const v = Vie.V();
    if (!v.interface) v.interface = { lieux: {}, planches: {}, lus: {}, repères: {}, suivi: null };
    return v.interface;
  }

  function zoneCarte() {
    return Ville.enVille() ? "atlas" : Vie.enClos() ? "clos" : "place";
  }

  function coordonnée(p, région) {
    if (région === "atlas") { const { X, Y } = Ville.depuisScene(p.x, p.z); return [X, Y]; }
    if (région === "clos") { const o = Vie.CL(0, 0); return [p.x - o.x, p.z - o.z]; }
    return [p.x, p.z];
  }

  function listeLieux(région) {
    return Object.entries(lieux).flatMap(([id, [nom, clos, place]]) => {
      const site = Atlas.SITES[id], porte = Ville.dehorsAtlas(id);
      const poste = Habitants.POSTES[id]?.[0];
      const a = porte || site?.centre || poste && { X: poste[0], Y: poste[1] };
      const pos = région === "atlas" ? a && [a.X, a.Y] : région === "clos" ? clos : place;
      return pos ? [{ id, nom, pos }] : [];
    });
  }

  function lieuxConnus(région, p) {
    const connus = état().lieux;
    return listeLieux(région).filter(l => connus[l.id] || Math.hypot(l.pos[0] - p[0], l.pos[1] - p[1]) < (région === "atlas" ? 18 : 10));
  }

  let découverte = 0;
  charTick = function (dt) {
    majPersonnage(dt);
    if (mode !== "play") return;
    découverte += dt;
    if (découverte < 1) return;
    découverte = 0;
    const région = zoneCarte(), p = coordonnée(player.position, région), journal = état();
    let nouveau = false;
    for (const { id } of lieuxConnus(région, p)) {
      if (journal.lieux[id]) continue;
      journal.lieux[id] = true;
      nouveau = true;
    }
    if (nouveau) save();
  };

  const dernierPlan = leavePlate;
  leavePlate = function () {
    if (mode === "plate" && plateReady && S.started && plate && !plate.page) {
      état().planches[plate.key] = true;
      save();
    }
    dernierPlan();
  };
  plateEl.removeEventListener("click", dernierPlan);
  plateEl.addEventListener("click", leavePlate);

  const accèsCarte = document.createElement("button");
  accèsCarte.type = "button";
  accèsCarte.id = "carteBtn";
  accèsCarte.className = "cart";
  accèsCarte.textContent = "Carte";
  accèsCarte.hidden = mode !== "play";
  $("carnetBtn").before(accèsCarte);
  accèsCarte.addEventListener("click", () => ouvrir("carte", accèsCarte));
  $("carnetBtn").addEventListener("click", e => {
    e.stopImmediatePropagation();
    ouvrir("carnet", e.currentTarget);
  }, true);
  refreshHud = function () {
    majHud();
    accèsCarte.hidden = mode !== "play";
  };

  function ouvrir(cible, source) {
    if (mode === "play" || source) {
      reprise = null;
      objectif = objText();
      vue = null;
      repère = "";
      retourFocus = source || document.activeElement;
    } else if (mode === "panel" && !ov.querySelector(".carnet-joueur")) {
      // Conserve le panel de bilan qui a ouvert le carnet.
      reprise = { contenu: [...ov.childNodes], classes: ov.className, scroll: ov.scrollTop };
    }
    carnetNatif();
    const boîte = ov.querySelector(".box");
    const ancien = document.createElement("div");
    ancien.className = "carnet-section";
    ancien.id = "onglet-carnet";
    ancien.setAttribute("role", "tabpanel");
    ancien.setAttribute("aria-labelledby", "tab-carnet");
    ancien.append(...boîte.childNodes);
    ancien.querySelector(".map")?.closest(".feuil")?.remove();
    ancien.querySelector(".carte-acte")?.closest(".feuil")?.remove();
    const départ = ancien.querySelector("[data-a=back]");
    const texteRetour = départ?.textContent || "Retour au jeu";
    départ?.remove();
    boîte.classList.add("carnet-joueur");
    boîte.insertAdjacentHTML("beforeend", `
      <div class="carnet-entete"><p>${esc(actTitle())}</p><h2>Carnet d’Aliénor</h2></div>
      <div class="carnet-tabs" role="tablist" aria-label="Menu joueur">
        ${Object.entries(onglets).map(([id, titre]) => `<button type="button" id="tab-${id}" role="tab" aria-controls="onglet-${id}" data-onglet="${id}">${titre}</button>`).join("")}
      </div>
      <div class="carnet-pages"></div>
      <div class="carnet-retour"><button type="button" class="pri" data-interface="fermer">${esc(texteRetour)}</button></div>`);
    const pages = boîte.querySelector(".carnet-pages");
    for (const id of Object.keys(onglets)) {
      if (id === "carnet") pages.append(ancien);
      else pages.insertAdjacentHTML("beforeend", `<section class="carnet-section" id="onglet-${id}" role="tabpanel" aria-labelledby="tab-${id}"></section>`);
    }
    ancien.insertAdjacentHTML("afterbegin", `<section class="carnet-objectif"><h3>Objectif en cours</h3><p>${esc(objectif || objText())}</p><button type="button" class="sec" data-interface="objectif">Voir sur la carte</button></section>`);
    const rdv = Monde.rendezVous?.(Vie.V());
    const siteRdv = rdv && siteRendezVous(rdv.lieu);
    const suivi = état().suivi;
    if (rdv) {
      const lieu = Monde.LIEUX[rdv.lieu]?.nom, heure = Calendrier.lisible(rdv.t);
      ancien.querySelector(".carnet-objectif").insertAdjacentHTML("beforeend",
        `<p>Rendez-vous avec ${esc(Monde.HABITANTS[rdv.a]?.nom || rdv.a)} · ${esc(lieu || "")} · ${esc(heure.plage)}</p>
        ${siteRdv ? '<button type="button" class="sec" data-interface="rdv-carte">Rendez-vous sur la carte</button>' : ""}`);
    }
    if (suivi) {
      const nom = lieux[suivi.id]?.[0];
      if (nom) ancien.querySelector(".carnet-objectif").insertAdjacentHTML("beforeend",
        `<p>Repère suivi · ${esc(nom)} <button type="button" class="sec" data-interface="retirer-suivi">Arrêter le suivi</button></p>`);
    }
    choisirOnglet(cible, true);
    ov.scrollTop = 0;
  }

  showCarnet = function () { ouvrir("carnet"); };

  function choisirOnglet(cible, focus) {
    onglet = cible;
    const boîte = ov.querySelector(".carnet-joueur");
    for (const id of Object.keys(onglets)) {
      const tab = boîte.querySelector(`#tab-${id}`);
      tab.setAttribute("aria-selected", String(cible === id));
      tab.tabIndex = cible === id ? 0 : -1;
      boîte.querySelector(`#onglet-${id}`).hidden = cible !== id;
      if (focus && cible === id) tab.focus({ preventScroll: true });
    }
    if (cible === "carte") afficherCarte();
    if (cible === "inventaire") afficherInventaire();
    if (cible === "collections") afficherCollections();
  }

  const fonds = {
    clos: { nom: "Le clos des murailles", x: -157, z: -32, w: 190, h: 61 },
    atlas: { nom: "Sarlande", x: 100, z: 374, w: 440, h: 122 },
    place: { nom: "La grande place", x: -42, z: -49, w: 110, h: 82 }
  };

  function chemin(points) {
    return `<polyline points="${points.map(q => q.slice(0, 2).join(",")).join(" ")}" />`;
  }

  function fondCarte(région) {
    if (région === "atlas") {
      const voies = [...Object.values(Atlas.CHEMINS), ...Object.values(Atlas.RUELLES)];
      return `<g class="carte-eau">${chemin(Atlas.BRAS_OCCIDENTAL)}</g><g class="carte-voies">${voies.map(chemin).join("")}</g>
        <g class="carte-bati">${Object.values(Atlas.SITES).filter(s => s.surface === "roof" || s.surface === "church")
          .map(s => `<polygon points="${s.polygone.map(q => q.join(",")).join(" ")}"/>`).join("")}</g>`;
    }
    if (région === "clos") return `<rect class="carte-terre" x="-37" y="-29" width="66" height="52"/>
      <path class="carte-voies" d="M-150 0H-4"/><path class="carte-eau" d="M-38 26H30"/>
      <rect class="carte-bati" x="-4" y="-3" width="8" height="6"/>`;
    return `<path class="carte-eau" d="M-44 25 Q-4 21 24 25T68 24"/>
      <path class="carte-voies" d="M0 -18V18M-23 7H53M29 -3H54"/>
      <path class="carte-bati" d="M-32 -17H-23V17H-32ZM23 -17H31V-6H23ZM23 2H31V17H23ZM-31 -18H31V-21H-31ZM31 -12H55V-9H31Z"/>`;
  }

  function appliquerVue() {
    const svg = ov.querySelector(".carte-plan");
    svg?.setAttribute("viewBox", `${vue.x} ${vue.z} ${vue.w} ${vue.h}`);
    if (svg) {
      svg.style.setProperty("--carte-marqueur", vue.w / 105);
      svg.querySelector(".carte-joueur").setAttribute("transform", `scale(${vue.w / 105})`);
    }
  }

  function afficherCarte() {
    const région = zoneCarte(), pos = coordonnée(player.position, région), points = lieuxConnus(région, pos);
    const fond = fonds[région];
    if (!vue || vue.région !== région) vue = { ...fond, région };
    const but = cibleNative();
    const destination = but && coordonnée(but, région);
    const suivi = suiviLocal();
    const repèreLocal = état().repères[région];
    const pin = Array.isArray(repèreLocal) && repèreLocal.length === 2 && repèreLocal.every(Number.isFinite) ? repèreLocal : null;
    const sélection = points.find(p => p.id === repère);
    const heures = sélection && Object.entries(Vie.V().adresses || {}).filter(([id]) => {
      const lieu = Monde.BOUTIQUES[id]?.lieu;
      return lieu === (sélection.id === "maelle" ? "fournil" : sélection.id);
    });
    const page = ov.querySelector("#onglet-carte");
    page.innerHTML = `
      <div class="carte-entete"><h3>${fond.nom}</h3><span>↑ Nord</span></div>
      <div class="carte-outils">
        <button type="button" data-interface="zoom-in" aria-label="Agrandir la carte">+</button>
        <button type="button" data-interface="zoom-out" aria-label="Réduire la carte">−</button>
        <button type="button" data-interface="recentrer">Recentrer</button>
        <button type="button" data-interface="placer-repère" aria-pressed="false">Poser un repère</button>
        ${pin ? '<button type="button" data-interface="effacer-repère">Effacer le repère</button>' : ""}
      </div>
      <svg class="carte-plan" role="img" aria-label="Carte de ${fond.nom}. Faites glisser pour l’explorer.">
        ${fondCarte(région)}
        ${points.map(p => `<circle class="carte-lieu" data-lieu="${p.id}" cx="${p.pos[0]}" cy="${p.pos[1]}"><title>${esc(p.nom)}</title></circle>`).join("")}
        ${destination ? `<circle class="carte-but" cx="${destination[0]}" cy="${destination[1]}"><title>Objectif en cours</title></circle>` : ""}
        ${suivi ? `<circle class="carte-suivi" cx="${suivi.pos[0]}" cy="${suivi.pos[1]}"><title>Repère suivi</title></circle>` : ""}
        ${pin ? `<circle class="carte-repere" cx="${pin[0]}" cy="${pin[1]}"><title>Repère personnel</title></circle>` : ""}
        <g transform="translate(${pos.join(" ")}) rotate(${180 - player.rotation.y * 180 / Math.PI})">
          <path class="carte-joueur" transform="scale(${vue.w / 105})" d="M0 -1.8L1.25 1.45 0 .8 -1.25 1.45Z"><title>Aliénor</title></path></g>
      </svg>
      <p class="carte-legende" role="status">Flèche claire · Aliénor. Cercle doré · objectif. ${pin ? "Point bleu · repère personnel." : ""}</p>
      ${points.length ? `<div class="carte-lieux" aria-label="Lieux repérés">${points.map(p => `<button type="button" aria-pressed="${p.id === repère}" data-lieu="${p.id}">${esc(p.nom)}</button>`).join("")}</div>` : ""}
      ${sélection ? `<aside class="carnet-fiche"><h4>${esc(sélection.nom)}</h4>
        ${heures.map(([id, texte]) => `<p>${esc(Monde.BOUTIQUES[id].nom)} · ${esc(texte)}</p>`).join("")}
        <button type="button" class="sec" data-interface="suivre-lieu">Suivre ce lieu</button></aside>` : ""}`;
    appliquerVue();
    installerGlisser(page.querySelector(".carte-plan"));
  }

  function installerGlisser(svg) {
    let début = null;
    svg.addEventListener("pointerdown", e => {
      if (début || e.button !== 0) return;
      début = { id: e.pointerId, x: e.clientX, y: e.clientY, vx: vue.x, vz: vue.z, cible: e.target.closest("[data-lieu]")?.dataset.lieu, bougé: false };
      svg.setPointerCapture(e.pointerId);
    });
    svg.addEventListener("pointermove", e => {
      if (début?.id !== e.pointerId || Math.hypot(e.clientX - début.x, e.clientY - début.y) < 4 && !début.bougé) return;
      début.bougé = true;
      const échelle = svg.getScreenCTM().a;
      vue.x = début.vx - (e.clientX - début.x) / échelle;
      vue.z = début.vz - (e.clientY - début.y) / échelle;
      appliquerVue();
    });
    svg.addEventListener("pointerup", e => {
      if (début?.id !== e.pointerId) return;
      const action = ov.querySelector("[data-interface=placer-repère]");
      if (!début.bougé && action.getAttribute("aria-pressed") === "true") {
        const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM().inverse());
        const { x, z, w, h } = fonds[vue.région];
        if (p.x >= x && p.x <= x+w && p.y >= z && p.y <= z+h) {
          état().repères[vue.région] = [p.x, p.y];
          save();
        }
        afficherCarte();
      } else if (!début.bougé && début.cible) {
        repère = début.cible;
        afficherCarte();
      }
      début = null;
    });
    svg.addEventListener("pointercancel", e => { if (début?.id === e.pointerId) début = null; });
  }

  function interactionObjet(cat) {
    if (!Vie.enClos()) return null;
    const labels = {
      matériaux: ["Aménager et fabriquer", "Le jardin"], récoltes: ["Le jardin", "Préparer un repas"],
      mobilier: ["Aménager et fabriquer", "Le jardin"], tenues: ["Le miroir"], provisions: ["Préparer un repas"]
    }[cat] || [];
    return INTER.find(action => {
      if (!labels.includes(action.label) || action.can && !action.can()) return false;
      const p = action.p();
      return p && Math.hypot(p.x - player.position.x, p.z - player.position.z) <= action.r;
    });
  }

  function afficherInventaire() {
    const v = Vie.V();
    const lignes = Object.entries(v.inventaire).filter(([, n]) => n > 0).map(([id, n]) => {
      const article = Monde.ARTICLES[id];
      const valeurs = objets[id] || (id.startsWith("robe_") ? [id.replace("_", " "), "tenues", "À essayer devant le miroir de la maison."]
        : article ? [article.nom, "provisions", article.feu ? "À préparer à l’âtre pour le repas." : "Provisions pour le repas."]
        : [id.replace(/_/g, " "), "récit", "Objet conservé par Aliénor."]);
      return { id, n, nom: valeurs[0], cat: valeurs[1], note: valeurs[2] };
    });
    const réserve = v.amenagement?.reserve || [];
    for (const id of new Set(réserve)) lignes.push({
      id: "mobilier:" + id, n: réserve.filter(x => x === id).length, nom: id, cat: "mobilier",
      note: "Disponible dans la réserve. Choisissez une case dans le menu d’aménagement pour le poser."
    });
    const sélection = lignes.find(l => l.id === détail && (catégorie === "tout" || l.cat === catégorie));
    const action = sélection && interactionObjet(sélection.cat);
    ov.querySelector("#onglet-inventaire").innerHTML = `
      <div class="carte-entete"><h3>Inventaire</h3><strong>${esc(v.bourse)} sous</strong></div>
      <label class="inventaire-filtre">Catégorie <select id="inv-catégorie"><option value="tout">Tout</option>
        ${Object.entries(catégories).map(([id, nom]) => `<option value="${id}" ${id === catégorie ? "selected" : ""}>${nom}</option>`).join("")}</select></label>
      <div class="carnet-grille">${lignes.filter(l => catégorie === "tout" || l.cat === catégorie).map(l => `
        <button type="button" data-objet="${esc(l.id)}" aria-pressed="${l.id === détail}"><span>${esc(l.nom)}</span><span>×${l.n}</span></button>`).join("")}</div>
      ${!lignes.some(l => catégorie === "tout" || l.cat === catégorie) ? "<p>Aucun objet dans cette catégorie.</p>" : ""}
      ${sélection ? `<aside class="carnet-fiche"><h4>${esc(sélection.nom)}</h4><p>${esc(sélection.note)}</p>
        ${action ? `<button type="button" class="sec" data-interface="usage-objet" data-cat="${sélection.cat}">${esc(action.label)}</button>` : ""}</aside>` : ""}`;
  }

  function afficherCollections() {
    const j = état(), v = Vie.V();
    const groupes = [
      ["Feuillets", S.f.filter(id => FEU[id]).map(id => [id, "Feuillet " + id.slice(1), FEU[id].cit])],
      ["Personnages", [...personnagesRencontrés(v).entries()].map(([id, { nom, lieu }]) => [
        "hab-" + id, nom, Monde.LIEUX[lieu]?.nom || "Rencontré à Sarlande."
      ])],
      ["Lieux", Object.keys(j.lieux).filter(id => lieux[id]).map(id => ["lieu-" + id, lieux[id][0]])],
      ["Tenues", [...new Set([v.tenue, ...Object.keys(v.inventaire).filter(id => id.startsWith("robe_")).map(id => id.slice(5))])].filter(Boolean).map(id => ["robe-" + id, "Robe " + id])],
      ["Planches", Object.keys(j.planches).filter(id => PLATES[id]?.dest).map(id => ["planche-" + id, PLATES[id].dest, "", planches[id]])]
    ];
    const sections = groupes.filter(([, lignes]) => lignes.length).map(([titre, lignes]) =>
      `<section><h4>${titre}</h4><div class="carnet-grille">${lignes.map(([id, nom, texte, image]) => `
        <details data-collection="${esc(id)}"><summary>${esc(nom)}${j.lus[id] ? "" : ' <span class="carnet-nouveau" aria-label="Nouveau">•</span>'}</summary>
          ${image ? `<img loading="lazy" src="img/lieux/${image}.webp" alt="${esc(nom)}">` : ""}
          ${texte ? `<p>${esc(texte)}</p>` : ""}</details>`).join("")}</div></section>`);
    ov.querySelector("#onglet-collections").innerHTML = "<h3>Collections</h3>" + (sections.join("") || "<p>Les découvertes apparaissent ici au fil du jeu.</p>");
  }

  function personnagesRencontrés(v) {
    const rencontrés = new Map(Object.entries(v.croises || {}).filter(([id]) => Monde.HABITANTS[id]).map(([id, { lieu }]) => [
      id, { lieu, nom: Monde.HABITANTS[id].nom }
    ]));
    for (const observation of Monde.observations?.(v) || []) {
      if (observation.nom && observation.hab) rencontrés.set(observation.hab, observation);
    }
    return rencontrés;
  }

  function siteRendezVous(lieu) {
    const id = { clos: "maison", imprimerie: "presse", fournil: "maelle", place: "fontaine", drapiers: "drapiers" }[lieu] || lieu;
    const région = zoneCarte();
    return lieuxConnus(région, coordonnée(player.position, région)).find(l => l.id === id);
  }

  const cibleNative = targetNow, nomNatif = targetName;
  function suiviLocal() {
    const suivi = Vie.V().interface?.suivi;
    if (!suivi || suivi.région !== zoneCarte()) return null;
    return listeLieux(suivi.région).find(l => l.id === suivi.id);
  }
  targetNow = function () {
    const lieu = (mode === "play" || mode === "panel") && suiviLocal();
    if (!lieu) return cibleNative();
    const [x, z] = lieu.pos;
    return Ville.enVille() ? Ville.versScene(x, z) : Vie.enClos() ? Vie.CL(x, z) : { x, z };
  };
  targetName = function () { return (mode === "play" && suiviLocal()?.nom) || nomNatif(); };

  ov.addEventListener("click", e => {
    if (!ov.querySelector(".carnet-joueur")) return;
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.onglet) return choisirOnglet(b.dataset.onglet);
    if (b.dataset.lieu) { repère = b.dataset.lieu; return afficherCarte(); }
    if (b.dataset.objet) {
      détail = b.dataset.objet;
      afficherInventaire();
      ov.querySelector("#onglet-inventaire [aria-pressed=true]")?.focus({ preventScroll: true });
      return;
    }
    const action = b.dataset.interface;
    if (!action) return;
    if (action === "usage-objet") {
      const usage = interactionObjet(b.dataset.cat);
      if (!usage) return;
      closePanel(); clearControls(); mode = "play"; usage.act();
      return;
    }
    if (action === "fermer") {
      if (reprise) {
        ov.className = reprise.classes; ov.replaceChildren(...reprise.contenu); ov.scrollTop = reprise.scroll; reprise = null; return;
      }
      if (S.bilanActe1) return showEnd();
      closePanel(); clearControls(); mode = "play"; refreshHud();
      retourFocus?.focus({ preventScroll:true });
      return;
    }
    if (action === "objectif" || action === "rdv-carte") {
      const région = zoneCarte(), fond = fonds[région];
      const site = action === "rdv-carte" && siteRendezVous(Monde.rendezVous?.(Vie.V())?.lieu);
      const cible = action === "objectif" && cibleNative();
      const pos = site ? site.pos : cible && coordonnée(cible, région);
      if (pos && pos[0] >= fond.x && pos[0] <= fond.x + fond.w && pos[1] >= fond.z && pos[1] <= fond.z + fond.h) {
        const w = fond.w * .65, h = fond.h * .65;
        vue = { région, x: pos[0] - w / 2, z: pos[1] - h / 2, w, h };
      }
      if (site) repère = site.id;
      return choisirOnglet("carte", true);
    }
    if (action === "suivre-lieu") {
      const région = zoneCarte();
      état().suivi = { id: repère, région }; save(); ouvrir("carnet"); return;
    }
    if (action === "retirer-suivi") { état().suivi = null; save(); return ouvrir("carnet"); }
    if (action === "placer-repère") {
      const actif = b.getAttribute("aria-pressed") !== "true";
      b.setAttribute("aria-pressed", String(actif));
      ov.querySelector(".carte-legende").textContent = actif ? "Touchez la carte pour placer votre repère." : "Flèche claire · Aliénor. Cercle doré · objectif.";
      return;
    }
    if (action === "effacer-repère") { delete état().repères[zoneCarte()]; save(); return afficherCarte(); }
    const fond = fonds[zoneCarte()];
    if (action === "recentrer") {
      const [x,z] = coordonnée(player.position, zoneCarte());
      vue.x = x - vue.w / 2; vue.z = z - vue.h / 2;
    } else if (action === "zoom-in" || action === "zoom-out") {
      const facteur = action === "zoom-in" ? .7 : 1 / .7;
      const w = Math.max(fond.w / 6, Math.min(fond.w * 2, vue.w * facteur)), h = vue.h * w / vue.w;
      vue.x += (vue.w - w) / 2; vue.z += (vue.h - h) / 2; vue.w = w; vue.h = h;
    }
    appliquerVue();
  });

  ov.addEventListener("change", e => {
    if (e.target.id === "inv-catégorie") { catégorie = e.target.value; détail = ""; afficherInventaire(); ov.querySelector("#inv-catégorie").focus({ preventScroll:true }); }
  });
  ov.addEventListener("toggle", e => {
    const id = e.target.dataset?.collection;
    if (!id || !e.target.open || état().lus[id]) return;
    état().lus[id] = true; e.target.querySelector(".carnet-nouveau")?.remove(); save();
  }, true);
  ov.addEventListener("keydown", e => {
    if (!e.target.matches("[role=tab]")) return;
    const ids = Object.keys(onglets), n = ids.indexOf(onglet);
    const i = e.key === "ArrowLeft" ? (n+3)%4 : e.key === "ArrowRight" ? (n+1)%4 : e.key === "Home" ? 0 : e.key === "End" ? 3 : -1;
    if (i < 0) return;
    e.preventDefault(); choisirOnglet(ids[i], true);
  });
  window.addEventListener("keydown", e => {
    if (e.key === "Escape" && ov.querySelector(".carnet-joueur")) {
      e.preventDefault(); ov.querySelector("[data-interface=fermer]").click();
    }
    if (mode !== "play" || e.ctrlKey || e.altKey || e.metaKey || e.repeat || e.target.matches?.("input,textarea,select") || e.target.isContentEditable) return;
    const cible = { m: "carte", i: "inventaire", j: "carnet" }[e.key.toLowerCase()];
    if (cible) { e.preventDefault(); ouvrir(cible); }
  });
})();
