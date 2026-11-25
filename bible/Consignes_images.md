# Consignes d’images pour ChatGPT

*Le Contr’un* · document de travail · version 1.0 du 24 novembre 2026

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
- [x] **A2, planche de tête** : reçue (`alienor_tete.png`), découpée en quatre vues (`alienor_tete_vue_*.png`).
- [x] **A3, feuille d’expressions de face** : reçue (`alienor_expressions.png`).

**Lot 1 complet.**
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

**Suivi (24 novembre 2026)**, fichiers dans `references/planches-3d/` : **lot 2 complet.**
- [x] B1 à B4, les quatre expressions : `bastien_neutre.png`, `bastien_sourire.png`, `bastien_inquietude.png`, `bastien_colere.png`, et une feuille des quatre de face (`bastien_expressions_casque.png`).
- [x] B5, sans casque : `bastien_sans_casque.png`.
- [x] B6, planche de tour : `bastien_tour.png`, découpée en `bastien_vue_face.png`, `bastien_vue_profil.png`, `bastien_vue_dos.png`.
- [x] B7, planche de tête : `bastien_tete.png` (cou nu, retenue pour la 3D) et `bastien_tete_fraise.png`.
- [x] Bonus, étude de mouvement : `bastien_etude_mouvement.png`.
- Écart avec la consigne : cheveux **châtains** bouclés au lieu de « brun très foncé », et des taches de rousseur. Le rendu est cohérent d’une image à l’autre ; à valider par Lucas.

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

## 5. Méthode pour tous les lots suivants

**Une conversation ChatGPT par personnage, par lieu ou par séquence.** Pour un personnage :
1. Coller la **consigne de départ** propre au personnage (sections 6 à 8), avec les images indiquées.
2. Dans la même conversation, coller ensuite les **consignes de suite** ci-dessous, une par une, en joignant à chaque fois l’image de départ retenue. Elles valent pour tous les personnages.

Chaque consigne contient déjà la ligne de style. Enregistrer chaque image retenue sous le nom indiqué, en PNG, et me l’envoyer.

**Priorité** : lot 3 (Anselme), puis lot 4 (Mahaut et Gervais), puis la rue de l’imprimerie (lot 9, L1 à L4). Ce sont les éléments de la tranche verticale et de l’acte III.

### Les consignes de suite

**S1 · Planche de tour** (paysage) · fichier `nom_tour.png`
> Même personnage que l’image jointe, même visage, même costume, même style. Planche de référence pour un modèle 3D : le personnage dessiné trois fois côte à côte, en pied, de la tête aux pieds : vue de face, vue de profil droit (il regarde vers la droite de l’image), vue de dos. Pose identique dans les trois vues : debout, droit, poids sur les deux pieds, bras légèrement écartés du corps, mains ouvertes et détendues, regard droit devant. Il ne tient aucun objet. Vues orthographiques, sans perspective : les trois silhouettes ont exactement la même taille, les pieds sur la même ligne, le sommet de la tête à la même hauteur. Lumière douce et uniforme, sans ombre portée forte. Fond ivoire uni, sans décor. Les vues ne se chevauchent pas et rien n’est coupé par les bords.
> Style : encre de Chine fine et lavis d’aquarelle sur papier ivoire au grain visible, dans le style exact de l’image jointe, ombres légèrement indigo, jamais grises ni noires. Renaissance française, vers 1550. Pas de texte, pas de légende, pas de signature, pas de cadre, pas de filigrane.

**S2 · Planche de tête** (paysage) · fichier `nom_tete.png`
> Même personnage que l’image jointe, même visage, même style. Planche de référence pour un modèle 3D : la tête et le cou dessinés quatre fois côte à côte, à la même échelle : de face, de trois quarts, de profil droit, de dos. Coiffure et couvre-chef identiques dans les quatre vues. Expression neutre, bouche fermée. Les quatre têtes sont alignées, les yeux sur une même ligne horizontale. Lumière douce et uniforme. Fond ivoire uni.
> Style : encre de Chine fine et lavis d’aquarelle sur papier ivoire au grain visible, dans le style exact de l’image jointe, ombres légèrement indigo. Pas de texte, pas de légende, pas de signature, pas de cadre, pas de filigrane.

**S3 · Feuille d’expressions** (paysage) · fichier `nom_expressions.png`
> Quatre portraits en buste du même personnage que l’image jointe, côte à côte, strictement de face, même cadrage et même échelle, même costume. De gauche à droite : expression neutre ; sourire ; inquiétude, sourcils relevés au centre ; colère contenue, sourcils froncés, mâchoire serrée. Seule l’expression change. Fond ivoire uni.
> Style : encre de Chine fine et lavis d’aquarelle sur papier ivoire au grain visible, dans le style exact de l’image jointe, ombres légèrement indigo. Pas de texte, pas de légende, pas de signature, pas de cadre, pas de filigrane.

**S4 · Une autre expression, en portrait** (carré) · fichiers `nom_sourire.png`, `nom_inquietude.png`, `nom_colere.png`
> Exactement le même personnage, le même visage, le même costume, le même cadrage et le même style que l’image jointe. Seule l’expression change : [EXPRESSION]. Pas de texte, pas de légende, pas de signature, pas de cadre.

