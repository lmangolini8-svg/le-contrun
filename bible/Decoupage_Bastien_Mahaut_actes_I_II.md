# Bastien et Mahaut dans les actes I et II · découpage

*Le Contr’un* · document de travail · version 0.1 du 24 novembre 2026 · **à valider avant tout changement du code**

**Objet.** Les actes I et II sont jouables. Ce découpage y greffe les premières scènes de la relation entre Aliénor et Bastien, et les premiers indices sur Mahaut, sans rien casser :
- aucune scène existante n’est supprimée ;
- aucune quête, aucun feuillet, aucune joute ne change ;
- toutes les nouvelles scènes sont **courtes** (moins d’une minute), **facultatives** quand elles reposent sur un choix, et se passent avec « Passer la scène » comme les autres.

Les répliques ci-dessous sont des **textes écrits pour le jeu**, à valider. Aucune n’est présentée comme une citation, à une exception près, signalée en M-2, qui est une citation Belin vérifiée.

---

## 1. Les variables

Elles s’ajoutent à la sauvegarde `sarlande-acte1-v1`. Une ancienne sauvegarde qui ne les contient pas reçoit les valeurs par défaut, sans perte de progression.

| Variable | Valeurs | Rôle |
|---|---|---|
| `bastien.vu` | oui / non | Bastien a remarqué Aliénor |
| `bastien.nom` | oui / non | Aliénor connaît son prénom ; avant cela, il s’appelle « Un garde de la porte » |
| `bastien.confiance` | de −1 à 5, départ 0 | Voir `Personnages.md`, 7.2 |
| `bastien.exposition` | de 0 à 5, départ 0 | Voir `Personnages.md`, 7.2 |
| `bastien.refus` | oui / non | Aliénor a refusé la relation ; Bastien redevient une silhouette, et ce choix est respecté jusqu’à la fin |
| `bastien.danse` | oui / non | Ils ont dansé le branle |
| `bastien.lit` | oui / non | Aliénor sait qu’il sait lire |
| `mahaut.billet` | oui / non | Aliénor a ramassé le billet de la femme masquée |
| `mahaut.question` | oui / non | Aliénor a interrogé Anselme sur sa mère |

**La relation est « engagée »** dès que la confiance atteint 1 ou plus, sans refus.

---

## 2. Acte I · le matin du tribut

### B-1 · Le regard (pendant le tribut)

- **Où, quand** : à la balance du percepteur, étape 1, juste après le choix du joueur. Bastien est le garde de gauche de la porte du palais, celui à qui l’on parle déjà avec « Parler au garde ».
- **Forme** : une ligne de narration ajoutée après chaque branche existante, et un bref plan sur son visage.

| Branche existante | Narration ajoutée | Effet |
|---|---|---|
| Payer | « Le garde de gauche regarde ses pieds, comme on le lui a appris. » | aucun |
| Dénoncer Garin | « Le garde de gauche lève les yeux sur vous. Puis il les détourne, comme on détourne les yeux d’une flaque. » | confiance −1 ; `vu` |
| Demander à quoi sert le tribut | après « Je l’écris en grand » : « Le garde de gauche ne regarde plus ses pieds. Il vous regarde. » | `vu` |

### B-2 · « Parler au garde » (de l’étape 1 à la fin de l’acte I)

Le dialogue existant change selon B-1. Les répliques déjà écrites restent disponibles.

- **Si Aliénor a posé la question** :
  - Bastien : « Toi, la question. Tu sais ce qu’il a écrit, sous ton nom ? Moi non plus. Je ne sais pas ce qu’on écrit sur les gens. »
  - Choix 1 : « Comment tu t’appelles ? »
    - Bastien : « Ici, on m’appelle « le garde ». Chez moi, Bastien. » → `nom` ; confiance +1
  - Choix 2 : « Et toi, tu ne demandes jamais ? »
    - Bastien : « Moi aussi, je paie le tribut. On me le retient sur la solde. » (réplique existante) ; puis : « Demander, c’est un luxe. » → confiance +1
  - Choix 3 : « Laisse-moi passer. »
    - Bastien : « Circule. On ne regarde pas la porte. On regarde ses pieds. » (réplique existante) → aucun effet
- **Si Aliénor a dénoncé Garin** :
  - Bastien : « Tu regardes le sac des autres. Moi, je regarde mes pieds. Chacun son métier. »
  - Choix : « J’ai eu peur. » → « Tout le monde a peur. Tout le monde ne donne pas un nom. » ; confiance passe de −1 à 0
  - Choix : passer son chemin → aucun effet
- **Si Aliénor a payé** : les répliques existantes, sans changement.

### B-3 · La poterne (étape 3 ou 4, une seule fois)

Bastien est celui qui laisse la poterne ouverte le matin, pour que sa mère lui apporte son pain (`Personnages.md`, 7.2). La scène se déclenche de l’une des deux façons :

