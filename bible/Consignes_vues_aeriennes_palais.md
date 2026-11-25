# Sarlande vue du ciel, et le palais de l’Un

*Le Contr’un* · document de travail · version 1.0 du 25 novembre 2026

Ce document a deux buts :
1. **Zoner la ville** : fixer une fois pour toutes où se trouve chaque lieu, puis en tirer des vues aériennes qui se ressemblent d’une image à l’autre.
2. **Concevoir le palais pour de bon**, avec les blocs qui l’entourent. Le 25 novembre, le palais du jeu a été reconstruit d’après la fiche du palais (6.4) : front et balcon, cour d’honneur, deux pavillons, grand logis, donjon, cuisines, quatre tours d’angle, côtés nus, jardins et rempart. Les images du lot P serviront à l’affiner et à le peindre.

Il y a **55 images**, en codes **V** (la ville vue du ciel) et **P** (le palais et ses abords).

---

## 1. La méthode : une seule ville, dessinée une seule fois

ChatGPT invente un peu à chaque image. Pour que les vues restent cohérentes, on procède **du plan vers les vues**, jamais l’inverse :

1. **Les calques du jeu.** Le dossier `references/vues-aeriennes/` contient des captures de la ville telle qu’elle existe dans le jeu, vue du ciel et sous plusieurs angles (`calque_*.jpg`). Elles fixent ce qui est déjà construit : la place, le palais, le quai, la cour des gardes.
2. **Le plan directeur** (V1, V2). ChatGPT redessine le calque en plan aquarellé, puis l’étend à toute la cité. **Lucas le valide.** À partir de là, c’est la référence de toutes les autres images.
3. **La fiche d’identité** (partie 3). C’est un texte qui décrit la ville de façon fixe. On le colle dans chaque conversation, avec le plan directeur.
4. **Les vues**. Chaque vue joint **le plan directeur, la fiche d’identité, le calque le plus proche, et la dernière vue validée**. ChatGPT n’a jamais à deviner.
5. **Le contrôle**. Pour chaque vue, vérifier la liste des repères (partie 4) : s’il en manque un ou s’il a bougé, faire corriger dans la même conversation : « Garde exactement l’image, mais la rivière doit couler au sud, de gauche à droite, et le palais doit être au nord. »

**Toujours** :
- le nord en haut sur les plans ;
- la même heure pour toutes les vues de référence : **le matin du tribut, soleil venu de l’est** (de la droite sur les plans), ombres indigo vers l’ouest ;
- une conversation pour la ville (V), une autre pour le palais (P). Ne pas mélanger.

---

## 2. Le bloc STYLE pour les vues aériennes · à coller en premier

> Pour toute cette conversation, tu dessines la même cité imaginaire, Sarlande, ville de la Renaissance française vers 1550, inspirée de Sarlat en Périgord, vue du ciel. Le plan directeur et la fiche d’identité que je te donne font foi : ne déplace jamais un bâtiment, une rue, la rivière ou la place. Garde exactement les mêmes formes, les mêmes couleurs de toits et les mêmes proportions d’une image à l’autre.
> **Style** : vue à vol d’oiseau à l’encre de Chine fine et au lavis d’aquarelle sur papier ivoire au grain visible, à la manière des plans de villes de la Renaissance, mais avec la palette des images jointes. Traits fins, lavis transparents, ombres indigo, jamais grises ni noires.
> **Toits** : tuiles brun-orangé et lauzes pour les maisons, ardoise bleue pour le palais et les tours. **Murs** : pierre blonde et ocre, colombages sombres.
> **Règles fixes** : aucun texte, aucun nom de rue, aucun chiffre, aucune légende, aucune rose des vents, aucun cadre, aucune signature. L’emblème de l’Un est un disque d’or sur trois degrés ; jamais de fleur de lys pour le pouvoir de l’Un.
> Attends ma consigne.

---

## 3. La fiche d’identité de Sarlande · à coller dans chaque conversation

Les points marqués **[jeu]** existent déjà dans le jeu et ne bougent plus. Les points marqués **[à valider]** sont des propositions : Lucas les confirme ou les change **avant** de lancer V2.

