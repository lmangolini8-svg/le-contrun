# Consignes d’images pour ChatGPT

*Le Contr’un* · document de travail · version 0.2 du 24 novembre 2026

Ces consignes sont à coller dans **ChatGPT**, avec la génération d’images. **Codex ne convient pas** : c’est un agent qui écrit du code, il ne dessine pas.

---

## 1. Mode d’emploi

1. **Une conversation ChatGPT par personnage.** ChatGPT garde mieux le même visage d’une image à l’autre au sein d’une même conversation.
2. **Joindre les images de référence** indiquées dans chaque consigne, depuis le dossier du projet. Ce sont elles qui fixent le visage et le style.
3. **Choisir le bon format** quand ChatGPT le propose : carré (1024 × 1024), paysage (1536 × 1024) ou portrait (1024 × 1536).
4. **Coller la consigne telle quelle**, en entier. Le paragraphe de style commun est inclus dans chacune.
5. **Vérifier l’image** avec la liste « À vérifier » sous chaque consigne. Si un point ne va pas, répondre simplement dans la même conversation, par exemple : « Garde exactement la même image, mais le profil doit regarder vers la gauche et les pieds doivent être entiers. »
6. **Enregistrer l’image retenue** sous le nom indiqué, en PNG, puis me l’envoyer dans notre conversation, ou la déposer dans `references/planches-3d/` sur GitHub.

**Ordre conseillé** : Aliénor (lot 1), puis Bastien (lot 2). Pour Bastien, faites valider d’abord le visage (consigne B1) avant tout le reste.

---

## 2. Le paragraphe de style commun

Il est déjà inclus dans chaque consigne. Le voici seul, si vous devez le rappeler à ChatGPT :

> Style : illustration à l’encre de Chine fine et au lavis d’aquarelle, sur papier ivoire au grain visible, dans le style exact des images jointes. Traits d’encre fins et irréguliers, couleurs posées en lavis transparents avec granulation, ombres légèrement indigo, jamais grises ni noires. Palette : orange lumineux, écru, terre de Sienne, sépia, indigo, rouge vif pour la garde. Époque : Renaissance française, vers 1550. Pas de texte, pas de légende, pas de signature, pas de cadre, pas de filigrane.

---

## 3. Lot 1 · Aliénor

**Suivi (24 novembre 2026)**, fichiers dans `references/planches-3d/` :
- [x] **A1, planche de tour** : trois versions reçues. **La v3 est retenue** (`alienor_tour_v3.png`) : la plus neutre et la plus proche du portrait. Ses trois vues sont découpées en carrés pour la génération 3D : `alienor_vue_face.png`, `alienor_vue_profil.png`, `alienor_vue_dos.png`. Seul défaut : la bottine est basse de face et montante de profil ; on garde celle de face.
- [ ] **A2, planche de tête** : à refaire en grand. L’étude de mouvement contient une petite rangée de têtes, trop petite pour la 3D.
- [ ] **A3, feuille d’expressions de face** : pas encore reçue.
- [x] **A4, planche de mains** : reçue (`alienor_mains.png`). Elle montre le geste du revers et la sangle, utiles pour la scène de la manche.
- [x] **Bonus, étude de mouvement** (`alienor_etude_mouvement.png`) : marche, gestes, profils de tête, balancement des bras, bas de jupe. Référence pour l’animation.

### A1 · Planche de tour, en pied

**Format** : paysage. **Fichier** : `alienor_tour.png`
**Joindre** : `references/portraits-originaux/alienor-neutre.webp` et `references/planches-de-travail/alienor-costume-face-et-dos.webp`