Remplacer [EXPRESSION] par : « sourire franc, regard qui s’adoucit » ; « inquiétude, sourcils relevés au centre, lèvres serrées, regard qui fuit sur le côté » ; « colère retenue, sourcils froncés, mâchoire serrée, sans grimace ».

**S5 · Planche de mains** (carré) · fichier `nom_mains.png`
> Étude des mains et des avant-bras du même personnage que l’image jointe : six dessins sur une même planche, main gauche et main droite, paume et dos, et deux gestes typiques : [GESTES]. Mêmes manches, même peau, mêmes taches que sur l’image jointe. Fond ivoire uni.
> Style : encre de Chine fine et lavis d’aquarelle sur papier ivoire au grain visible. Pas de texte, pas de légende, pas de signature, pas de cadre.

**Ce qu’il faut pour chaque personnage**

| Rang | Personnages | Consignes |
|---|---|---|
| Principaux | Anselme, Mahaut, Maëlle, Garin, le sergent Brisset, le percepteur | Départ, S1, S2, S3, S5 |
| Secondaires | Ysabeau, Gervais, Hugues, Perrine, Jeanne, Thibaut, Margot, Bertin, Joris, Martin, Gilles | Départ, S1, S3 |
| Silhouettes | Mathurin, Colin, les enfants, Hubert | Départ, S1 |
| Secret | L’Un | Lot 8, à faire en dernier |

Pour un personnage **sans portrait** (nouveau visage), la consigne de départ est un portrait de trois quarts : la faire valider par Lucas avant S1. Ajouter ensuite S4, trois fois, pour les expressions utilisées dans les dialogues.

---

## 6. Lot 3 · Anselme

### A-1 · Planche de tour, consigne de départ
**Format** : paysage. **Fichier** : `anselme_tour.png`
**Joindre** : `references/portraits-originaux/anselme.webp`

> Planche de référence pour un modèle 3D. Le même personnage que le portrait joint, maître Anselme, imprimeur de la Renaissance, soixante ans, dessiné trois fois côte à côte, en pied, de la tête aux pieds : vue de face, vue de profil droit, vue de dos. Exactement le même visage et le même costume que le portrait joint : béret de velours rouge terre de Sienne retombant sur le côté, cheveux gris sous le béret, pourpoint brun sombre, chemise écrue au col, long tablier de cuir écru taché d’encre noire avec bretelles, haut-de-chausses sombre, bas bleu nuit, chaussures de cuir usées. Mains et avant-bras noirs d’encre jusqu’aux poignets. Une paire de besicles (lunettes anciennes à monture de corne) passée dans une poche du tablier. Silhouette maigre, dos légèrement voûté. Pose identique dans les trois vues : debout, bras légèrement écartés, mains ouvertes, regard droit devant. Il ne tient aucun objet. Vues orthographiques, sans perspective, même taille, pieds sur la même ligne. Lumière douce et uniforme. Fond ivoire uni. Rien n’est coupé par les bords.
> Style : encre de Chine fine et lavis d’aquarelle sur papier ivoire au grain visible, dans le style exact de l’image jointe, ombres légèrement indigo, jamais grises ni noires. Renaissance française, vers 1550. Pas de texte, pas de légende, pas de signature, pas de cadre, pas de filigrane.

Puis **S2**, **S3**, et **S5** avec [GESTES] = « une main qui chausse des besicles ; une main qui tient un composteur d’imprimeur garni de caractères de plomb ».

### A-2 · Anselme douze ans plus tôt (pour la séquence de la nuit)
**Format** : carré. **Fichier** : `anselme_jeune.png`
**Joindre** : `references/portraits-originaux/anselme.webp`

> Le même homme que sur le portrait joint, maître Anselme, mais douze ans plus jeune : environ quarante-huit ans, même visage, mêmes traits, moins de rides, cheveux encore bruns, à peine grisonnants aux tempes, sous le même béret rouge. Même tablier de cuir taché d’encre, déjà les mains noires d’encre. Portrait en buste, de trois quarts, expression grave et attentive. Fond de papier ivoire avec un lavis léger.
> Style : encre de Chine fine et lavis d’aquarelle sur papier ivoire au grain visible, dans le style exact de l’image jointe, ombres légèrement indigo. Pas de texte, pas de légende, pas de signature, pas de cadre.

---

## 7. Lot 4 · Mahaut et Gervais

### M-1 · Mahaut, portrait de départ
**Format** : carré. **Fichier** : `mahaut_neutre.png`
**Joindre** : `references/planches-3d/alienor_expressions.png` (pour la ressemblance) et `references/portraits-originaux/alienor-neutre.webp`

