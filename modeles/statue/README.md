# Statue de Sarlande (étape 1, Meshy gratuit)

Référence validée : `references/planches-3d/statue_reference.png`.
Globe métallique ajouré dans SA main droite (à gauche de l'image vue de face), épée dans SA main
gauche, pointe vers le bas. Couronne, patine bleu sombre, liserés dorés.
**Pas de fleur de lys** (décision du 24 novembre 2026) : le pommeau de l'épée de la planche en porte
une ; il sera remplacé dans Blender si Meshy le reproduit.

- `meshy/entree_essai1_statue_reference_carre.png` : image à donner à Meshy pour l'essai 1.
- `meshy/` : y déposer les GLB téléchargés de Meshy (`essai1.glb`, `essai2.glb`).
- `outils/blender/statue_meshy.py` : remise à l'échelle (29,6 m sans socle, comme le colosse actuel),
  origine au pied, 60 000 triangles au plus, textures 2048 px, vues face / profil / dos.
- `statue_sarlande.glb` : modèle retenu, chargé par `index.html?glb=statue`.
- `outils/tests/vues_statue.js` : quatre vues fixes en jeu (rue de l'imprimerie, milieu de la rue,
  place, face rapprochée) pour comparer les essais. Avant : `apercus/avant_colosse_actuel_4_vues.jpg`.

Budget : 0 €, plan gratuit Meshy, deux essais.