> Planche de référence pour un modèle 3D. Le même personnage, Aliénor, jeune femme de dix-sept ans, dessiné trois fois côte à côte, en pied, de la tête aux pieds : vue de face, vue de profil droit (elle regarde vers la droite de l’image), vue de dos. Exactement le même visage, la même coiffure et le même costume que sur les images jointes : cheveux roux bouclés relevés en chignon tressé, retenu par un ruban écru noué derrière la tête, quelques mèches libres aux tempes et sur la nuque ; taches de rousseur ; robe orange lumineux à manches bouffantes retroussées au-dessus du coude par un revers écru roulé ; encolure carrée bordée d’une fronce de chemise écrue ; tablier écru taché d’éclaboussures d’encre bleue, avec bavette, bretelles qui passent sur les épaules et descendent droites dans le dos, ceinture nouée en grand nœud dans le dos avec deux longs pans ; jupe ample jusqu’aux chevilles ; bottines de cuir brun lacées ; avant-bras et mains tachés d’encre bleue.
> Pose identique dans les trois vues : debout, droite, poids réparti sur les deux pieds, bras légèrement écartés du corps, mains ouvertes et détendues, regard droit devant. Vues orthographiques, sans perspective : les trois silhouettes ont exactement la même taille, les pieds sur la même ligne, le sommet de la tête à la même hauteur. Lumière douce et uniforme, sans ombre portée forte. Fond ivoire uni, sans décor. Les trois vues ne se chevauchent pas, et rien n’est coupé par les bords.
> Style : illustration à l’encre de Chine fine et au lavis d’aquarelle, sur papier ivoire au grain visible, dans le style exact des images jointes. Traits d’encre fins et irréguliers, couleurs posées en lavis transparents avec granulation, ombres légèrement indigo, jamais grises ni noires. Palette : orange lumineux, écru, terre de Sienne, sépia, indigo. Époque : Renaissance française, vers 1550. Pas de texte, pas de légende, pas de signature, pas de cadre, pas de filigrane.

**À vérifier**
- Le visage ressemble au portrait joint.
- Trois vues entières, pieds compris, sans chevauchement.
- Même hauteur pour les trois silhouettes, sans perspective.
- Le profil est un vrai profil (on ne voit qu’un œil).
- Dos : chignon, nœud du ruban, bretelles droites, grand nœud du tablier et ses deux pans.

### A2 · Planche de tête

**Format** : paysage. **Fichier** : `alienor_tete.png`
**Joindre** : `references/portraits-originaux/alienor-neutre.webp`, `references/portraits-originaux/alienor-sourire.webp`

> Planche de référence pour un modèle 3D : la tête et le cou d’Aliénor, dessinés quatre fois côte à côte, à la même échelle : de face, de trois quarts, de profil droit, de dos. Exactement le même visage que sur les portraits joints : jeune femme de dix-sept ans, visage ovale, front dégagé, sourcils droits et marqués, grands yeux bruns, nez droit, lèvres pleines, menton net, taches de rousseur sur le nez et les joues. Cheveux roux cuivré bouclés relevés en chignon tressé haut sur l’arrière du crâne, retenu par un ruban écru qui passe au-dessus du front et se noue sous le chignon ; mèches libres bouclées aux tempes, devant les oreilles et sur la nuque. Expression neutre, bouche fermée. Les quatre têtes sont alignées à la même hauteur, les yeux sur une même ligne horizontale. Lumière douce et uniforme. Fond ivoire uni.
> Style : illustration à l’encre de Chine fine et au lavis d’aquarelle, sur papier ivoire au grain visible, dans le style exact des images jointes. Ombres légèrement indigo. Pas de texte, pas de légende, pas de signature, pas de cadre, pas de filigrane.

**À vérifier** : les yeux sont à la même hauteur dans les quatre vues ; la naissance des cheveux est bien visible de face et de profil ; le volume du chignon se lit de profil et de dos.

### A3 · Feuille d’expressions, de face

**Format** : paysage. **Fichier** : `alienor_expressions.png`
**Joindre** : les deux portraits d’Aliénor

> Quatre portraits d’Aliénor côte à côte, en buste, strictement de face, même cadrage et même échelle, la même jeune femme que sur les portraits joints. De gauche à droite : expression neutre ; sourire léger, un peu gêné ; inquiétude, sourcils relevés au centre ; colère contenue, sourcils froncés, mâchoire serrée. Le visage regarde droit vers le spectateur, sans tourner la tête. Mêmes cheveux, même chignon, même robe orange et même tablier dans les quatre portraits. Fond ivoire uni.
> Style : illustration à l’encre de Chine fine et au lavis d’aquarelle, sur papier ivoire au grain visible, dans le style exact des images jointes. Ombres légèrement indigo. Pas de texte, pas de légende, pas de signature, pas de cadre, pas de filigrane.