> **Sarlande, fiche d’identité**
> - **[jeu] La rivière** coule d’ouest en est, au sud de la ville. Sur la rive nord, un **quai** pavé avec des barques amarrées. Sur la rive sud, une rangée de maisons aux toits orange et des arbres.
> - **[jeu] La place du marché** est au centre, juste au nord du quai : un grand rectangle pavé, plus large que profond (environ 60 pas d’est en ouest, 40 du nord au sud). Au milieu, un peu au sud, une **fontaine** ronde. Quatre étals à auvents rayés.
> - **[jeu] Le palais de l’Un** ferme tout le côté nord de la place. Son front est un **mur crénelé de pierre blonde** ; au milieu, un **portail entre deux tours rondes** coiffées d’ardoise bleue, avec l’estrade du percepteur sous un dais rouge. Derrière le portail, la **cour d’honneur** ; au centre de la cour, sur un haut socle, le **colosse**, statue géante de l’Un, couronnée, une main tendue tenant une sphère, l’épée au côté, plus haute que tous les toits : on la voit de partout. De part et d’autre de la cour, **deux pavillons Renaissance** de pierre ocre sculptée, à toits d’ardoise bleue en pavillon.
> - **[jeu] À l’ouest de la place** : des maisons à colombages serrées, et, au bout, **l’imprimerie de maître Anselme**, avec son enseigne en livre ouvert. La rue de l’imprimerie part de l’angle nord-ouest de la place.
> - **[jeu] À l’est de la place** : des maisons, puis la **poterne**, une porte basse dans un mur, qui ouvre sur la **cour des gardes** : une longue cour rectangulaire, des arcades au nord, des caisses et des tonneaux ; au fond, à l’est, une **petite chapelle** à rosace.
> - **[jeu, en volume simple ; à valider] La cathédrale** : au nord-est, derrière la cour des gardes, sur une petite place à elle, avec son clocher-porche roman et sa coupole en lanterne. Son clocher est le deuxième repère de la ville, après le colosse.
> - **[à valider] Le pont et le lavoir** : un pont de pierre à trois arches franchit la rivière à l’ouest du quai ; le lavoir est sous la première arche.
> - **[à valider] La rue des Tanneurs** : à l’ouest, le long d’un bras de la rivière qui se détache vers le nord ; maisons à galeries de bois où sèchent les peaux.
> - **[à valider] Les quartiers populaires** : au sud-ouest et sur la rive sud, maisons de bois plus pauvres et penchées, cours communes.
> - **[à valider] Les beaux quartiers** : au nord-ouest, à l’ouest du palais, des hôtels de notables en pierre ; l’hôtel du percepteur est le plus proche du palais.
> - **[à valider] Les remparts** : la ville est ceinte d’un rempart ovale à tours rondes. **Deux portes** : la porte du pont au sud, la porte de la forêt au nord-ouest. Au nord, au-delà du palais, les jardins de l’Un s’appuient au rempart.
> - **[à valider] Hors les murs** : au nord, des collines boisées et la forêt ; au sud, au-delà de la rivière, des champs, des vignes et une route.

---

## 4. Les repères à vérifier sur chaque vue

Ces sept repères doivent être visibles et à leur place sur toute vue d’ensemble :
1. la rivière, au sud ;
2. la place et sa fontaine, au centre ;
3. le front crénelé du palais, au nord de la place, et son portail à deux tours ;
4. le colosse, dans la cour du palais, plus haut que tout ;
5. les deux pavillons Renaissance de part et d’autre du colosse ;
6. la cour des gardes et sa chapelle, à l’est ;
7. la rue de l’imprimerie, à l’ouest.

Une fois validés : 8. le clocher de la cathédrale ; 9. le pont ; 10. les remparts et leurs deux portes.

---

## 5. Lot V · La ville vue du ciel

Les gabarits G1 à G8 sont ceux de `Consignes_images_vie.md`, partie 3. **Joindre à chaque fois** : le plan directeur validé (V2, dès qu’il existe) et la dernière vue validée.

### Le plan directeur (à faire en premier, dans l’ordre)

