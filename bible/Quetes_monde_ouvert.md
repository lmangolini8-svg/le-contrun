# Sarlande en monde ouvert : les actes deviennent des quêtes

*Le Contr’un* · document de conception · 26 novembre 2026
Complète le [cahier de finition des actes I et II](Finition_Actes_I_II.md) et le [cahier de refonte](Refonte_Sarlande.md). Les décisions narratives de la bible ne changent pas : seule la façon d’y jouer change.

## 1. Le constat

Le joueur n’est pas libre de se promener, pour quatre raisons mesurées dans le code au 26 novembre :

1. **Deux mondes collés.** La ville à l’échelle de l’atlas (`jeu/ville.js`, décalée à x = 3000) et l’ancienne « place resserrée » des actes I et II (autour de x = 0) sont deux décors séparés. Les scènes du récit (tribut, Garin, cour des gardes, chapelle, fête) se jouent dans l’ancienne place ; la ville n’est qu’un trajet. On passe de l’une à l’autre par des portes qui téléportent (« Entrer à l’atelier » pose Aliénor en (-19, 0, 7)).
2. **Une petite partie de la ville est praticable.** La bande construite fait 440 × 122 m, soit 54 000 m², pour une enceinte de 140 000 m² : environ 38 % de la ville. Le palais, le chapitre, les tanneurs, le nord et les portes de la cité ne se visitent pas.
3. **Le récit est un couloir.** 42 conditions `S.stage === n` décident de ce qui existe et de ce qui se dit. Un objectif à la fois ; tant qu’il n’est pas rempli, le reste attend.
4. **L’aide pousse vers un seul but.** La flèche, le texte d’objectif et le marqueur désignent un seul point ; rien ne signale ce qu’on pourrait faire ailleurs.

## 2. Le modèle : Guild Wars 2

Dans Guild Wars 2, on se promène où l’on veut ; le monde propose sans imposer.

| Guild Wars 2 | À Sarlande | Exemple, acte I |
|---|---|---|
| **Histoire personnelle** : chapitres suivis, une étoile sur la carte, que l’on reprend quand on veut | **Les actes**, découpés en chapitres et en étapes. L’étape suivie est marquée ; on peut la laisser de côté | « Le matin du tribut » : peser la miche, prendre son poste, porter le sac, répondre au percepteur |
| **Événements dynamiques** : ils arrivent à une heure et en un lieu, que le joueur soit là ou non | **Les événements de la ville**, liés au calendrier et à l’heure | La cloche du tribut et la file sur la place ; l’arrivage du quai ; la fermeture de la poterne le soir |
| **Cœurs de renommée** : aider les gens d’un lieu, de plusieurs façons | **Les services** rendus aux habitants, au choix | Aider Maëlle au fournil ; porter les peaux de Garin ; livrer des tirages pour Anselme |
| **Points d’intérêt et panoramas** | **Les lieux à découvrir et les vues** | Le parvis ; le haut des remparts ; la vue sur le colosse depuis le quai |
| **Collections** | **Les feuillets**, les témoignages, les illustrations | Les huit feuillets, cachés dans toute la ville |
| **Carte du monde** avec tout ce qui précède | **La carte du carnet** | Étoile du récit, cercles des événements, cœurs, lieux découverts |

## 3. Les règles

1. **Un seul monde continu.** Toute l’histoire se joue dans la ville à l’échelle. Aucune téléportation, sauf les seuils d’intérieurs (on entre et on ressort par la même porte) et les ellipses annoncées (« Attendre le soir »).
2. **Rien ne se ferme pour forcer le récit.** Seuls les obstacles du monde arrêtent : un garde à la poterne, une porte verrouillée la nuit, un horaire de boutique. Ils se contournent ou s’attendent, comme dans la vie.
3. **Le récit attend le joueur.** Une étape démarre quand on vient la jouer, au bon lieu ; elle n’a pas de minuterie. Le temps n’avance qu’avec les activités choisies et les ellipses acceptées (règle du cahier de refonte).
4. **Une étape suivie à la fois, plusieurs ouvertes.** Le joueur choisit dans le carnet ce qu’il suit ; la flèche et l’étoile désignent cette étape seulement.
5. **Les choix restent dans le récit.** Les trois réponses au percepteur, la dénonciation, les témoignages : rien ne change dans la bible. Ce qui change, c’est quand et dans quel ordre le joueur y arrive.
6. **Ce qui est facultatif le reste.** Les services, les vues et les collections ne bloquent jamais le récit ; ils l’enrichissent (une réplique, un indice, un feuillet, une relation).

## 4. Les actes I et II découpés en quêtes

Les codes renvoient aux étapes actuelles (`S.stage`). Les lieux sont ceux de l’atlas.

### Acte I · Le matin du tribut