> Portrait en buste, de trois quarts, de Mahaut, la mère de la jeune femme des images jointes : quarante-huit ans. Elle doit lui ressembler nettement, c’est le même visage vieilli : même forme du visage, mêmes yeux bruns, même nez, mêmes taches de rousseur, plus pâles. Ses cheveux, autrefois roux, sont devenus gris cuivre, longs, tressés simplement et rassemblés dans la nuque, quelques mèches libres. Visage marqué par une vie dure dans la forêt, rides fines au coin des yeux, regard calme, profond, un peu triste. Cape brune de bûcheronne à capuche rabattue sur les épaules, robe de laine brune usée, chemise écrue. Doigts tachés d’encre brune, et non bleue. Fond de papier ivoire avec un lavis vert-brun léger, évoquant une forêt.
> Style : encre de Chine fine et lavis d’aquarelle sur papier ivoire au grain visible, dans le style exact des images jointes, ombres légèrement indigo. Renaissance française, vers 1550. Pas de texte, pas de légende, pas de signature, pas de cadre.

**À vérifier** : on doit reconnaître la mère d’Aliénor au premier regard. **Faire valider par Lucas**, puis S4 (trois expressions), S1, S2, S3, et S5 avec [GESTES] = « une main qui écrit avec une plume d’oie ; une main qui tient un cahier cousu au fil de lin ».

### M-2 · Mahaut, trente-six ans (pour la séquence de la nuit)
**Format** : carré. **Fichier** : `mahaut_jeune.png`
**Joindre** : `mahaut_neutre.png` validée

> La même femme que sur l’image jointe, mais douze ans plus jeune : trente-six ans. Cheveux encore roux cuivré, bouclés, relevés en chignon retenu par un ruban écru, comme sa fille. Robe orange brûlé, tablier écru taché d’encre bleue, mains tachées d’encre bleue : c’est alors une imprimeuse. Portrait en buste, de trois quarts, regard déterminé. Fond de papier ivoire avec un lavis léger.
> Style : encre de Chine fine et lavis d’aquarelle sur papier ivoire au grain visible, dans le style exact de l’image jointe, ombres légèrement indigo. Pas de texte, pas de légende, pas de signature, pas de cadre.

### M-3 · Mahaut enfant (pour la séquence du bûcher)
**Format** : carré. **Fichier** : `mahaut_enfant.png`
**Joindre** : `mahaut_neutre.png` validée

> La même personne que sur l’image jointe, mais petite fille de huit ans : cheveux roux bouclés en désordre, taches de rousseur, mêmes yeux bruns, robe de laine simple brun-rouge, tablier rapiécé, pieds nus. Portrait en buste, de trois quarts, regard vif et effrayé. Fond de papier ivoire avec un lavis léger.
> Style : encre de Chine fine et lavis d’aquarelle sur papier ivoire au grain visible, dans le style exact de l’image jointe, ombres légèrement indigo. Pas de texte, pas de légende, pas de signature, pas de cadre.

### G-1 · Gervais, portrait de départ
**Format** : carré. **Fichier** : `gervais_neutre.png`
**Joindre** : `references/portraits-originaux/anselme.webp` (pour le style)

> Portrait en buste, de trois quarts, de Gervais, vieil imprimeur de la Renaissance, soixante-quinze ans, qui vit caché dans la forêt. Visage maigre et creusé, longue barbe blanche, sourcils broussailleux, yeux gris très vifs, petites besicles rondes sur le nez. Capuche de laine brune, manteau rapiécé, écharpe grise. Mains noueuses, tachées d’encre ancienne. Ce n’est pas le personnage de l’image jointe, qui ne sert qu’au style. Expression bienveillante et malicieuse. Fond de papier ivoire avec un lavis vert-brun léger.
> Style : encre de Chine fine et lavis d’aquarelle sur papier ivoire au grain visible, dans le style exact de l’image jointe, ombres légèrement indigo. Renaissance française, vers 1550. Pas de texte, pas de légende, pas de signature, pas de cadre.

Puis S1 et S3.

---

## 8. Lots 5 à 7 · Les autres personnages

Pour chacun : coller la consigne de départ, avec l’image indiquée, puis les consignes de suite prévues dans le tableau de la section 5.

### Lot 5 · Les personnages principaux

**Maëlle** · `maelle_tour.png` · joindre `references/portraits-originaux/maelle.webp`
> Planche de référence pour un modèle 3D. Le même personnage que le portrait joint, Maëlle, jeune boulangère de dix-huit ans, dessinée trois fois côte à côte, en pied : vue de face, vue de profil droit, vue de dos. Exactement le même visage et le même costume : longue tresse blonde, robe bleu pétrole à manches retroussées, tablier blanc, fichu clair, sabots ou chaussures de cuir. Avant-bras poudrés de farine. Pose identique dans les trois vues : debout, bras légèrement écartés, mains ouvertes, regard droit devant, sans objet. Vues orthographiques, sans perspective, même taille, pieds sur la même ligne. Lumière douce et uniforme. Fond ivoire uni. Rien n’est coupé par les bords.
> Style : encre de Chine fine et lavis d’aquarelle sur papier ivoire au grain visible, dans le style exact de l’image jointe, ombres légèrement indigo. Renaissance française, vers 1550. Pas de texte, pas de légende, pas de signature, pas de cadre, pas de filigrane.

S5 : [GESTES] = « deux mains qui pétrissent une pâte ; une main qui tend une feuille imprimée pliée ».