| Fait | Code | Fichier | Gabarit | Joindre | Contenu |
|---|---|---|---|---|---|
| [ ] | V1 | `plan_zone_jouable.png` | G6 | `calque_plan_ville.jpg`, `calque_vue_sud.jpg` | [SUJET] = « exactement la disposition du calque joint, vu de dessus, redessinée proprement : la place et sa fontaine, le front du palais au nord avec son portail entre deux tours rondes, la cour d’honneur et le colosse, les deux pavillons, les maisons à l’ouest et à l’est, la poterne, la cour des gardes et la chapelle à l’est, le quai et la rivière au sud, les maisons de l’autre rive ; garde les positions et les proportions du calque au plus près » |
| [ ] | V2 | `plan_directeur.png` | G6 | V1 validé | [SUJET] = « toute la cité de Sarlande vue de dessus, ceinte de remparts ovales ; la zone de l’image jointe reste exactement au centre, à la même échelle relative ; autour, selon la fiche d’identité : la cathédrale, le pont et le lavoir, la rue des Tanneurs, les quartiers populaires, les beaux quartiers, les jardins de l’Un, les deux portes, et au-delà des murs les champs, les vignes et la lisière de la forêt » · **Lucas valide avant de continuer.** |
| [ ] | V3 | `plan_zones.png` | G6 | V2 validé | [SUJET] = « exactement le plan joint, sans rien déplacer, mais chaque quartier est teinté d’un lavis léger d’une couleur différente : le palais et ses abords en rouge sombre ; la place et le quai en ocre ; la rue de l’imprimerie et les quartiers d’artisans en terre de Sienne ; la cathédrale et son quartier en bleu pâle ; les beaux quartiers en vert sauge ; la rue des Tanneurs en brun ; les quartiers populaires en gris ; la cour des gardes en rouge orangé ; les jardins en vert ; les remparts soulignés d’un trait sombre » · Ce plan sert à zoner le jeu : Lucas y écrit lui-même les noms. |
| [ ] | V4 | `plan_rues.png` | G6 | V2 validé | [SUJET] = « exactement le plan joint, réduit à son réseau : les rues en blanc cassé, les îlots de maisons en ocre clair uni, les monuments en indigo, la rivière en bleu pétrole ; aucun détail de toit » · Sert à tracer les chemins et les rues jouables. |

### Les vues obliques d’ensemble (la même ville, de huit côtés)

Gabarit G2. Même [LUMIÈRE] pour toutes : « matin de fin d’été, soleil bas venu de l’est, ombres indigo longues vers l’ouest, brume légère sur la rivière ». [SCÈNE] = « vue à vol d’oiseau de toute la cité de Sarlande, exactement conforme au plan directeur joint, vue depuis [CÔTÉ], à environ 45 degrés de hauteur ; on voit [PREMIER PLAN] au premier plan et [FOND] au fond ».

| Fait | Code | Fichier | Joindre aussi | [CÔTÉ] · [PREMIER PLAN] · [FOND] |
|---|---|---|---|---|
| [ ] | V10 | `vue_sud.png` | `calque_vue_sud.jpg` | le sud, au-dessus de la rive sud · la rivière, le quai, la place · le palais, le colosse, les jardins, le rempart nord, la forêt |
| [ ] | V11 | `vue_sud_est.png` | `calque_vue_sud_est.jpg` | le sud-est · la rivière, la cour des gardes, la chapelle · la place, le palais, la rue de l’imprimerie, les beaux quartiers |
| [ ] | V12 | `vue_est.png` | `calque_vue_est.jpg` | l’est, au-dessus du rempart est · la cour des gardes, la cathédrale · la place, le palais, la rue des Tanneurs |
| [ ] | V13 | `vue_nord_est.png` | V10 et V12 validées | le nord-est, au-dessus de la forêt · les jardins de l’Un, la cathédrale · le palais de dos, la place, la rivière, la rive sud |
| [ ] | V14 | `vue_nord.png` | `calque_vue_nord.jpg` | le nord, au-dessus de la forêt · le rempart nord, les jardins, l’arrière du palais · le colosse vu de dos, la place, la rivière |
| [ ] | V15 | `vue_nord_ouest.png` | V14 validée | le nord-ouest · la porte de la forêt, les beaux quartiers · le palais, la place, la cour des gardes |
| [ ] | V16 | `vue_ouest.png` | `calque_vue_ouest.jpg` | l’ouest · la rue des Tanneurs, la rue de l’imprimerie · la place, le palais, la cour des gardes, la cathédrale |
| [ ] | V17 | `vue_sud_ouest.png` | `calque_vue_sud_ouest.jpg` | le sud-ouest · le pont, le lavoir, les quartiers populaires · la place, le palais, la cathédrale |