| Chapitre | Étapes (dans l’ordre suggéré, pas imposé) | Lieu | Remplace |
|---|---|---|---|
| I-1 Le réveil | Lire la lettre ; s’habiller ; sortir du clos | Clos des murailles | réveil actuel |
| I-2 La miche de Maëlle | Peser la miche (en public ou en privé), ou différer | Fournil, place | refonte §2.3 |
| I-3 La prise de poste | Rejoindre Anselme ; recevoir le sac et la page cousue (F1) | Imprimerie | étape 0 |
| I-4 Le tribut | À la cloche : faire la file, répondre au percepteur (payer, dénoncer, questionner) | Place, estrade | étape 1 |
| I-5 La page du boulanger | Retrouver Maëlle ; recevoir F2 | Fournil | étape 2 |
| I-6 La chapelle | Passer la poterne, traverser la cour des gardes, fouiller la chapelle (F3) | Cour des gardes | étape 3 |
| I-7 Garin | Lui lire les trois pages ; la pierre tombe | Place, colosse | étape 4 |
| I-8 Le soir peut attendre | Raconter à Anselme ; choisir d’attendre le soir | Imprimerie | étape 5 |

**Événement** : la cloche du tribut sonne à heure fixe le jour du tribut ; la file se forme, que le joueur soit là ou non. Arriver tard ne bloque rien : le percepteur reste à son estrade jusqu’au soir.
**Hors du récit** : feuillets F4 (quai) et F5 (cour des gardes) ; services de Maëlle, Garin, Anselme ; vues du quai et des Drapiers.

### Acte II · Le soir de la fête

| Chapitre | Étapes | Lieu | Remplace |
|---|---|---|---|
| II-1 Le soir tombe | Parler à Anselme | Imprimerie | étape 10 |
| II-2 La loterie | Arracher Maëlle à la loterie | Place | étape 11 |
| II-3 La farce | Parler à Garin aux tréteaux | Place | étape 12 |
| II-4 Le grand toast | Traverser pendant le toast | Place → imprimerie | étape 13 |
| II-5 Cent feuilles | Imprimer | Imprimerie | étape 14 |
| II-6 L’aube | Coller l’affiche sur la fontaine | Place | étapes 15-16 |

**Événements** : les toasts toutes les 40 à 60 s, le passage de la litière à minuit, la loterie.
**Hors du récit** : les huit témoins de la fête (déjà facultatifs), le masque de Bertin, les pièces, F6 à F8.

## 5. L’interface

- **Le suivi** (en haut à gauche, à la place de l’objectif actuel) : l’étape suivie, en une ligne, et son lieu. Un bouton change d’étape suivie.
- **La carte** : étoile orange pour l’étape suivie, étoiles grises pour les autres étapes ouvertes ; cercles pour les événements en cours ; cœurs pour les services ; lieux découverts ; position et orientation d’Aliénor.
- **La flèche** désigne l’étape suivie, le long des rues ; elle s’efface quand on n’en suit aucune.
- **Le carnet** : onglet « Récit » (actes, chapitres, étapes faites et ouvertes), onglet « Ville » (services, événements connus, lieux découverts).
- **Annonce** discrète quand un événement commence à portée : « La cloche du tribut sonne sur la place. »

## 6. Le roman graphique de Sarlande

Chaque étape du récit jouée débloque des **pages illustrées**. Elles s'assemblent, acte après acte, en un vrai roman graphique, rangé dans le carnet, que l'on feuillette comme on veut : dans l'ordre, au hasard, ou pour revoir une scène.

### Les principes

