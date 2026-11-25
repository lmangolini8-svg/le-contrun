# « Le Contr'un » : fiche du projet pour un collaborateur

Projet de Lucas Mangolini, professeur de lettres (classes de Première, lycée Vauban, Luxembourg).
Le jeu est développé avec Claude (Anthropic). Cette fiche présente le projet à un second assistant, ChatGPT, pour qu'il puisse y contribuer.
État au 23 novembre 2026.

---

## 1. Le projet en bref

- **Ce que c'est** : un jeu d'aventure en 3D, jouable dans le navigateur, sur le *Discours de la servitude volontaire* d'Étienne de La Boétie, œuvre au programme de l'EAF.
- **Public** : des élèves de Première de 16 ans, qui joueront surtout sur iPad, parfois sur téléphone. On y joue à la maison, en accès libre, en plusieurs séances, avec une sauvegarde automatique.
- **Double objectif** : découvrir l'œuvre, puis réviser pour l'EAF. Les élèves doivent retenir les grandes idées et les citations.
- **Ton** : « le meilleur et le pire, les trahisons et la révolte ».
- **Diffusion** : une seule page HTML publiée par un lien public, sans compte ni connexion, envoyé aux élèves sur Teams.

## 2. Règles à ne jamais enfreindre

1. **Ne jamais inventer de citation de La Boétie.** Toute phrase présentée comme une citation doit exister dans le texte.
2. **Toujours distinguer** les citations du *Discours*, en italique et entre guillemets « », des textes écrits pour le jeu.
3. Pour l'instant, les citations viennent du site « Atelier La Boétie » de Lucas. Elles seront remplacées plus tard par celles de l'édition Belin, qu'utilisent les élèves.
4. **Aucune fausse progression** : pas de barre de chargement artificielle, pas d'attente simulée.
5. **Pas d'émojis**, ni dans le jeu ni dans les textes.
6. Dans les textes distribués aux élèves (fiches, consignes), **numéroter les lignes de 5 en 5**.

## 3. Direction artistique

- **Un monde entièrement peint à l'encre de Chine et à l'aquarelle.** L'aquarelle est la matière même du monde, pas un filtre posé sur une image réaliste. On veut du lavis, de la granulation, des bords d'encre irréguliers, du papier ivoire visible et des bords de feuille.
- **Palette** : indigo, bleu nuit, bleu pétrole, vert sauge, vert forêt, ocre, terre de Sienne, sépia, orange lumineux, blanc cassé.
- **Un monde vivant**, avec des animations discrètes : linge qui sèche, lanternes, gouttes d'encre en suspension, fleurs qui se peignent au passage du joueur.
- **Une interface de carnet dessiné à la main**, qui sert de journal.
- **Des transitions en planches de livre ancien** : on tourne la page entre deux lieux. Chaque planche montre une illustration à l'encre, le nom de la destination et parfois une citation authentique.

## 4. L'univers : Sarlande

Sarlande est une cité imaginaire de la Renaissance, gouvernée par « l'Un ». Personne n'a jamais vu son visage. Chaque année a lieu le jour du tribut : chacun porte au palais le tiers de ce qu'il a gagné. Le soir même, on célèbre la Fête de l'Un.

