# Le matin du tribut · chapitre pilote

*Le Contr’un* · suivi de développement · étape 1 (déplacement et rendu) · 24 novembre 2026

## Base retenue

- Branche de départ : `claude/alienor-3d-redesign-i2pqqg` (commit `c1f3591`), qui contient le jeu jouable des actes I et II (`index.html`, Three.js r128 local dans `vendor/`) et toutes les planches validées (repère des illustrations : `f5be202`).
- Branche de travail : `claude/le-matin-du-tribut-91croe`, avancée en avance rapide sur cette base, sans perte.
- Point d’entrée : `index.html` (une seule page, sans compilation).

## Ce que l’étape 1 change dans le jeu

- **La rue de l’Imprimerie** part du côté ouest de la place, dans l’axe de la fontaine. Neuf maisons, pavés serrés, caniveau, bornes, linge tendu.
- **L’imprimerie** d’Anselme y est déplacée, d’après `lieu_facade_imprimerie.png` : rez-de-chaussée en pierre, grande porte ouverte, fenêtre au plomb, étage à colombages en encorbellement, trois lucarnes, vigne, pots, banc de papiers, lanterne, feuilles qui sèchent. L’enseigne en livre ouvert pend d’une potence de fer et se balance.
- **L’atelier est une pièce praticable**, d’après `lieu_atelier.png` : presse à bras, casses, tablette de composition, table aux balles d’encre, rames de papier, cordes de feuilles fraîches, lumière chaude.
- **Caméra à la troisième personne** derrière Aliénor dans l’atelier, la rue, et sur la place tant que dure le pilote (stades 0 à 2 de l’acte I). Elle se rapproche au lieu de traverser un mur ou un plafond. Ailleurs, la caméra haute de l’acte I est conservée (infiltration de la cour des gardes).
- **Commandes** : moitié gauche de l’écran, joystick ; moitié droite, glisser pour regarder. Clavier : flèches ou ZQSD, Maj pour marcher lentement, Espace ou E pour parler. La marche accélère et ralentit ; un demi-tour se fait sur place avant de repartir ; la caméra revient d’elle-même derrière Aliénor.
- **Nouvelle partie** : Aliénor commence dans l’atelier, face à Anselme. L’ancienne cinématique d’ouverture filmait l’atelier sur la place ; elle n’est plus jouée et sera remplacée à l’étape 2.
- **Raccords** : Anselme, l’arrivée de l’acte II pendant le grand toast (`ATELIER`) et la place de Garin et Maëlle à l’imprimerie suivent le nouvel emplacement. Les anciennes sauvegardes se reprennent.
- **Mesure** : ajouter `?mesure` à l’adresse affiche les images par seconde, la pire image des cinq dernières secondes et le nombre d’images trop lentes.

## Place et cour des gardes (demande du 24 novembre)

- **La place** : anneau de dalles autour de la fontaine, chaussées vers la porte du palais, la rue de l’Imprimerie et le quai ; trois marches devant la porte ; oriflammes rouges de part et d’autre de l’approche.
- **Le poste du percepteur** : dais rouge à lambrequins, table de chêne sur tréteaux drapée d’indigo à franges, registre ouvert, encrier et plume, piles de pièces, coffre ferré, sacs. **Balance de laiton** d’après `objet_balance.png`, construite à part (`tribScale`) pour pencher à l’étape 2.
- **La file du tribut** passe entre deux rangées de poteaux et de cordes ; les porteurs tiennent la sangle de leur sac au lieu de lever le bras.
- **Le marché de l’ouest** : deux étals rayés, paniers de fruits, sacs, charrette à foin.
- **Les gardes**, d’après `bastien_tour.png` : morion à bord et crête, grande plume rouge, cuirasse et baudriers, manches et chausses bouffantes, épée, hallebarde d’après `objet_hallebarde.png`.
- **La cour des gardes** : sol de dalles grises, caisses cerclées, râtelier de hallebardes, table de jeu, abreuvoir, bottes de foin, braséro, bannières rouges sous l’arcade. Les cônes de vision sont un lavis rouge dont le pigment s’accumule au bord : la limite reste nette.
- **Caméra** : toute l’acte I passe à la caméra derrière Aliénor, plus haute et plus reculée dans la cour pour lire les cônes. L’acte II garde sa caméra. La caméra ne se coince plus contre Aliénor dans la cour.

## Monde ouvert

- La planche qui s’ouvrait à la première entrée dans la cour des gardes est supprimée : on passe de l’atelier à la rue, à la place, au quai et à la cour sans tourner la page.
- À chaque changement de lieu, son nom s’inscrit un instant en bas de l’écran (« La rue de l’Imprimerie », « La cour des gardes »…).
- Deux planches restent, parce qu’elles marquent un saut dans le temps et portent des citations : avant la chute de la pierre (« Le château ») et au passage à l’acte II (« La fête de l’Un »). Le livre des planches reste consultable depuis la page de titre.

## Tests faits (étape 1)

Essais sur ordinateur, Chromium sans carte graphique (rendu logiciel), écran d’iPad émulé (1080 × 810) et toucher émulé par le protocole du navigateur :

| Essai | Résultat |
|---|---|
| Nouvelle partie : départ dans l’atelier, dialogue d’Anselme, page cousue (F1), passage au stade 1 | réussi |
| Au doigt : atelier → seuil → milieu de la rue → fontaine | réussi, environ 12 s de marche |
| S’arrêter, se retourner (joystick vers soi), caméra revenue derrière Aliénor, enseigne à l’écran | réussi |
| Retour devant l’imprimerie, puis dans l’atelier | réussi |
| Caméra jamais dans un mur pendant tout le parcours | réussi |
| Ancienne sauvegarde (acte I, stade 5) : reprise, objectif, dialogue d’Anselme | réussi |
| Acte II, stade 13 : arrivée à l’imprimerie pendant le grand toast | réussi |
| Erreurs JavaScript | aucune |

**Non mesuré ici** : la fluidité. Le conteneur n’a pas de carte graphique (environ 1 image par seconde en rendu logiciel). Le test sur iPad reste à faire avec `?mesure`.

## Encore provisoire

- L’ouverture : remise du sac, presse, tambour, caméra qui passe derrière Aliénor (étape 2).
- Le cadrage de la scène de la manche dans l’atelier, qui reprend l’ancien plan.
- La file, la pesée et les trois conséquences sur la place (étape 2).
- Les pots de fleurs, la vigne et les fleurs restent schématiques ; le carrelage est carré, la planche montre des tomettes hexagonales.
- Les visages d’Anselme et des passants sont ceux de la version actuelle.

## Ressources externes

- L’essai visuel `https://sarlande-essai-imprimerie.luma0823.chatgpt.site` n’est pas joignable depuis l’environnement de développement : la politique réseau refuse l’hôte. Ni ses sources ni le modèle animé d’Aliénor ne figurent dans le dépôt.
