# Statue de Sarlande (étape 1, Meshy gratuit)

Référence validée : `references/planches-3d/statue_reference.png`.
Globe métallique ajouré dans SA main droite (à gauche de l'image vue de face), épée dans SA main
gauche, pointe vers le bas. Couronne, patine bleu sombre, liserés dorés.
Le pommeau à facettes porte l’emblème C, un disque au-dessus de trois degrés. Contrôler le sens des mains et les ouvertures du globe sur chaque essai. Comparer les proportions avec [la planche de rotation](../../references/planches-3d/statue_tour.png).

- `meshy/entree_essai1_statue_reference_carre.png` : image à donner à Meshy pour l'essai 1.
- `meshy/` : y déposer les GLB téléchargés de Meshy (`essai1.glb`, `essai2.glb`).
- `outils/blender/statue_meshy.py` : remise à l'échelle (29,6 m sans socle, comme le colosse actuel),
  origine au pied, 60 000 triangles au plus, textures 2048 px, vues face / profil / dos.
- `statue_sarlande.glb` : modèle retenu, chargé par `index.html?glb=statue`.
- `outils/tests/vues_statue.js` : quatre vues fixes en jeu (rue de l'imprimerie, milieu de la rue,
  place, face rapprochée) pour comparer les essais. Avant : `apercus/avant_colosse_actuel_4_vues.jpg`.

## Relais pour Claude

L’entrée de l’essai 1 est un PNG carré de 1024 × 1024, avec la statue entière isolée sur fond transparent. La référence peinte et la planche de rotation restent les sources artistiques.

Étape suivante : effectuer l’essai gratuit, récupérer le GLB et vérifier dans Blender le globe ajouré, le pommeau et la pointe de l’épée. Si l’export gratuit est indisponible, consigner le blocage avant toute dépense. Budget de cette étape : 0 €, deux essais au maximum.

Pour transmettre le résultat à Lucas et à ChatGPT, compléter cette section avec le chemin du GLB, le lien vers les quatre captures en jeu et les écarts observés. Le contrôle sur iPad reste à effectuer.

### État au 25 novembre 2026 (Claude)

- Entrée de l'essai 1 contrôlée : PNG 1024 × 1024, fond transparent, statue entière. Bon pour Meshy.
- `statue_tour.png` contrôlée : globe dans la main droite de la statue (à gauche vue de face, à droite
  vue de dos), épée dans la main gauche, pointe en bas, pommeau à facettes. Cohérente sur les trois vues.
  Elle servira à l'essai 2 (plusieurs images) si le plan gratuit le permet.
- **Blocage** : Meshy n'a ni connecteur ni API sur le plan gratuit ; l'essai doit être lancé par Lucas
  sur meshy.ai, puis `essai1.glb` déposé dans `meshy/`. Rien ne peut être généré depuis la session de Claude.

### Essai Blender v1 (25 novembre 2026, 0 €)

- Meshy : le plugin fonctionne (connexion validée par Lucas, 140 crédits gratuits), mais l'API répond
  « Task creation on the free plan is no longer supported » (402). Aucun crédit débité.
- Hugging Face (TRELLIS.2) : jeton enregistré mais refusé (« Invalid username or password »).
- Repli retenu : statue modelée par script, `outils/blender/statue_sarlande.py` → `statue_sarlande.glb`
  (38 000 triangles, 1,1 Mo, couleurs de sommets). Globe ajouré dans SA main droite, épée pointe en bas
  dans SA main gauche, couronne à fleurons à facettes, pommeau à facettes, sans fleur de lys.
- Aperçus : `apercus/blender_v1_face_profil_dos.jpg`, `apercus/blender_v1_4_vues_en_jeu.jpg`.
- En jeu : `index.html?glb=statue` (le colosse procédural reste le défaut tant que ce n'est pas validé).

### Blender v2 (25 novembre 2026, 0 €), statue par défaut dans le jeu

- **Patine** nettement plus sombre (robe `#2b4560`, manteau `#233a52`, chair `#3a5671`) : le rendu
  aquarelle du jeu éclaircit les bleus, la statue se lit maintenant comme du bronze bleu sombre.
- **Visage** sculpté dans le maillage : orbites et yeux en amande avec paupières, arcades, nez droit,
  lèvres, menton, pommettes, mâchoire affinée ; ombre de patine dans les creux du visage.
- **Chevelure** : rangée de boucles sur le front, mèches le long des joues, deux rangs sur la nuque,
  chignon bouclé.
- **Plis** : plis sculptés (crêtes arrondies, creux étroits) sur la robe, la surjupe et le manteau ;
  ourlet du manteau en cascades. La surjupe, cachée dans la robe en v1, passe dessus et tombe en
  pointes, la plus basse au milieu devant. Pieds nus avec orteils sous l'ourlet.
- Corrigé : la robe traversait le manteau dans le dos.
- 55 400 triangles, 1,6 Mo.
- **En jeu** : la statue remplace l'ancien colosse **par défaut**, dans toutes les scènes (jour, acte II
  de nuit). `index.html?glb=ancien` affiche l'ancien colosse pour comparer.
- Aperçus : `apercus/blender_v2_face_profil_dos.jpg`, `apercus/blender_v2_4_vues_en_jeu.jpg`,
  `apercus/nuit_ancien_vs_v2.jpg` (la nuit, ancien colosse à gauche, v2 à droite : dans les deux cas,
  une silhouette sombre ; le globe et l'épée restent lisibles). Aucune erreur dans la console.
- Reste à faire : le contrôle sur iPad.

### Meshy Pro, essai 1 (25 novembre 2026) — statue par défaut dans le jeu

- Génération multi-vues (face, profil, dos découpés dans `statue_tour.png` :
  `meshy/entrees/statue_{face,profil,dos}.png`), texturée 4k. Tâche Meshy
  `01a2103b-0af5-76dd-95bc-5d699644e023` (multi-image-to-3d), **30 crédits**.
- Brut : 1 758 686 triangles, 94 Mo (non versionné, voir `.gitignore` ; retéléchargeable avec
  `meshy multi-image-to-3d get <tâche>`). Suivi Meshy dans `meshy/meshy_output/`.
- Préparé par `outils/blender/statue_meshy.py` : 60 000 triangles, origine au centre des pieds,
  29,6 m, une seule texture couleur 2048 px (relief fin et métal retirés : le jeu ne les utilise
  pas), patine bleue foncée de 20 % sans toucher aux dorures → `statue_sarlande_meshy.glb` (3,3 Mo).
- Contrôle : globe ajouré dans SA main droite, épée pointe en bas dans SA main gauche, couronne à
  fleurons à facettes, visage classique, drapés et motifs dorés de la planche.
- En jeu : modèle **par défaut** (`?glb=meshy`). `?glb=statue` = version Blender v2,
  `?glb=ancien` = ancien colosse. Aucune erreur console ; de nuit, silhouette sombre comme avant.
- Aperçus : `apercus/meshy_essai1_face_profil_dos.jpg`, `apercus/meshy_essai1_4_vues_en_jeu.jpg`,
  `apercus/meshy_essai1_nuit.jpg`.
- Limites : globe simplifié (anneaux en croix, moins d'anneaux que sur la planche) ; motifs du tissu
  en rinceaux dont certains rappellent des fleurs de lys malgré la consigne. Contrôle iPad à faire.