Lieux de la carte : la place du marché et sa fontaine, le colosse (statue de l'Un), l'imprimerie de maître Anselme, la table du percepteur devant la porte du palais, la poterne, la cour des gardes et sa chapelle, le quai, les ruelles. Les lieux des planches : château, cité, palais, portes, quartiers, ruelles, quai.

## 5. Les personnages, et les portraits déjà générés

Ci-dessous, ma proposition de correspondance entre les portraits que Lucas a générés et les personnages du jeu. **Lucas doit la confirmer.**

| Personnage | Rôle dans le jeu | Portrait déjà généré |
|---|---|---|
| **Aliénor** (héroïne jouable) | Apprentie imprimeuse, « de l'encre jusqu'aux coudes » | Jeune femme rousse, mains tachées d'encre (3 expressions) |
| **Maître Anselme** | Imprimeur, mentor d'Aliénor | Vieil homme au béret rouge et tablier taché (3) |
| **Maëlle** | Boulangère, amie d'Aliénor ; tirée de la loterie à l'acte II | Jeune femme blonde à la tresse (3) |
| **Garin, tanneur** | Homme de la place, à convaincre | Homme massif au bonnet de cuir, sac sur l'épaule (3) |
| **Le percepteur** | Encaisse le tribut au nom de l'Un | Homme à la fraise et à la plume (3) |
| **Les gardes** | Leur zone de vision est rouge ; il faut les éviter | Garde au casque à plume rouge et hallebarde (3) |
| **Ysabeau** | Vieille voisine : « on a toujours fait ainsi » (la coutume) | Vieille femme au châle vert (3) |
| **Bertin, colporteur** | Vend des serins « nés en cage » | Homme au capuchon vert avec une cage d'oiseau (3) |
| **Mathurin, vieux vigneron** | Acte II : la coutume | Vieil homme barbu qui lève un gobelet (1) |
| **Jeanne** | Acte II : les largesses (trois pièces et un pain blanc) | Femme au bonnet qui tend des pièces (1) |
| **Thibaut, charretier** | Acte II : le mystère qui entoure l'Un | Homme au capuchon bleu qui lève les yeux (1) |
| **Hugues, chef de la rue des Tanneurs** | Acte II : l'intérêt (les « quatre ou cinq ») | Homme au béret bleu, attablé (1) |
| **Perrine** | Acte II : la peur ; elle crie « Vive l'Un ! » et l'apprend à son fils | La scène de la mère rousse qui crie en serrant un enfant. Attention : le visage est celui d'Aliénor, il faudra le refaire. |
| **Margot, la veuve** | Acte II : la mémoire ; son mari a refusé de payer et n'est jamais revenu | Femme au châle sombre près d'une porte (1) |
| **Les enfants de la fontaine** | Acte II : ils jouent au tyran et aux sujets | Garçon couronné et fillette (scène) |
| **Les mendiants du quai** | Acte II : exclus des largesses | Vieillard en haillons rapiécés (1) |
| **L'Un** | Invisible pour l'instant ; à l'acte III, il se révèle être un homme chétif | À créer, sans le montrer trop tôt |

## 6. L'histoire

### Acte I : le matin du tribut (terminé)

1. Anselme envoie Aliénor porter le sac du tribut au percepteur.
2. Elle remet le sac au percepteur. Selon son choix, elle paie, refuse ou dénonce.
3. Maëlle lui fait signe près de son étal.
4. Aliénor passe la poterne, traverse la cour des gardes sans être vue et fouille la chapelle.
5. Elle convainc Garin, sur la place.
6. Elle raconte tout à Anselme, et une pierre tombe du socle du colosse.
7. Deux feuillets bonus sont cachés, l'un sur le quai, l'autre au fond de la cour des gardes.

Mécaniques : infiltration (cônes de vision rouges, arrêtés par le décor), dialogues à choix, « joutes » où l'on répond avec la bonne citation, carnet de feuillets à collectionner.

### Acte II : le soir de la Fête de l'Un (terminé)

1. Le soir tombe ; Aliénor parle à Anselme.
2. Elle arrache Maëlle à la loterie. Les lumières dorées font tout oublier : il faut passer au large.
3. Elle parle à Garin pendant la farce jouée sur les tréteaux.
4. Au grand toast, toute la place regarde le balcon : elle en profite pour traverser jusqu'à l'imprimerie.
5. Elle imprime cent feuilles avant l'aube.
6. À l'aube, elle colle la première affiche sur la fontaine.

En chemin, elle recueille les témoignages de huit habitants et les classe selon la cause de leur servitude : coutume, largesses, mystère, intérêt, peur, mémoire. Plusieurs fins sont possibles selon les choix de l'acte I (dénonce, paye, refus).

### La suite (prévue, pas encore écrite)

L'histoire s'étale sur une année.

- **Acte III, l'hiver** : les archives, et l'Un se révèle être un homme chétif.
- **Acte IV** : le traître dépend des choix du joueur.
- **Acte V** : plusieurs fins.
- Deux autres héros jouables sont prévus.

## 7. Les citations utilisées (les feuillets)

Les citations viennent de l'Atelier La Boétie. Les phrases d'explication sont écrites pour le jeu.

- **F1** : « tant d'hommes, tant de bourgs, tant de villes, tant de nations »
- **F2** : « Appellerons-nous cela lâcheté ? »
- **F3** : « la première raison pourquoi les hommes servent volontiers, est pour ce qu'ils naissent serfs et sont nourris tels »
- **F4** : « non pas obéir, mais servir ; non pas être gouvernés, mais tyrannisés »
- **F5** : « ce sont toujours quatre ou cinq qui maintiennent le tyran »
- **F6** : « Les théâtres, les jeux, les farces, les spectacles, les gladiateurs… »
- **F7** : « les appâts de la servitude, le prix de leur liberté, les outils de la tyrannie »
- **F8** : « Pauvres gens et misérables, peuples insensés, nations opiniâtres en votre mal et aveugles en votre bien ! »

## 8. La technique

- **Une seule page HTML** (`index.html`, environ 230 Ko, 1 550 lignes), sans outil de compilation. La seule ressource externe est three.js r128, chargé depuis cdnjs.
- **Rendu** : la scène est éclairée en matériaux « toon », puis un post-traitement (shader POST) ajoute les bords d'encre, le lavis, la granulation du papier, les bords de feuille et les transitions en lavis. La classe `Builder` fusionne les géométries pour limiter le nombre d'appels de dessin (environ 313 pendant la fête). Un attribut de motif (`pat`) dessine la pierre, les tuiles et le bois ; `wobble()` donne au décor son tracé à main levée.
- **Personnages** : `human(o)` construit des personnages articulés (tête, visage, contour par coque inversée), tous rangés dans le registre `HUMANS`. Pendant les dialogues, les personnages se regardent, font des gestes, et la caméra passe par-dessus l'épaule (`dlgCam`).
- **Dialogues** : `talk(lignes, ensuite)`, `nextLine()`, `branch()` pour les choix, `vary()` pour varier les répliques. Une réplique s'écrit `[locuteur, "« texte »"]`.
- **Planches** : `turnPage(dest, ...)`, avec les tables `PLATES` et `DEST`.
- **Progression** : la constante `OBJ` donne les objectifs de l'acte I, `act2Obj()` ceux de l'acte II, et `S.stage` l'étape en cours (0 à 6 pour l'acte I, 10 à 16 pour l'acte II).
- **Sauvegarde** : dans le localStorage, sous la clé `sarlande-acte1-v1`.
- **Son** : tout est synthétisé dans la page avec Web Audio. La musique est procédurale (hymne de l'Un, basse obstinée). Les voix de la foule sont rendues hors ligne. Les ambiances et les bruits sont spatialisés.
- **Commandes** : un joystick tactile sur iPad et téléphone, le clavier sur ordinateur.
- **Tests** : faits avec Playwright, dans Chrome. Le jeu n'a pas encore été testé sur un vrai iPad ni écouté sur un appareil réel.

## 9. Où en est le projet

**Fait**
- Actes I et II jouables de bout en bout. Le déroulé de l'acte II a été vérifié avec les trois choix (dénonce, paye, refus).
- Écran d'accueil, musique, bruits réalistes, visages, caméra des dialogues.
- Motifs de pierre, de tuiles et de bois, jardinières, lierre, linge qui sèche.

**À vérifier**
- Test sur iPad : fluidité, lisibilité des visages, caméra des dialogues, volume des voix de la foule, dosage des toasts.
- L'acte I n'a pas été rejoué en entier depuis les derniers changements visuels.

**Idées en attente**
- Afficher les portraits générés dans les dialogues, avec une expression adaptée à chaque réplique (neutre, sourire, inquiétude ou colère).
- Un récit en 14 images, avec des légendes à écrire par les élèves et des mini-vidéos de récapitulation après chaque acte.
- Améliorer la lumière : rayons dans la brume, ombres des lanternes, hachures qui suivent les formes.
- Écrire les actes III à V et créer les deux autres héros.
- Remplacer les citations par celles de l'édition Belin.

## 10. Comment coopérer

Le partage des tâches proposé :
- **ChatGPT** : les images (portraits, scènes, planches) et des propositions de texte.
- **Claude** : le code du jeu et l'intégration des images.
- **Lucas** : il décide de tout et valide.

**Pour les portraits**
- Format carré, 1024 × 1024 px, en buste, de trois quarts.
- Garder le même fond de papier ivoire et le même style d'un portrait à l'autre.
- Pour chaque personnage, garder exactement le même visage et les mêmes vêtements d'une expression à l'autre.
- Expressions à générer : neutre, sourire, inquiétude ou tristesse, colère. La neutre est obligatoire.
- Nom des fichiers : `personnage_expression.png`, par exemple `garin_neutre.png` ou `alienor_colere.png`.

**Pour les textes**
- Respecter les règles de la partie 2.
- Toute citation proposée doit être signalée comme à vérifier dans l'édition Belin.

**Pour le code**
- Ne pas réécrire le fichier en entier.
- Proposer des modifications ciblées : nom de la fonction, ancien texte, nouveau texte.
- Le fichier est long, et une réécriture complète risque de casser l'équilibre des actes ou les performances sur iPad.