**Garin** · `garin_tour.png` · joindre `references/portraits-originaux/garin.webp`
> Planche de référence pour un modèle 3D. Le même personnage que le portrait joint, Garin, tanneur de cinquante ans, massif, dessiné trois fois côte à côte, en pied : vue de face, vue de profil droit, vue de dos. Exactement le même visage et le même costume : bonnet de cuir, barbe, chemise écrue aux manches retroussées, avant-bras énormes, tablier de cuir terre de Sienne, haut-de-chausses sépia, bottes de travail. Pas de sac. Pose identique dans les trois vues : debout, bras légèrement écartés, mains ouvertes, regard droit devant. Vues orthographiques, sans perspective, même taille, pieds sur la même ligne. Lumière douce et uniforme. Fond ivoire uni. Rien n’est coupé par les bords.
> Style : encre de Chine fine et lavis d’aquarelle sur papier ivoire au grain visible, dans le style exact de l’image jointe, ombres légèrement indigo. Renaissance française, vers 1550. Pas de texte, pas de légende, pas de signature, pas de cadre, pas de filigrane.

S5 : [GESTES] = « une paume grande ouverte, vide, après avoir lâché un sac ; deux mains qui tirent la barre d’une presse ».

**Le percepteur, Philibert Mauclerc** · `percepteur_tour.png` · joindre `references/portraits-originaux/percepteur.webp`
> Planche de référence pour un modèle 3D. Le même personnage que le portrait joint, le percepteur, cinquante ans, dessiné trois fois côte à côte, en pied : vue de face, vue de profil droit, vue de dos. Exactement le même visage et le même costume : fraise blanche, toque noire, longue robe bleu nuit à manches fendues, chaîne d’office, ceinture avec une écritoire, chaussures noires. Pose identique dans les trois vues : debout, bras légèrement écartés, mains ouvertes, regard droit devant, sans objet. Vues orthographiques, sans perspective, même taille, pieds sur la même ligne. Lumière douce et uniforme. Fond ivoire uni. Rien n’est coupé par les bords.
> Style : encre de Chine fine et lavis d’aquarelle sur papier ivoire au grain visible, dans le style exact de l’image jointe, ombres légèrement indigo. Renaissance française, vers 1550. Pas de texte, pas de légende, pas de signature, pas de cadre, pas de filigrane.

S5 : [GESTES] = « une main qui écrit avec une plume d’oie ; une main qui retient le plateau d’une balance ».

**Le sergent Brisset** (nouveau visage) · `brisset_neutre.png` · joindre `references/planches-3d/bastien_neutre.png` (pour l’uniforme et le style)
> Portrait en buste, de trois quarts, du sergent Brisset, chef des gardes, quarante-cinq ans. Ce n’est pas le jeune homme de l’image jointe : visage large et lourd, nez épaté, moustache épaisse et grisonnante, joues rougies, petits yeux méfiants. Massif, le cou épais. Même uniforme que l’image jointe, mais plus orné : casque morion d’acier à liseré doré et à très grande plume rouge, cuirasse d’acier gravée, manches rouges bouffantes, fraise blanche, écharpe de sergent rouge sombre en travers du torse. Il tient une coupe de vin d’étain. Fond de papier ivoire avec un lavis bleu-gris léger.
> Style : encre de Chine fine et lavis d’aquarelle sur papier ivoire au grain visible, dans le style exact de l’image jointe, ombres légèrement indigo. Renaissance française, vers 1550. Pas de texte, pas de légende, pas de signature, pas de cadre.

Puis validation par Lucas, S4 (trois expressions), S1, S2, S3.

### Lot 6 · Les personnages secondaires

Même consigne de départ pour chacun : la planche de tour ci-dessous, en remplaçant [PERSONNAGE] et [COSTUME], et en joignant le portrait indiqué. Puis S3.

> Planche de référence pour un modèle 3D. Le même personnage que le portrait joint, [PERSONNAGE], dessiné trois fois côte à côte, en pied : vue de face, vue de profil droit, vue de dos. Exactement le même visage et le même costume : [COSTUME]. Pose identique dans les trois vues : debout, bras légèrement écartés, mains ouvertes, regard droit devant, sans objet. Vues orthographiques, sans perspective, même taille, pieds sur la même ligne. Lumière douce et uniforme. Fond ivoire uni. Rien n’est coupé par les bords.
> Style : encre de Chine fine et lavis d’aquarelle sur papier ivoire au grain visible, dans le style exact de l’image jointe, ombres légèrement indigo. Renaissance française, vers 1550. Pas de texte, pas de légende, pas de signature, pas de cadre, pas de filigrane.