### Les vues particulières

| Fait | Code | Fichier | Gabarit | Contenu |
|---|---|---|---|---|
| [ ] | V20 | `vue_cavaliere.png` | G2 | [SCÈNE] = « vue cavalière de toute la cité, conforme au plan directeur, en perspective parallèle, sans point de fuite, comme une maquette vue de haut depuis le sud-est ; tous les toits, toutes les rues et tous les monuments lisibles » · [LUMIÈRE] = matin · Sert de référence pour la 3D. |
| [ ] | V21 | `vue_ancienne.png` | G2 | [SCÈNE] = « Sarlande à la manière d’une gravure de ville du XVIe siècle, vue à vol d’oiseau depuis le sud, avec une banderole vide dans le ciel, des personnages minuscules dans les champs du premier plan, et un cartouche orné vide en bas » · [LUMIÈRE] = matin · Pour l’écran-titre et la couverture du carnet. |
| [ ] | V22 | `vue_colline.png` | G2 | [SCÈNE] = « Sarlande vue de loin, depuis la colline boisée au nord, à hauteur d’homme, entre deux troncs : les remparts, les toits, le colosse qui dépasse tout, le clocher de la cathédrale, la rivière qui brille derrière » · [LUMIÈRE] = matin |
| [ ] | V23 | `vue_depuis_colosse.png` | G2 | [SCÈNE] = « la ville vue d’en haut, depuis l’épaule du colosse, en plongée vers le sud : la cour d’honneur, le portail, la place et la file du tribut minuscule, la fontaine, le quai, la rivière » · [LUMIÈRE] = matin |
| [ ] | V24 | `vue_depuis_clocher.png` | G2 | [SCÈNE] = « la ville vue depuis le haut du clocher de la cathédrale, vers le sud-ouest : la cour des gardes, le palais et son colosse de profil, la place, la rivière » · [LUMIÈRE] = matin |
| [ ] | V25 à V28 | `vue_sud_fete.png`, `vue_sud_nuit_hiver.png`, `vue_sud_printemps.png`, `vue_sud_aube.png` | G2 | **Exactement la vue V10 validée, même cadrage, rien ne bouge**, seule la lumière change : la nuit de la fête (place illuminée de lanternes, fumées, le reste de la ville sombre) ; une nuit d’hiver sous la neige ; un jour de printemps sous la pluie, rivière en crue ; l’aube rose après la fête. |

### Les quartiers vus de plus près

Gabarit G2, vue oblique à environ 40 degrés, même lumière du matin, **conforme au plan directeur**. Joindre V2 et la vue d’ensemble la plus proche.

| Fait | Code | Fichier | [SCÈNE] |
|---|---|---|---|
| [ ] | V30 | `quartier_place.png` | la place du marché, la fontaine, les étals, la file du tribut jusqu’à l’estrade sous le dais rouge, le front du palais |
| [ ] | V31 | `quartier_imprimerie.png` | la rue de l’imprimerie de bout en bout : l’imprimerie et sa cour arrière, les voisins, le passage couvert, l’ouverture sur la place |
| [ ] | V32 | `quartier_quai.png` | le quai, les barques, la grue, l’entrepôt, le pont à trois arches et le lavoir |
| [ ] | V33 | `quartier_gardes.png` | la poterne, la cour des gardes, ses arcades, la chapelle, et le revers du palais côté est |
| [ ] | V34 | `quartier_cathedrale.png` | la cathédrale, son parvis, son cloître, son petit cimetière et la lanterne des morts |
| [ ] | V35 | `quartier_tanneurs.png` | la rue des Tanneurs le long du bras de rivière, les galeries où sèchent les peaux, les cuves, la maison du chef de rue |
| [ ] | V36 | `quartier_populaire.png` | les quartiers populaires : ruelles en escalier, cours communes, puits, linge |
| [ ] | V37 | `quartier_notables.png` | les beaux quartiers : hôtels de pierre, jardins clos, et l’hôtel du percepteur adossé au palais |
| [ ] | V38 | `quartier_remparts.png` | une portion de rempart avec une porte de la cité, son pont, son corps de garde |