**À vérifier** : les quatre visages sont bien de face (le nez au milieu du visage) ; c’est la même personne ; seule l’expression change.

### A4 · Planche de mains

**Format** : carré. **Fichier** : `alienor_mains.png`
**Joindre** : `references/portraits-originaux/alienor-neutre.webp`

> Étude des mains et avant-bras d’une jeune apprentie imprimeuse de la Renaissance : six dessins sur une même planche. Main gauche et main droite, paume et dos ; une main qui frotte un revers de manche écru ; une main qui retient une sangle de cuir. Les doigts, le dos des mains et les avant-bras jusqu’aux coudes sont tachés d’encre bleu-noir, en taches irrégulières et en traînées. On voit le bas de la manche : un revers écru roulé au-dessus du coude, avec une tache d’encre étalée. Fond ivoire uni.
> Style : illustration à l’encre de Chine fine et au lavis d’aquarelle, sur papier ivoire au grain visible, dans le style exact de l’image jointe. Pas de texte, pas de légende, pas de signature, pas de cadre, pas de filigrane.

---

## 4. Lot 2 · Bastien, garde de la porte

**À faire dans une nouvelle conversation.** Faire valider B1 par Lucas avant de lancer les suivantes, toujours dans la même conversation et en joignant B1.

### B1 · Portrait neutre, le visage de référence

**Format** : carré. **Fichier** : `bastien_neutre.png`
**Joindre** : `references/portraits-originaux/garde.webp` (pour l’uniforme et le style) et `references/portraits-originaux/alienor-neutre.webp` (pour le style seulement)

> Portrait en buste, de trois quarts, d’un jeune garde de la Renaissance nommé Bastien, vingt ans. Il doit être d’une grande beauté, naturelle et franche, sans rien de dur ni de cruel : visage ouvert, mâchoire nette, pommettes hautes, nez droit, lèvres bien dessinées, yeux clairs gris-bleu, regard droit et attentif, une fine cicatrice qui coupe le sourcil gauche. Rasé de près, sans moustache ni barbe. Cheveux brun très foncé, ondulés, courts, qui dépassent du casque sur le front et la nuque. Ce n’est pas le garde de l’image jointe : visage différent, plus jeune, sans moustache, yeux clairs.
> Même uniforme que le garde joint : casque morion d’acier à bords relevés, rivets dorés, grande plume rouge sur le côté ; cuirasse d’acier aux sangles de cuir brun ; manches rouges bouffantes ; petite fraise de chemise blanche au cou ; une hallebarde tenue dans la main droite. Fond de papier ivoire avec un lavis bleu-gris léger, comme sur l’image jointe.
> Style : illustration à l’encre de Chine fine et au lavis d’aquarelle, sur papier ivoire au grain visible, dans le style exact des images jointes. Traits d’encre fins et irréguliers, lavis transparents avec granulation, ombres légèrement indigo. Époque : Renaissance française, vers 1550. Pas de texte, pas de légende, pas de signature, pas de cadre, pas de filigrane.

**À vérifier** : très beau, jeune, sans moustache ; yeux clairs ; cicatrice au sourcil gauche ; clairement différent du garde joint. **Envoyer cette image à Lucas pour validation avant de continuer.**

### B2 à B4 · Les trois autres expressions

**Format** : carré. **Fichiers** : `bastien_sourire.png`, `bastien_inquietude.png`, `bastien_colere.png`
**Joindre** : `bastien_neutre.png` (B1 validée)

Une consigne à la fois, dans la même conversation :

> Exactement le même personnage, le même visage, le même uniforme, le même cadrage et le même style que l’image jointe. Seule l’expression change : **[sourire doux et un peu timide, qui monte plus d’un côté de la bouche, regard qui s’adoucit]**. Pas de texte, pas de légende, pas de signature, pas de cadre.