| Fichier | Joindre | [PERSONNAGE] | [COSTUME] |
|---|---|---|---|
| `ysabeau_tour.png` | `references/portraits-originaux/ysabeau.webp` | Ysabeau, vieille femme de soixante-quinze ans, petite et un peu courbée | coiffe blanche, châle vert forêt croisé sur la poitrine, robe vert sauge, tablier gris, chaussures noires |
| `hugues_tour.png` | `img/portraits/hugues_neutre.webp` | Hugues, chef de rue de cinquante ans, ventru | béret bleu, chaîne de chef de rue sur la poitrine, pourpoint bleu, gants de cuir fin, haut-de-chausses gris, chaussures à boucle |
| `jeanne_tour.png` | `img/portraits/jeanne_neutre.webp` | Jeanne, paysanne de quarante ans | bonnet blanc, robe brune, tablier ocre, fichu, sabots |
| `thibaut_tour.png` | `references/portraits-originaux/thibaut.webp` | Thibaut, charretier de quarante ans | capuchon bleu, blouse de toile, ceinture de corde, bottes boueuses |
| `margot_tour.png` | `img/portraits/margot_neutre.webp` | Margot, veuve de soixante ans | châle sombre, robe noire de veuve, coiffe grise |
| `bertin_tour.png` | `img/portraits/bertin_neutre.webp` | Bertin, colporteur de quarante-cinq ans | capuchon vert forêt, pourpoint ocre, haut-de-chausses sépia, besace de cuir |
| `gilles_tour.png` | `img/portraits/comedien_neutre.webp` | Gilles, comédien de trente ans | costume de comédien bigarré à losanges, collerette, chausses colorées |

**Trois nouveaux visages**, d’abord en portrait, puis S1 et S3 :

**Joris, le frère de Bastien** · `joris_neutre.png` · joindre `references/planches-3d/bastien_neutre.png`
> Portrait en buste, de trois quarts, de Joris, frère aîné du jeune homme de l’image jointe : vingt-quatre ans, même air de famille (mêmes yeux clairs, mêmes cheveux châtains bouclés, mêmes taches de rousseur) mais visage plus large, nez cassé, barbe de quelques jours, carrure de porteur. Chemise de toile écrue ouverte, gilet de cuir usé, un sac de toile sur l’épaule. Pas d’uniforme, pas de casque. Expression fatiguée et fière. Fond de papier ivoire avec un lavis léger.
> Style : encre de Chine fine et lavis d’aquarelle sur papier ivoire au grain visible, dans le style exact de l’image jointe, ombres légèrement indigo. Pas de texte, pas de légende, pas de signature, pas de cadre.

**Martin, le père de Bastien, mendiant** · `martin_neutre.png` · joindre `references/planches-3d/bastien_neutre.png`
> Portrait en buste, de trois quarts, de Martin, père du jeune homme de l’image jointe : cinquante-cinq ans, qui en paraît soixante-dix. On reconnaît les mêmes yeux clairs et la même forme du visage, mais creusée, barbe grise mal taillée, cheveux gris en désordre. Habits rapiécés de mendiant, couverture sur les épaules. Regard digne, sans pitié pour lui-même. Fond de papier ivoire avec un lavis léger.
> Style : encre de Chine fine et lavis d’aquarelle sur papier ivoire au grain visible, dans le style exact de l’image jointe, ombres légèrement indigo. Pas de texte, pas de légende, pas de signature, pas de cadre.

**Perrine** (remplace le portrait qui reprenait le visage d’Aliénor) · `perrine_neutre.png` · joindre `references/portraits-originaux/maelle.webp` (pour le style seulement)
> Portrait en buste, de trois quarts, de Perrine, femme du peuple de trente ans. Elle ne ressemble pas au personnage de l’image jointe, qui ne sert qu’au style : cheveux bruns très foncés, raides, sous une coiffe blanche ; visage rond, yeux noirs, sourcils épais, pas de taches de rousseur. Robe de laine grise, tablier bleu délavé. Expression tendue, regard qui guette autour d’elle. Fond de papier ivoire avec un lavis léger.
> Style : encre de Chine fine et lavis d’aquarelle sur papier ivoire au grain visible, dans le style exact de l’image jointe, ombres légèrement indigo. Pas de texte, pas de légende, pas de signature, pas de cadre.

Puis S4, trois fois (inquiétude, colère, sourire), pour remplacer les quatre portraits actuels de Perrine.

### Lot 7 · Les silhouettes

Même consigne que le lot 6 (planche de tour), puis rien d’autre.

| Fichier | Joindre | [PERSONNAGE] | [COSTUME] |
|---|---|---|---|
| `mathurin_tour.png` | `references/portraits-originaux/mathurin.webp` | Mathurin, vieux vigneron de quatre-vingts ans | bonnet roux, gilet olive, chemise écrue, haut-de-chausses sépia |
| `hubert_tour.png` | `img/portraits/mendiant_neutre.webp` | Hubert, vieux mendiant | haillons rapiécés, bâton, pieds enveloppés de chiffons |
| `garcon_tour.png` | `img/portraits/garcon_neutre.webp` | Pierrot, garçon de huit ans | chemise trop grande, couronne de papier, culotte rapiécée, pieds nus |
| `fille_tour.png` | `img/portraits/fille_neutre.webp` | Toinon, fillette de sept ans | robe simple, tablier, un petit sac de toile vide |