1. **Une page par moment du récit.** Elle reprend un tableau, une séquence ou une planche de gros plans déjà produits (`references/actes-I-II/`), avec une légende de narration courte. Les citations du *Discours* restent en italique et entre guillemets, à vérifier dans l'édition Belin, distinctes du texte écrit pour le jeu.
2. **Le roman est celui de votre partie.** Les choix changent les pages : payer, dénoncer ou questionner au tribut donne trois pages de fin d'acte différentes (`fin_acte1_paye`, `fin_acte1_denonce`, `fin_acte1_refus`). Un témoin écouté ou non, une alouette libérée ou non : la page existe ou reste blanche.
3. **Les pages manquantes se voient.** Une page non débloquée apparaît en esquisse grise, avec un titre et un indice (« La loterie · acte II »). Le joueur sait ce qui reste à vivre, sans que rien ne soit imposé.
4. **Les pages facultatives récompensent la promenade.** Les huit témoins de la fête, les feuillets (vignettes F1 à F8), les services rendus, les vues découvertes donnent des **pages hors-texte**, rangées en fin de chapitre.
5. **Feuilleter librement.** Double page sur iPad en paysage, page simple en portrait ; on tourne d'un geste, comme les planches de transition existantes. Un sommaire par acte et par chapitre ; un marque-page reprend la lecture où on l'a laissée. La lecture ne fait pas avancer le temps du jeu.
6. **Pour la classe.** Le roman se lit hors de la partie (bouton « Le roman » sur l'écran-titre, pour les pages déjà débloquées). Une page peut s'afficher sans légende, pour l'exercice des légendes à écrire par les élèves (fiche du projet : le récit en images) ; les douze images `recit_01` à `recit_12` en donnent la version courte.

### Les pages des actes I et II, déjà illustrées

| Chapitre | Pages (fichiers de `references/actes-I-II/`) | Débloquées par |
|---|---|---|
| Prologue | `seq_ouverture_1` à `seq_ouverture_6` | Nouvelle partie |
| I-3 La prise de poste | `gros_manche`, `gros_doublure`, `tableau_anselme_sac` | Recevoir le sac |
| I-2 et I-5 Maëlle | `tableau_maelle_etal`, `gros_page_farine`, `lieu_boulangerie_fermee` | La pesée ; F2 |
| I-4 Le tribut | `percepteur_hierarchie`, `tableau_tribut`, `gros_balance`, puis selon le choix `gros_bourse`, `tableau_denonce` ou `gros_plume_nom` ; `tableau_regard_garde` | Le tribut |
| I-6 La chapelle | `tableau_caisses`, `gros_dalle`, `tableau_poterne` ou `tableau_prise` (si l'on est vue) | F3 |
| I-7 Garin | `tableau_joute_garin`, `gros_paume`, `tableau_sac_pose`, `tableau_pierre` | La pierre |
| I-8 et fin d'acte | `tableau_retour`, puis `fin_acte1_paye`, `fin_acte1_denonce` ou `fin_acte1_refus` | Fin de l'acte I |
| II-1 Le soir | `seq_soir_1`, `seq_soir_2`, `tableau_anselme_soir` | Début de l'acte II |
| II-2 La loterie | `tableau_loterie`, `gros_billet_dechire`, `tableau_masque` (si masque) , `gros_pieces` | Maëlle quitte la loterie |
| II-3 La farce | `tableau_farce`, `tableau_farce_garin`, `tableau_branle` (si l'on danse), `tableau_femme_masquee`, `gros_billet_mahaut` | Garin aux tréteaux |
| II-4 Le grand toast | `tableau_toast`, `tableau_grand_toast`, `tableau_garde_detourne` | La traversée |
| II-5 Cent feuilles | `tableau_presse_arrivee`, `gros_composteur`, `gros_barre_garin`, `gros_balles_maelle`, `tableau_tirage`, `gros_besicles` | L'impression |
| II-6 Minuit et l'aube | `tableau_litiere_1`, `tableau_litiere_2`, `tableau_debout` (si l'on reste debout), `gros_colle`, `tableau_jeanne_lit`, `tableau_bastien_lit`, `tableau_mains_fieres`, `tableau_aube_place`, `fin_acte2` | L'affiche |
| Hors-texte | `temoin_*` (8), `vignette_F1` à `vignette_F8`, `vignette_billet`, `gros_cage_ouverte`, `tableau_bertin`, `tableau_ysabeau_seuil`, `tableau_frere_file`, `gros_page_quai`, `gros_page_caisse`, `gros_page_treteaux` | Témoignages, feuillets, rencontres facultatives |

Soit **environ 75 pages** pour les deux premiers actes, sans aucune illustration supplémentaire à commander.

### La technique

- Pages converties en WebP de 1600 px de large (environ 200 Ko chacune, 15 Mo pour les deux actes), chargées à l'ouverture du roman seulement, jamais pendant la marche.
- Registre des pages dans `jeu/roman.js` : identifiant, chapitre, fichier, légende, condition de déblocage (lue dans le registre des quêtes et dans `S.flags`), page de remplacement selon les choix.
- Pages débloquées et marque-page dans la sauvegarde ; migration des anciennes parties d'après leurs étapes et leurs drapeaux déjà joués.

## 7. Le plan de travail

1. **Le registre des quêtes** (`jeu/quetes.js`) et **le roman graphique** (`jeu/roman.js`), qui lit ce registre : données des actes, chapitres et étapes ; étape suivie ; état sauvegardé (migration des anciennes sauvegardes depuis `S.stage`). Suivi, flèche et carte lisent ce registre. *Sans changer le jeu : on rebranche l’aide sur le registre.*
2. **Agrandir la ville praticable** à toute l’enceinte : palais (dehors), chapitre, tanneurs, nord, portes ; grille de marche et tissu urbain étendus, construits par quartiers autour d’Aliénor pour rester légers.
3. **Déplacer les scènes de l’acte I dans la ville** : estrade et file du tribut sur la place de l’atlas, Garin et le colosse, poterne et cour des gardes, chapelle. L’ancienne place resserrée ne sert plus qu’aux intérieurs (atelier).
4. **Les événements de la ville** : cloche et file du tribut, arrivage du quai, poterne fermée le soir.
5. **Les services** : trois pour commencer (fournil, tannerie, livraisons d’Anselme).
6. **L’acte II dans la ville** : la fête sur la place de l’atlas, les témoins, la presse, l’aube.
7. **Vues et lieux à découvrir**, puis recette complète des deux actes dans les deux sens et dans le désordre.

Chaque étape se livre jouable et testée ; les parcours de `outils/tests/` vérifient qu’aucune étape du récit ne devient inaccessible.