---

## 6. Lot P · Le palais de l’Un et les blocs qui l’entourent

### 6.1 Ce que le palais doit dire

Le palais est le cœur du *Discours* : c’est là que va tout ce que le peuple paie, et c’est de là que personne ne sort jamais pour se montrer. Il doit donc être **immense vu de la place, et vide vu de l’intérieur**. Quatre principes :
1. **Un front qui écrase** : vu de la place, le mur crénelé, le portail et le colosse ferment tout le ciel au nord.
2. **Une façade de théâtre** : tout le luxe est tourné vers la place (sculptures, dais, balcon, tentures). Les côtés et l’arrière sont nus, fermés, utilitaires.
3. **Des étages de pouvoir** : chaque partie du palais correspond à un échelon de la chaîne, du plus bas au plus haut, et à un acte du jeu.
4. **Un centre caché** : le logis de l’Un est au fond, derrière la cour, invisible de la place. On n’y voit jamais personne.

### 6.2 Le programme : les parties du palais

À faire valider par Lucas avant les images P. La colonne « Jeu » dit ce qui existe déjà.

| Partie | Où | À quoi elle sert dans l’histoire | Acte | Jeu |
|---|---|---|---|---|
| **Le front et le portail** | au sud, sur la place | le tribut, l’estrade du percepteur, les gardes de la porte | I | oui |
| **Le balcon** | au-dessus du portail, entre les deux tours | les pièces jetées et les toasts de la fête ; le rideau tiré | II | oui |
| **La cour d’honneur et le colosse** | derrière le portail | le colosse sur son socle ; la pierre qui tombe | I à V | oui |
| **Le pavillon ouest : la Chambre du tribut** | à l’ouest de la cour | les bureaux du percepteur, les registres, la salle des pesées | I, III | volume seul |
| **Le pavillon est : les archives** | à l’est de la cour | les registres anciens, la fiche de la mère d’Aliénor | III | volume seul |
| **Le grand logis de l’Un** | au nord de la cour, en fond | la galerie, la chambre surchauffée, le fauteuil de fourrures | III | volume, galerie, rideaux |
| **Les cuisines et les celliers** | au nord-ouest, côté service | les pains blancs et les tonneaux des largesses : on y voit arriver le tribut du matin | II | volume |
| **Le donjon et les oubliettes** | au nord-est, plus ancien que le reste | les prisonniers, les traits gravés, le mari de Margot | III | volume, soupirail |
| **Les tours d’enceinte** | aux quatre angles | le guet, les cônes de vision la nuit | III, IV | oui |
| **Les jardins de l’Un** | au nord, contre le rempart | des jardins clos que personne ne voit ; l’espalier | III, V | volume |
| **La chapelle palatine** | contre le logis | la messe privée de l’Un ; des vitraux à son emblème | III | à créer |

### 6.3 Les blocs qui entourent le palais

| Bloc | Où | Ce qu’on y trouve | Acte |
|---|---|---|---|
| **L’îlot du percepteur** | à l’ouest du palais | l’hôtel particulier du percepteur, cossu, adossé au palais, relié par une passerelle couverte ; ses écuries ; son jardin | III, IV |
| **Les hôtels des notables** | au nord-ouest | les maisons de pierre de ceux qui servent le palais : le sergent, le receveur, le maître des cuisines | IV |
| **La caserne et la cour des gardes** | à l’est du palais | la poterne, la cour, les arcades, la chapelle, l’armurerie, les écuries de la garde | I, III |
| **La rue de service** | au nord-ouest, entre l’îlot du percepteur et le palais | l’entrée des charrettes du tribut, la porte des cuisines : l’envers du décor | II, III |
| **Le chemin de ronde et le fossé** | au nord | le rempart, une poterne secrète, le fossé sec | III, V |