**Colin, le fils de Perrine** · `colin_tour.png` · joindre `perrine_neutre.png` validée
> Planche de référence pour un modèle 3D : Colin, fils de la femme de l’image jointe, six ans, mêmes cheveux bruns et mêmes yeux noirs, chemise grise, culotte courte, sabots, dessiné trois fois côte à côte, en pied : de face, de profil droit, de dos. Pose identique, bras légèrement écartés. Vues orthographiques, même taille, pieds sur la même ligne. Fond ivoire uni.
> Style : encre de Chine fine et lavis d’aquarelle sur papier ivoire au grain visible, dans le style exact de l’image jointe. Pas de texte, pas de légende, pas de signature, pas de cadre.

---

## 9. Lot 8 · L’Un (à faire en dernier, pour l’acte III)

Ne pas montrer ces images aux élèves avant l’acte III.

**L’Un, Jehan** · `lun_neutre.png` · joindre `references/portraits-originaux/percepteur.webp` (pour le style)
> Portrait en buste, de trois quarts, d’un souverain de la Renaissance, cinquante-cinq ans, qui n’a rien d’un roi de légende : petit, maigre, voûté, le teint gris et malade, les yeux cernés et inquiets, les lèvres minces, quelques cheveux ternes sous un bonnet de fourrure trop grand. Il est enroulé dans d’épaisses fourrures et un manteau pourpre trop lourd pour lui, une main décharnée serrée sur le col. Il a froid. Ce n’est pas le personnage de l’image jointe, qui ne sert qu’au style. Fond sombre, éclairé par la lueur orangée d’un feu de cheminée sur un côté.
> Style : encre de Chine fine et lavis d’aquarelle sur papier ivoire au grain visible, dans le style exact de l’image jointe, ombres indigo profondes. Renaissance française, vers 1550. Pas de texte, pas de légende, pas de signature, pas de cadre.

Puis S1 et S3.

---

## 10. Lot 9 · Les lieux et les objets

Pour un lieu, chaque image est faite dans une **nouvelle conversation**.

### L1 · La rue de l’imprimerie, au matin (illustration d’ambiance)
**Format** : paysage. **Fichier** : `lieu_rue_imprimerie.png`
**Joindre** : `references/lieux-originaux/place-du-marche-et-tribut.webp`, `references/planches-de-travail/facade-renaissance-portail.webp`

> Illustration d’ambiance pour un jeu vidéo : une rue étroite d’une cité de la Renaissance française, Sarlande, au petit matin du jour du tribut, vue à hauteur d’homme. Au premier plan à gauche, l’imprimerie de maître Anselme : maison à colombages sur rez-de-chaussée de pierre blonde, grande porte de bois ouverte sur l’atelier sombre où l’on devine une presse à bras, enseigne de fer forgé en forme de livre ouvert, sans lettres, des feuilles imprimées qui sèchent sur une corde à une fenêtre. En face, des maisons à encorbellement, tuiles brunes, volets vert sauge, une jardinière fleurie, du linge qui sèche. Pavés irréguliers luisants de rosée. Au bout de la rue, on aperçoit la place du marché, la fontaine et, au loin, l’immense statue de l’Un, tournée de dos. Lumière dorée et rasante venue de l’est, longues ombres indigo, brume légère. Personne dans la rue.
> Style : encre de Chine fine et lavis d’aquarelle sur papier ivoire au grain visible, dans le style exact des images jointes, ombres indigo, granulation, bords de lavis irréguliers. Palette : ocre, terre de Sienne, sépia, vert sauge, indigo, orange lumineux. Pas de texte, pas de légende, pas de signature, pas de cadre, pas de filigrane.

### L2 · Élévation de la façade de l’imprimerie
**Format** : carré. **Fichier** : `lieu_facade_imprimerie.png`
**Joindre** : `lieu_rue_imprimerie.png`

> La façade de l’imprimerie de l’image jointe, dessinée strictement de face, en élévation, sans aucune perspective, comme un relevé d’architecte aquarellé : rez-de-chaussée de pierre, grande porte de bois ouverte, fenêtre à meneaux, étage à colombages, toit de tuiles brunes, enseigne en forme de livre ouvert sans lettres. Toute la façade est visible, du sol au faîte du toit, rien n’est coupé. Lumière douce et uniforme, sans ombre portée. Fond ivoire uni autour de la façade.
> Style : encre de Chine fine et lavis d’aquarelle sur papier ivoire au grain visible, dans le style exact de l’image jointe. Pas de texte, pas de légende, pas de signature, pas de cadre.

Faire de même, dans d’autres conversations, pour deux maisons de la rue : `lieu_facade_maison_1.png` et `lieu_facade_maison_2.png`, en décrivant la maison visée.

### L3 · Planche de matières
**Format** : carré. **Fichier** : `lieu_matieres.png`
**Joindre** : `references/planches-de-travail/atlas-pierre-tuiles-bois-papier.webp`

> Planche de matières pour des textures de jeu vidéo : neuf carrés de même taille disposés en grille de trois sur trois, chacun montrant une seule matière vue strictement de face, à plat, remplissant tout le carré, sans perspective et sans ombre portée : pierre de taille blonde ; mur enduit à la chaux ; colombages de bois sombre ; tuiles brunes ; pavés irréguliers ; planches de bois de porte ; ardoise ; terre battue ; vieux papier taché d’encre. Lumière douce et uniforme. Fines marges ivoire entre les carrés.
> Style : encre de Chine fine et lavis d’aquarelle sur papier ivoire au grain visible, dans le style exact de l’image jointe. Pas de texte, pas de légende, pas de signature, pas de cadre.