- **A. Aliénor est repérée dans la cour des gardes.** C’est déjà prévu dans le jeu : « Halte ! Rien à faire ici. Dehors ! », puis on la reconduit à la poterne. La première fois, c’est Bastien qui la raccompagne. Sur le chemin, il pourrait l’amener au sergent, et il ne le fait pas.
- **B. Aliénor n’est jamais repérée.** En ressortant de la chapelle avec la page (F3), elle trouve Bastien assis contre la poterne ouverte, un morceau de pain à la main.

**Forme** : un tableau, caméra fixe sur la poterne : lui, le pain, le casque posé à côté de lui.

**Répliques proposées**
- Version A, Bastien : « Ne cours pas. Ceux qui courent, on les rattrape. »
- Version B, Bastien : « Je n’ai rien vu. Comme toujours. » (écho d’une rumeur de l’acte II : « J’ai baissé la tête. Je n’ai rien vu. Comme toujours. »)

| Choix d’Aliénor | Réponse de Bastien | Effet |
|---|---|---|
| « Je cherchais un chat. » | « Ça marche une fois. » Il sourit. | confiance +0 |
| « Je cherchais quelque chose qu’on m’a pris. » | « Ici, on a tous quelque chose qu’on nous a pris. » | confiance +1, exposition +1 |
| « Pourquoi tu me laisses partir ? » | « Parce que ma mère passe par là, le matin. Si je ferme, elle ne passe plus. » | confiance +1, `nom` s’il n’était pas connu (« Bastien. Pour toi. ») |
| « Laisse-moi tranquille. » | « D’accord. » Il remet son casque. | `refus` |
| Partir sans répondre | — | aucun effet |

C’est la première fois que Bastien porte son casque à côté de lui. Il le retirera vraiment trois fois dans le jeu, la première à l’acte III.

---

## 3. Acte II · la nuit de la fête et l’aube

### B-4 · Le branle (étapes 11 et 12)

- **Où** : près des tréteaux, là où l’on danse. Bastien n’est pas de garde à cette heure (réplique existante d’un garde : « Ce soir, on boit aussi, nous autres. À tour de rôle. »).
- **Condition** : `vu`, et pas de `refus`. Interaction : « Parler à Bastien ». S’il n’a jamais été rencontré, c’est un garde anonyme, et la scène n’a pas lieu.
- Bastien : « Ce soir, je n’ai pas de hallebarde. Tu danses ? »

| Choix | Effet |
|---|---|
| Danser | Fondu sur le branle, dix secondes : les tours, les mains qui se prennent et se lâchent. Confiance +1, `danse`. La fête prend Aliénor plus vite, comme sous les lumières dorées (la jauge d’oubli augmente). |
| « Pas ce soir. J’ai quelque chose à faire. » | « Alors fais-le bien. » Aucun effet. |
| « Je ne danse pas avec la garde. » | « Je comprends. » Confiance −1. |

Si Aliénor a dansé, Maëlle, plus tard dans la nuit : « Tu as dansé avec un garde ? Tu es folle. Il était beau, au moins ? »

### B-5 · Il a vu (le grand toast, étape 13)

- **Où, quand** : au moment où la troupe atteint l’imprimerie pendant le grand toast. On insère un plan dans la scène existante d’arrivée.
- **Forme** : un tableau très court, une seule ligne de narration.
- **Narration** : « Au coin de la rue, sous une lanterne, un garde vous a vus passer. Il a détourné la tête vers le balcon. »
- **Si `nom`** : « Bastien vous a vus passer. Il a détourné la tête vers le balcon. »
- **Effet** : aucun sur l’instant. Le joueur pourra en reparler à l’aube (B-6).

C’est le même geste que celui de toute la place : regarder le balcon. Mais lui le fait exprès.

### B-6 · L’affiche (l’aube, étape 16)

- **Où, quand** : après le collage de l’affiche par Aliénor et la lecture de Jeanne, déjà prévus dans le jeu. Bastien est près de la fontaine, seul, et il lit lentement, en suivant les lignes du doigt comme Jeanne.
- **Condition** : `vu`, et pas de `refus`. Interaction : « Parler au garde » ou « Parler à Bastien ».
- La réplique existante du garde de l’aube reste disponible : « Toute la nuit debout, et ils dorment sur les marches. Le tribut, c’est eux qui le paient. La fatigue, c’est nous. »

| Choix | Réponse | Effet |
|---|---|---|
| « Tu sais lire ? » | « Un peu. J’ai appris sur les édits de la porte. Ne le dis à personne : un garde qui lit, ça se remarque. » | confiance +1, `lit` |
| « Merci, pour cette nuit. » | « Je n’ai rien vu. » Un temps. « Fais attention. Les lendemains de fête, ils comptent ceux qui manquent. » | confiance +1, exposition +1 |
| « Tu vas l’arracher ? » | « On ne m’a rien ordonné. » Il ne l’arrache pas. | aucun effet |
| Passer sans rien dire | — | aucun effet |