### 6.4 La fiche d’identité du palais · à coller dans chaque conversation du lot P

> **Le palais de l’Un, fiche d’identité**
> - Il occupe tout le nord de la place. Vu de dessus, c’est un grand rectangle plus large que profond, ouvert au sud par un portail.
> - **Le front sud** : un mur crénelé de pierre blonde, long comme toute la place ; au milieu, le portail en plein cintre entre deux tours rondes à toits coniques d’ardoise bleue ; au-dessus du portail, un balcon drapé de rouge à l’emblème de l’Un ; deux grandes tentures rouges à l’emblème pendent du mur, de part et d’autre ; devant le portail, l’estrade du percepteur sous un dais rouge.
> - **La cour d’honneur**, derrière : pavée, carrée ; au centre, le colosse sur un haut socle à degrés.
> - **Deux pavillons Renaissance** de part et d’autre de la cour, identiques : trois étages de pierre ocre richement sculptée, fenêtres à meneaux, toit d’ardoise bleue en pavillon avec trois lucarnes et deux cheminées.
> - **Le grand logis** au fond, au nord : plus haut que les pavillons, plus sévère, galerie à arcades au rez-de-chaussée sur la cour, fenêtres hautes aux rideaux tirés, haut toit d’ardoise.
> - **Quatre tours rondes d’angle**, plus hautes que les toits, à toits coniques d’ardoise.
> - **Les côtés et l’arrière** sont nus : murs de pierre grise, peu de fenêtres, petites portes de service.
> - **Le donjon** au nord-est : une vieille tour carrée médiévale, plus sombre, plus ancienne que tout le reste.
> - Matières : pierre blonde et ocre ; ardoise bleue ; or et rouge vif pour les signes du pouvoir seulement.

### 6.5 Les images du palais

**Joindre à chaque fois** : `calque_plan_palais.jpg`, `calque_palais_sud_est.jpg`, `calque_palais_face.jpg`, et, dès qu’elles existent, P1 et P2 validées.

#### Le plan et la vue de référence (à faire en premier)

| Fait | Code | Fichier | Gabarit | Contenu |
|---|---|---|---|---|
| [ ] | P1 | `palais_plan_masse.png` | G6 | [SUJET] = « le palais de l’Un et ses abords vus de dessus, conformes à la fiche d’identité et au calque joint : le front sud et son portail à deux tours sur la place, la cour d’honneur et le colosse, les deux pavillons, le grand logis au nord, le donjon au nord-est, les quatre tours d’angle, les cuisines au nord-ouest, la chapelle palatine, les jardins au nord jusqu’au rempart ; à l’ouest, l’îlot du percepteur et la rue de service ; à l’est, la poterne et la cour des gardes » · **Lucas valide.** |
| [ ] | P2 | `palais_vue_cavaliere.png` | G2 | [SCÈNE] = « le palais de l’Un et ses abords en vue cavalière depuis le sud-est, en perspective parallèle, comme une maquette : tout ce qui est sur le plan joint est visible ; la place au premier plan, le palais au centre, les jardins et le rempart au fond » · [LUMIÈRE] = matin · **C’est l’image de référence du palais. Lucas valide.** |
| [ ] | P3 | `palais_plan_niveaux.png` | G6 | Format paysage. [SUJET] = « trois plans du palais côte à côte, à la même échelle, vus de dessus en coupe horizontale : le sous-sol (celliers, oubliettes sous le donjon, passage secret vers le fossé) ; le rez-de-chaussée (portail, cour, salle des pesées, archives, cuisines, galerie du logis) ; l’étage (balcon, galerie de l’Un, chambre de l’Un, appartements, chapelle haute) ; murs en indigo, pièces en ocre clair » · Sert à l’infiltration de l’acte III. |
| [ ] | P4 | `palais_coupe.png` | G3 | Format paysage. [SUJET] = « une coupe du palais du sud au nord, comme un dessin d’architecte : à gauche la place, puis l’estrade et le portail, la cour d’honneur et le colosse, le grand logis avec ses étages, les oubliettes sous le donjon, le jardin et le rempart à droite ; on voit les niveaux, les escaliers et les caves » |