Remplacer la partie entre crochets par :
- pour l’inquiétude : « inquiétude, sourcils relevés au centre, lèvres serrées, regard qui fuit légèrement sur le côté » ;
- pour la colère : « colère retenue, sourcils froncés, mâchoire serrée, regard dur, sans grimace ».

### B5 · Portrait sans casque

**Format** : carré. **Fichier** : `bastien_sans_casque.png`
**Joindre** : `bastien_neutre.png`

> Exactement le même jeune homme que sur l’image jointe, même visage, même cicatrice au sourcil gauche, même cadrage et même style, mais il a retiré son casque et le tient sous le bras gauche. On voit enfin ses cheveux brun très foncé, ondulés, un peu en désordre, mèches sur le front. Il porte toujours la cuirasse, les manches rouges et la fraise blanche. Expression calme, presque désarmée, regard vers le spectateur. Pas de texte, pas de légende, pas de signature, pas de cadre.

### B6 · Planche de tour, en uniforme

**Format** : paysage. **Fichier** : `bastien_tour.png`
**Joindre** : `bastien_neutre.png` et `references/portraits-originaux/garde.webp`

> Planche de référence pour un modèle 3D. Le même personnage que l’image jointe, Bastien, jeune garde de vingt ans, dessiné trois fois côte à côte, en pied, de la tête aux pieds : vue de face, vue de profil droit (il regarde vers la droite de l’image), vue de dos. Même visage, même uniforme : casque morion d’acier à plume rouge, cuirasse d’acier aux sangles de cuir brun, pourpoint et manches rouges bouffantes, petite fraise blanche, haut-de-chausses rouge bouffant, bas rouges, chaussures de cuir brun, ceinturon avec une courte épée au côté gauche. Il tient sa hallebarde verticale dans la main droite, la hampe posée au sol à côté du pied droit. Pose identique dans les trois vues : debout, droit, bras gauche légèrement écarté du corps. Vues orthographiques, sans perspective : les trois silhouettes ont la même taille, les pieds sur la même ligne. Lumière douce et uniforme, sans ombre portée forte. Fond ivoire uni. Rien n’est coupé par les bords.
> Style : illustration à l’encre de Chine fine et au lavis d’aquarelle, sur papier ivoire au grain visible, dans le style exact des images jointes. Ombres légèrement indigo. Pas de texte, pas de légende, pas de signature, pas de cadre, pas de filigrane.

**À vérifier** : trois vues entières, hallebarde comprise ; pas de perspective ; le dos de la cuirasse et des sangles est lisible.

### B7 · Planche de tête, sans casque

**Format** : paysage. **Fichier** : `bastien_tete.png`
**Joindre** : `bastien_sans_casque.png`

> Planche de référence pour un modèle 3D : la tête et le cou de Bastien, sans casque, dessinés quatre fois côte à côte, à la même échelle : de face, de trois quarts, de profil droit, de dos. Exactement le même visage que l’image jointe, avec la fine cicatrice au sourcil gauche et les cheveux brun très foncé ondulés. Expression neutre. Les quatre têtes sont alignées, les yeux sur une même ligne horizontale. Lumière douce et uniforme. Fond ivoire uni.
> Style : illustration à l’encre de Chine fine et au lavis d’aquarelle, sur papier ivoire au grain visible. Pas de texte, pas de légende, pas de signature, pas de cadre, pas de filigrane.

---

## 5. Les lots suivants

Ils seront rédigés après réception des lots 1 et 2 :
- **Lot 3 · Mahaut** : le portrait d’une femme de quarante-huit ans qui ressemble à Aliénor, aux cheveux gris cuivre.
- **Lot 4 · Perrine** : un nouveau visage, brune, pour remplacer le portrait qui reprenait celui d’Aliénor.
- **Lot 5 · Anselme** : planche de tour, planche de mains avec les besicles, et Anselme jeune pour la nuit d’il y a douze ans.
- **Lot 6 · La rue de l’imprimerie** : illustration d’ambiance, élévations de façades, planche de matières.
