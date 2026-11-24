# Le matin du tribut · chapitre pilote

*Le Contr’un* · suivi de développement · étapes 1 et 2 · 24 novembre 2026

## Base retenue

- Branche de départ : `claude/alienor-3d-redesign-i2pqqg` (commit `c1f3591`), qui contient le jeu jouable des actes I et II (`index.html`, Three.js r128 local dans `vendor/`) et toutes les planches validées (repère des illustrations : `f5be202`).
- Branche de travail : `claude/le-matin-du-tribut-91croe`, avancée en avance rapide sur cette base, sans perte.
- Point d’entrée : `index.html` (une seule page, sans compilation).

## Ce que l’étape 1 change dans le jeu

- **La rue de l’Imprimerie** part du côté ouest de la place, dans l’axe de la fontaine. Neuf maisons, pavés serrés, caniveau, bornes, linge tendu.
- **L’imprimerie** d’Anselme y est déplacée, d’après `lieu_facade_imprimerie.png` : rez-de-chaussée en pierre, grande porte ouverte, fenêtre au plomb, étage à colombages en encorbellement, trois lucarnes, vigne, pots, banc de papiers, lanterne, feuilles qui sèchent. L’enseigne en livre ouvert pend d’une potence de fer et se balance.
- **L’atelier est une pièce praticable**, d’après `lieu_atelier.png` : presse à bras, casses, tablette de composition, table aux balles d’encre, rames de papier, cordes de feuilles fraîches, lumière chaude.
- **Caméra à la troisième personne** derrière Aliénor pendant tout l’acte I (et dans la rue à l’acte II). Elle se rapproche au lieu de traverser un mur ou un plafond.
- **Commandes** : moitié gauche de l’écran, joystick ; moitié droite, glisser pour regarder. Clavier : flèches ou ZQSD, Maj pour marcher lentement, Espace ou E pour parler. La marche accélère et ralentit ; un demi-tour se fait sur place avant de repartir ; la caméra revient d’elle-même derrière Aliénor.
- **Nouvelle partie** : elle s’ouvre sur la cinématique de l’étape 2 (voir plus bas).
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

## Étape 2 · le chapitre

Les répliques, les choix et les effets sur la progression sont ceux du jeu (acte I, étapes 0 et 1, et découpage B-1). Les plans muets montrent ce que disent les répliques ; chacun se passe avec « Passer la scène ».

| Moment | Ce qu’on voit et entend |
|---|---|
| Ouverture (9 s) | La rue au petit matin et l’enseigne, titre « Sarlande · Le matin du tribut », tambour sur la place ; la presse et le papier ; Anselme qui tient le sac |
| Remise du sac | Après « Porte ce sac au percepteur », Anselme le tend, Aliénor le prend à deux mains, il passe à son épaule |
| La page cousue | Après « J’ai cousu quelque chose dans la doublure », Anselme montre le sac, elle baisse les yeux ; feuillet F1 |
| Le seuil | Aliénor sort de l’atelier, la caméra passe derrière elle ; le joueur reprend la main face à la rue et à la fontaine |
| La pesée | Le sac est posé sur le plateau de la balance ; le fléau remonte et s’arrête trop tôt ; le percepteur se penche. « Il manque une mesure. » |
| Payer | La main va à la bourse (qui reste plus légère), les pièces tombent sur la table, le fléau s’équilibre ; « Suivant. » : il détourne la tête et fait signe, le suivant de la file s’avance et attend à la table |
| Dénoncer Garin | « Gardes, qu’on me ramène le tanneur » : le garde de droite quitte son poste, va chercher Garin et le ramène à la table, puis chacun reprend sa place ; la plume raye la dette |
| Demander à quoi sert le tribut | La plume écrit le nom d’Aliénor en grand ; les deux gardes se tournent vers elle et la suivent des yeux tant qu’elle est sur la place |
| Raccord | « Près de son étal, Maëlle vous fait signe » : plan sur Maëlle qui agite le bras ; elle continue jusqu’à ce qu’on lui parle (suite existante, feuillet F2) |

**Sauvegarde** : le choix (`flags.tribut`), le stade, la confiance et le regard de Bastien sont enregistrés comme avant. À la reprise, la bourse, les pièces, le suivant à la table et les gardes qui regardent Aliénor reviennent selon le choix.

## Accueil, interface, carnet (choix de Lucas du 24 novembre)

- Accueil : « Reprendre » avec repère (« Acte I · La coutume · vers Maëlle · 1 feuillet sur 8 »), « Réglages », bouton de la pierre retiré.
- Réglages : affichage normal ou allégé, son, taille du texte (trois tailles), joystick à gauche ou à droite.
- Dialogues en plan taille à deux personnages ; destination marquée par un halo d’encre au sol ; aide aux commandes en grand au début, effacée après une vingtaine de secondes de marche.
- Carnet : plus de case de note ; chaque feuillet garde l’image du moment où on l’a trouvé.
- Emblème de l’Un (disque solaire couronné) à la place de la fleur de lys : accueil, planches de citation, robe du colosse, bannières du palais et de la cour.

## Tests faits (étape 2)

Ordinateur, Chromium sans carte graphique, iPad émulé, depuis une nouvelle partie (sauvegarde effacée), script `etape2.js` :

| Branche | Atelier (sac, F1, seuil) | Pesée et conséquence | État à l’écran | Reprise après rechargement |
|---|---|---|---|---|
| Payer | réussi | réussi | bourse à 55 %, pièces, suivant à la table, fléau à l’équilibre, Maëlle fait signe | réussi |
| Dénoncer | réussi | réussi | garde et Garin en marche vers la table, Bastien : confiance −1 | réussi |
| Demander | réussi | réussi | gardes tournés vers Aliénor, Bastien l’a vue | réussi |

Aucune erreur JavaScript. La fluidité reste à mesurer sur iPad avec `?mesure`.

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

- Les gestes des bras (remise, pesée, plume) sont posés à la main ; ils gagneront à être animés d’après l’étude de mouvement d’Aliénor.
- Les portes sculptées du palais portent encore des fleurs de lys peintes dans la texture (commande d’image à faire).
- Les pots de fleurs, la vigne et les fleurs restent schématiques ; le carrelage est carré, la planche montre des tomettes hexagonales.
- Les visages d’Anselme et des passants sont ceux de la version actuelle.

## Ressources externes

- L’essai visuel `https://sarlande-essai-imprimerie.luma0823.chatgpt.site` n’est pas joignable depuis l’environnement de développement : la politique réseau refuse l’hôte. Ni ses sources ni le modèle animé d’Aliénor ne figurent dans le dépôt.