#### Les élévations

Gabarit G3. Joindre P1 et P2 validées.

| Fait | Code | Fichier | [SUJET] |
|---|---|---|---|
| [ ] | P10 | `palais_front_sud.png` | Format paysage. « le front sud du palais sur la place, de bout en bout : mur crénelé, deux tentures rouges, portail entre deux tours rondes, balcon drapé de rouge, estrade et dais du percepteur ; derrière, dépassant du mur : les toits des pavillons, le haut du colosse, le toit du grand logis, les tours d’angle » |
| [ ] | P11 | `palais_cote_est.png` | Format paysage. « le côté est du palais, vu depuis la cour des gardes : mur nu de pierre grise, la poterne, quelques fenêtres grillagées, le donjon au fond, une tour d’angle » |
| [ ] | P12 | `palais_cote_ouest.png` | Format paysage. « le côté ouest du palais sur la rue de service : mur nu, la porte charretière des cuisines, des fenêtres basses à barreaux, la passerelle couverte vers l’hôtel du percepteur » |
| [ ] | P13 | `palais_arriere_nord.png` | Format paysage. « l’arrière du palais, vu depuis les jardins : le grand logis avec sa façade sur jardin, plus sobre, ses hautes fenêtres aux rideaux tirés, le donjon, deux tours d’angle, un escalier qui descend vers des parterres » |
| [ ] | P14 | `palais_cour_nord.png` | « la façade du grand logis sur la cour d’honneur : galerie à arcades au rez-de-chaussée, deux étages de hautes fenêtres aux rideaux tirés, haut toit d’ardoise à lucarnes, l’emblème de l’Un sculpté au fronton » |
| [ ] | P15 | `palais_pavillon.png` | « l’un des deux pavillons Renaissance, vu de face depuis la cour, exactement comme sur le calque joint : trois étages de pierre ocre sculptée, fenêtres à meneaux, portail à fronton, toit d’ardoise en pavillon à trois lucarnes » |
| [ ] | P16 | `palais_donjon.png` | Format portrait. « le vieux donjon carré, plus sombre et plus ancien : pierre grise, archères, mâchicoulis, toit pointu d’ardoise, une seule porte haute, un soupirail grillagé au ras du sol » |
| [ ] | P17 | `palais_balcon.png` | « le balcon du portail, en gros plan : balustrade de pierre sculptée, tenture rouge à l’emblème de l’Un, deux torchères, une porte-fenêtre aux rideaux tirés derrière » |

#### Les ambiances

Gabarit G2.

| Fait | Code | Fichier | [SCÈNE] · [LUMIÈRE] |
|---|---|---|---|
| [ ] | P20 | `palais_cour_honneur.png` | « la cour d’honneur vue depuis le portail : le colosse sur son socle au centre, les deux pavillons, le grand logis au fond avec sa galerie, des valets qui traversent, un garde à chaque porte » · matin |
| [ ] | P21 | `palais_rue_service.png` | « la rue de service, l’envers du décor : une charrette chargée de sacs du tribut entre par la porte des cuisines ; des valets déchargent ; des tonneaux ; un garde qui bâille » · matin |
| [ ] | P22 | `palais_jardins.png` | « les jardins de l’Un, clos de hauts murs couverts d’espaliers : parterres géométriques, une fontaine, des allées de sable, personne » · fin d’après-midi |
| [ ] | P23 | `palais_chemin_ronde.png` | « le chemin de ronde au nord du palais, au-dessus du fossé : créneaux, une tour d’angle, une poterne secrète en contrebas » · nuit d’hiver, neige |
| [ ] | P24 | `palais_hotel_percepteur.png` | « l’hôtel du percepteur, adossé au palais : façade de pierre cossue, portail sculpté, écusson à l’emblème de l’Un, passerelle couverte qui le relie au palais par-dessus la rue » · matin |
| [ ] | P25 | `palais_cuisines.png` | « les cuisines du palais : les sacs et les paniers du tribut du matin, empilés, servent à préparer le soir même les pains blancs et les plats de la fête ; des marmitons » · feu orange · (lien entre le tribut et les largesses) |

