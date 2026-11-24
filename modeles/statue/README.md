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