### L4 · L’intérieur de l’atelier
**Format** : paysage. **Fichier** : `lieu_atelier.png`
**Joindre** : `lieu_rue_imprimerie.png`

> Illustration d’ambiance : l’intérieur de l’imprimerie de maître Anselme, au XVIe siècle, la nuit, éclairé par une seule chandelle et la lueur d’un feu. Au centre, une grande presse à bras en bois de chêne, avec sa barre, sa vis et son plateau. Le long du mur, les casses de caractères en plomb, inclinées. Des balles d’encrage en cuir posées sur un marbre. Des cordes tendues sous les poutres, où sèchent des dizaines de feuilles imprimées. Des rames de papier, des pots d’encre, un établi, des besicles posées sur un livre ouvert. Poutres basses, sol de tomettes, ombres indigo profondes, halo orangé de la chandelle. Personne dans la pièce.
> Style : encre de Chine fine et lavis d’aquarelle sur papier ivoire au grain visible, dans le style exact de l’image jointe, ombres indigo profondes. Pas de texte, pas de légende, pas de signature, pas de cadre, pas de filigrane.

### L5 · Les objets
**Format** : paysage. Une conversation par objet. Fichiers : `objet_presse.png`, `objet_sac.png`, `objet_balance.png`, `objet_hallebarde.png`.

> Planche de référence pour un modèle 3D : [OBJET], dessiné trois fois côte à côte, à la même échelle : de face, de profil, de dos. Vues orthographiques, sans perspective, lumière douce et uniforme, fond ivoire uni, rien n’est coupé par les bords.
> Style : encre de Chine fine et lavis d’aquarelle sur papier ivoire au grain visible, ombres légèrement indigo. Renaissance française, vers 1550. Pas de texte, pas de légende, pas de signature, pas de cadre.

Remplacer [OBJET] par :
- « une presse d’imprimerie à bras du XVIe siècle, en chêne, avec sa barre, sa grosse vis de bois, son plateau, son chariot et son tympan » ;
- « le sac du tribut : un sac de toile écrue plein et lourd, noué au col par un lacet de cuir, avec une sangle de cuir brun pour le porter en bandoulière ; la toile est tendue et bosselée par son contenu, la sangle rejoint le col des deux côtés » ;
- « la balance du percepteur : une grande balance de marchand en laiton à deux plateaux, sur pied de bois, avec ses poids en fonte » ;
- « une hallebarde de garde de la Renaissance : longue hampe de bois, fer à hache en croissant, pointe et crochet ».

### L6 à L10 · Les lieux des actes III et IV
**Format** : paysage. Même fin de consigne (la ligne de style de L1). **Joindre** : `lieu_rue_imprimerie.png` pour le style, et la référence indiquée.

| Fichier | Joindre aussi | Ce qu’on décrit |
|---|---|---|
| `lieu_place_neige.png` | `references/lieux-originaux/place-du-marche-et-tribut.webp` | La même place du marché en hiver : neige sur les tuiles et le rebord de la fontaine, eau gelée en stalactites, traces de pas dans la neige, fumées des cheminées, ciel blanc et bas, lumière blanche et diffuse ; sur la fontaine, une affiche à demi arrachée ; au loin, la statue de l’Un sous la neige, une pierre manquante à son socle. |
| `lieu_foret_cabane.png` | `references/lieux-originaux/foret-et-sarlande-au-loin.webp` | Au cœur d’une forêt d’érables et de chênes, près d’une source, une cabane de bûcheron en rondins et pierres sèches, toit de chaume moussu, une seule fenêtre éclairée ; à l’intérieur, entrevue par la porte entrouverte, une table chargée de cahiers cousus et une bougie ; fin d’après-midi de printemps, lumière verte et dorée. |
| `lieu_archives.png` | `references/lieux-originaux/bibliotheque-archives.webp` | Les archives du palais de l’Un, la nuit : rayonnages de registres reliés de cuir jusqu’aux voûtes, échelles, pupitres, poussière dans un rai de lune, une seule lanterne posée par terre, un registre ouvert sur une table. |
| `lieu_oubliettes.png` | `references/lieux-originaux/cour-des-gardes-et-chapelle.webp` | Les oubliettes sous le palais : un couloir voûté de pierre humide, des cellules fermées par des grilles, des chaînes au mur, de la paille, un soupirail d’où tombe une faible lumière froide ; sur un mur, des traits gravés pour compter les jours et une phrase gravée trop petite pour être lue. |
| `lieu_galerie_un.png` | `references/lieux-originaux/porte-fortifiee-et-pont.webp` | Une galerie du palais, vue depuis une balustrade sculptée : en contrebas, une chambre surchauffée, un grand feu de cheminée, un fauteuil couvert de fourrures, des serviteurs debout le long des murs, la tête baissée. Le fauteuil est vu de dos : on ne voit pas qui y est assis. |

---

## 11. Lot 10 · Les séquences illustrées