#### Le même palais, quatre moments

**Exactement l’image P2 validée, même cadrage, rien ne bouge**, seule la lumière change.

| Fait | Code | Fichier | [LUMIÈRE] |
|---|---|---|---|
| [ ] | P30 | `palais_fete.png` | la nuit de la fête : le front illuminé de lanternes et de torches, le balcon éclairé, la cour sombre, une seule fenêtre allumée au grand logis |
| [ ] | P31 | `palais_hiver.png` | une nuit d’hiver : neige sur les toits et sur le colosse, le front sombre, les tours de guet éclairées, des traces de pas dans la cour |
| [ ] | P32 | `palais_printemps.png` | un jour de printemps sous la pluie : toits luisants, jardins verts, le socle du colosse étayé de poutres |
| [ ] | P33 | `palais_an_suivant.png` | le matin du tribut, un an plus tard : la même lumière que P2, mais des affiches collées sur le front, le socle fissuré, une file plus courte |

#### Les éléments pour la 3D

| Fait | Code | Fichier | Gabarit | Contenu |
|---|---|---|---|---|
| [ ] | P40 | `palais_tours.png` | G4 | [SUJET] = « une tour d’angle du palais : tour ronde de pierre blonde, plus haute que les toits, couronnée de mâchicoulis et de créneaux, toit conique d’ardoise bleue avec épi de faîtage doré, quelques fenêtres étroites » |
| [ ] | P41 | `palais_elements.png` | G1 | [NOMBRE] = 16 · [VUE] = « de face » · [LISTE] = « seize éléments d’architecture du palais : merlon et créneau ; mâchicoulis ; lucarne Renaissance à fronton sculpté ; souche de cheminée sculptée ; fenêtre à meneaux à rideaux tirés ; fenêtre grillagée du côté nu ; arcade de galerie ; balustrade du balcon ; torchère ; tenture rouge à l’emblème ; écusson sculpté à l’emblème ; gargouille ; épi de faîtage doré ; porte de service cloutée ; soupirail grillagé ; borne de pierre » |
| [ ] | P42 | `palais_matieres.png` | G1 | [NOMBRE] = 9 · [VUE] = « strictement de face, à plat, chaque carré rempli par la matière » · [LISTE] = « neuf matières du palais en carrés égaux : pierre blonde de taille du front ; pierre ocre sculptée des pavillons ; pierre grise nue des côtés ; vieille pierre sombre du donjon ; ardoise bleue en écailles ; pavés de la cour d’honneur ; velours rouge des tentures ; dorure de l’emblème ; bois de chêne des portes » |

---

## 7. Récapitulatif

| Lot | Contenu | Images |
|---|---|---|
| V | Plan directeur, plans de zones et de rues | 4 |
| V | Huit vues obliques d’ensemble | 8 |
| V | Vues particulières, dont la même vue en quatre lumières | 9 |
| V | Neuf quartiers vus de près | 9 |
| P | Plan, vue de référence, niveaux, coupe | 4 |
| P | Élévations | 8 |
| P | Ambiances | 6 |
| P | Le même palais, quatre moments | 4 |
| P | Éléments et matières pour la 3D | 3 |
| **Total** | | **55** |

**L’ordre à respecter** :
1. V1 ;
2. V2, à faire valider par Lucas ;
3. P1 et P2, à faire valider par Lucas ;
4. tout le reste, dans n’importe quel ordre.

Rien ne doit partir avant la validation de V2 : c’est lui qui garantit la cohérence.

**Ce que Claude fera des images**
- Le **plan directeur** et le **plan de zones** fixeront l’emplacement de chaque quartier du jeu, actes III à V compris. La carte du carnet sera redessinée d’après eux.
- Les **vues obliques** remplaceront l’anneau de volumes lisses qui entoure aujourd’hui la zone jouable : la ville peinte au loin correspondra enfin à la ville jouée.
- Le **palais**, déjà reconstruit en volumes d’après la fiche, sera affiné et peint d’après P1, P2 et les élévations : sculptures, matières, intérieurs.
- Les calques se refont à tout moment avec `node outils/tests/vues_aeriennes.js <dossier>`, pour comparer le jeu aux images.