---

## 4. Les premiers indices sur Mahaut

### M-1 · La page brûlée (acte II, chez Ysabeau)

- **Où, quand** : quand Ysabeau donne la page confiée par la mère d’Aliénor. C’est une scène existante : « Attends. Ta mère m’a confié ceci, il y a longtemps. […] »
- **Ajout** : une ligne de narration, « Le bord de la page est roussi, comme si on l’avait tirée d’un feu. »
- **Rôle** : pose le bûcher d’il y a quarante ans, où Mahaut, enfant, a sauvé cette page.

### M-2 · La femme masquée (acte II, étapes 11 à 13)

- **Où** : de l’autre côté de la fontaine, en marge de la foule. Une femme en cape brune, masquée comme beaucoup ce soir-là, et un vieil homme à côté d’elle (Mahaut et Gervais, que le joueur ne peut pas encore reconnaître).
- **Comportement** : elle regarde Aliénor. Si Aliénor s’approche (« S’approcher de la femme masquée »), elle se détourne et se perd dans la foule. Il reste sur la margelle un billet plié.
- **Le billet** : une phrase recopiée à la main, à l’encre brune, et non imprimée. C’est une citation Belin vérifiée, qui sera donc présentée comme telle : « Soyez résolus de ne plus servir et vous voilà libres. » (Belin, p. 27, l. 217-218)
- **Narration** : « Ce n’est pas imprimé. C’est écrit à la main, d’une écriture penchée, à l’encre brune. » → `mahaut.billet` ; le billet entre dans le carnet, à part des feuillets.
- **Lien avec l’existant** : si Aliénor lit sur les tréteaux, les « deux visages graves » près de la fontaine, « une femme et un vieil homme », sont ces deux-là. La scène existante ne change pas.

Ce billet n’est pas un feuillet : il ne compte pas dans les huit, et il ne sert pas aux joutes. Il prépare l’acte IV, où Aliénor reconnaîtra l’écriture dans les cahiers de la forêt.

### M-3 · Les besicles d’Anselme (acte II, étape 14, à l’imprimerie)

- **Où, quand** : quand Anselme annonce « J’ai choisi la page d’Ysabeau. Elle a attendu quarante ans, elle passera la première. » (réplique existante).
- **Choix ajouté**, facultatif : « Vous l’avez connue, ma mère ? »
  - Narration : « Il retire ses besicles. »
  - Anselme : « Un peu. C’était il y a longtemps. Compose. »
  - Effet : `mahaut.question`.
- **Rôle** : c’est son geste signature quand il ment (`Personnages.md`, 7.1). L’élève attentif le comprendra à l’acte III, lors de la confession.

---

## 5. Ce qu’il faut pour l’image et le son

- **Portrait** : tant que les portraits de Bastien (consignes B1 à B4) ne sont pas intégrés, ses répliques utilisent le portrait commun des gardes. Ensuite, elles prendront les siens, selon l’expression de la réplique.
- **3D** : Bastien est d’abord le garde de gauche de la porte, avec le modèle commun. Son modèle propre viendra avec sa planche de tour (consigne B6).
- **Musique** : le branle existe déjà ; pendant la danse avec Bastien, on y glisse son tambour, plus lent.
- **Tableaux** : B-3 (la poterne), B-5 (le coin de rue) et M-2 (la margelle) sont des plans fixes simples, réalisables avec le décor actuel.

---

## 6. Ce qui change dans le code (après validation)

- Ajout des variables `bastien` et `mahaut` à la sauvegarde, avec valeurs par défaut.
- Dialogues : la balance du percepteur (narrations de B-1), « Parler au garde » (B-2), la reconduite à la poterne (B-3 A), la sortie de la chapelle (B-3 B), Ysabeau (M-1), l’arrivée à l’atelier (B-5), la page d’Ysabeau (M-3).
- Nouvelles interactions : « Parler à Bastien » (B-4, B-6) et « S’approcher de la femme masquée » (M-2).
- Deux personnages de fête en plus : Mahaut et Gervais, masqués.
- Le carnet : une ligne pour le billet de M-2, distincte des feuillets.

Ce qui ne change pas : les quêtes, les feuillets, les joutes, les cônes des gardes, les collisions, la clé de sauvegarde, l’ouverture et la scène de la pierre.

---

## 7. À valider

1. Les répliques de Bastien (B-1 à B-6) vous conviennent-elles ?
2. La conséquence de la dénonciation sur la relation (confiance de départ à −1) vous paraît-elle juste ?
3. Le billet de la femme masquée, avec la citation « Soyez résolus de ne plus servir et vous voilà libres. » : est-ce trop tôt pour cette citation, que l’on garde aussi pour l’acte V ?
4. La réplique de Maëlle après la danse (« Il était beau, au moins ? ») : le ton est-il le bon pour vos élèves ?