Ce sont des suites d’images qui racontent un moment, à lire au rythme de l’élève (bible, partie 7.1). **Une conversation par séquence** : les images d’une même séquence se font dans la même conversation, pour garder les mêmes visages et la même lumière.

**Format** : paysage, pour toutes. **Joindre** pour toutes : `references/lieux-originaux/place-du-marche-et-tribut.webp` (pour le style), et les portraits des personnages présents.

La ligne de style à ajouter **à la fin de chaque image** :
> Style : illustration de livre ancien à l’encre de Chine fine et au lavis d’aquarelle sur papier ivoire au grain visible, dans le style exact des images jointes, ombres indigo, granulation, bords de lavis irréguliers. Renaissance française, vers 1550. Mêmes personnages, mêmes visages et mêmes costumes que les portraits joints. Pas de texte, pas de légende, pas de bulle, pas de signature, pas de cadre.

### Q1 · Le bûcher, il y a quarante ans (acte III, souvenir d’Ysabeau)
Joindre : `mahaut_enfant.png`, `references/portraits-originaux/ysabeau.webp`.
1. `seq_bucher_1.png` : « Sur la place du marché de Sarlande, de nuit, un grand bûcher où des gardes en uniforme rouge jettent des livres ; la foule regarde en silence, tête basse ; au fond, la statue de l’Un. »
2. `seq_bucher_2.png` : « Une petite fille rousse de huit ans se faufile entre les jambes de la foule et tire du feu une page qui brûle par un coin ; gros plan sur ses petites mains et la page roussie, les flammes orange tout autour. »
3. `seq_bucher_3.png` : « Dans une ruelle sombre, la petite fille tend la page roussie à une femme de trente-cinq ans en coiffe blanche, au châle vert (Ysabeau jeune), qui la cache sous son châle en regardant derrière elle. »

### Q2 · La nuit d’il y a douze ans (acte III, la confession d’Anselme)
Joindre : `anselme_jeune.png`, `mahaut_jeune.png`, `lieu_atelier.png`.
1. `seq_nuit_1.png` : « Dans l’atelier éclairé à la chandelle, Anselme, quarante-huit ans, tire la barre de la presse pendant que Mahaut, trente-six ans, encre la forme avec des balles de cuir ; des feuilles sèchent au-dessus d’eux ; ils sourient. »
2. `seq_nuit_2.png` : « La porte de l’atelier vue de l’intérieur ; des coups font trembler le bois ; une lueur de torches rouges passe sous la porte ; Mahaut et Anselme figés, la feuille encore à la main. »
3. `seq_nuit_3.png` : « Des gardes en rouge emmènent Mahaut, qui ne se débat pas ; sur le seuil, elle se retourne et fait un petit signe de tête vers Anselme ; lui reste debout près de la presse et baisse les yeux. »
4. `seq_nuit_4.png` : « Anselme seul dans l’atelier vide, à l’aube, assis, ses besicles à la main ; dans la cheminée, des feuilles imprimées finissent de brûler ; un seul livre sauvé posé sur ses genoux. »

### Q3 · L’automne et l’hiver qui tombent sur la ville (entre l’acte II et l’acte III)
1. `seq_hiver_1.png` : « Des gardes en rouge arrachent des affiches sur les murs de Sarlande ; des passants détournent les yeux ; une feuille s’envole. »
2. `seq_hiver_2.png` : « Les premières neiges sur les toits de Sarlande vus de haut, des fumées de cheminées, la statue de l’Un blanchie, et sur la fontaine, un coin d’affiche qui résiste. »
3. `seq_hiver_3.png` : « Une perquisition : le sergent, massif et moustachu, fait vider des sacs de farine chez un boulanger ; un jeune garde aux cheveux châtains (Bastien) se tient en retrait. » Joindre aussi `brisset_neutre.png` et `references/planches-3d/bastien_neutre.png`.

### Q4 · Les billets du lavoir (acte III, Aliénor et Bastien)
Joindre : `references/planches-3d/alienor_expressions.png`, `references/planches-3d/bastien_sans_casque.png`.
1. `seq_billets_1.png` : « Sous un pont de pierre, au bord de la rivière, près d’un lavoir, une main tachée d’encre glisse un billet plié entre deux pierres du mur. »
2. `seq_billets_2.png` : « Au même endroit, plus tard, une autre main, celle d’un jeune homme, retire le billet ; on aperçoit son casque à plume rouge posé sur la margelle. »

### Q5 · Le rendez-vous sous la neige (acte III, facultatif)
Joindre : les mêmes qu’en Q4.
1. `seq_neige_1.png` : « La nuit, sous un auvent couvert de neige près du quai, la jeune femme rousse et le jeune homme aux cheveux châtains se font face ; il tient son casque à la main, des flocons tombent entre eux ; une lanterne, des souffles visibles dans le froid. »
2. `seq_neige_2.png` : « Le même instant, plus près : leurs fronts se touchent presque, il a les yeux baissés, elle sourit ; tendresse retenue, rien de plus. »

### Les séquences des actes IV et V
La trahison, la forêt, la hallebarde posée et les fins seront rédigées avec le découpage de ces actes.
