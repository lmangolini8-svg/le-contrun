# Sarlande • Vérifications de la copie de démonstration

Tests effectués sous Chromium avec WebGL via SwiftShader. L’horloge de simulation est pilotée à 60 pas par seconde pour reproduire les entrées et les sorties de scène. Les positions et les feuillets nécessaires aux cas de test sont initialisés en mémoire. Anselme et Garin sont abordés par le bouton du jeu, les répliques et les joutes par leurs choix normaux. Les mesures portent sur des images réellement rendues, avec cumul des passes par image, y compris les ombres lorsqu’elles sont rendues. Cette configuration logicielle ne mesure ni la cadence ni la latence tactile d’un iPad physique.

## Parcours et états

| Vérification | Résultat | Observation |
|---|---|---|
| Entrée depuis le titre | Réussi | Le bouton d’entrée déclenche l’ouverture 3D au quai. |
| Ouverture menée à son terme | Réussi | Contrôle rendu sur la place à l’étape 0. |
| Cônes après l’ouverture | Réussi | 3 cônes rouges, 81 rayons, dont 42 raccourcis par un obstacle. |
| Ouverture passée | Réussi | Même objectif initial sur la place. |
| Déplacement après « Passer » | Réussi | La position répond à une commande de marche dès la sortie. |
| Manche et première réplique | Réussi | La scène livre la réplique d’Anselme, puis attend l’élève. |
| Outil et annonce du tribut | Réussi | Le maître annonce le tiers après avoir posé son outil. |
| Deux réponses préservées | Réussi | Le choix de questionner le tribut et celui de partir restent proposés. |
| Branche de la question | Réussi | La question donne la réplique initiale du maître sur le danger de demander. |
| Premier feuillet et quête | Réussi | F1 est acquis une seule fois, la quête passe au percepteur. |
| Cônes après Anselme | Réussi | 3 cônes rouges, 81 rayons, dont 39 raccourcis par un obstacle. |
| Aperçu de la pierre, jusqu’au bout | Réussi | Retour au titre. Zéro écriture sur la clé de sauvegarde pendant la vitrine. |
| Aperçu de la pierre, passé | Réussi | Retour au titre. Zéro écriture sur la clé de sauvegarde pendant la vitrine. |
| Reprise après rechargement | Réussi | Même position, premier feuillet et objectif. Aucune nouvelle ouverture. |
| Manche passée | Réussi | La première réplique demeure accessible. |
| Outil passé | Réussi | La seconde réplique demeure accessible. |
| Branche de l’acquiescement | Réussi | La seconde réponse donne la réplique initiale sur le silence. |
| Pierre après les trois réponses, jusqu’au bout | Réussi | Le refus de Garin conduit à la pierre, puis à l’annonce de l’objectif vers Anselme. |
| Retour sur la place après la pierre, jusqu’au bout | Réussi | Position conservée sur la place, étape 5 enregistrée. |
| Cônes après la pierre, jusqu’au bout | Réussi | 3 cônes rouges, 81 rayons, dont 31 raccourcis par un obstacle. |
| Pierre après les trois réponses, passée | Réussi | Le refus de Garin conduit à la pierre, puis à l’annonce de l’objectif vers Anselme. |
| Retour sur la place après la pierre, passée | Réussi | Position conservée sur la place, étape 5 enregistrée. |
| Cônes après la pierre, passée | Réussi | 3 cônes rouges, 81 rayons, dont 29 raccourcis par un obstacle. |
| Chargement des ressources et exécution | Réussi | Aucune erreur JavaScript ou WebGL ni ressource manquante dans ce parcours. |

## Gestes tactiles et lecture

Essais sur le canvas du jeu, par événements tactiles du navigateur. Le premier trajet part de la sortie de l’ouverture. Pour le second, la position initiale est placée près des tonneaux ouest. L’approche, le demi-tour, le retour vers l’atelier et l’arrêt sont ensuite effectués au joystick. L’occlusion est mesurée depuis la caméra active par intersection avec la géométrie de la ville.

| Vérification | Résultat | Observation |
|---|---|---|
| Marche tactile vers l’enseigne | Réussi | Le glissement du doigt déplace Aliénor depuis le point initial et fait apparaître « Parler à Anselme ». |
| Dialogue en sourdine | Réussi | Première réplique entièrement dans l’écran, portrait d’Anselme chargé et son coupé par le bouton. Taille du texte de 21 pixels CSS en 1 024 × 768 et de 18 pixels CSS en 390 × 844. |
| Action et passage au toucher | Réussi | Le bouton tactile lance la rencontre et « Passer la scène » conserve la réplique. |
| Collision pendant un appui prolongé | Réussi | La limite à −22,4 reste en place. Aliénor s’arrête à −22,33 après deux secondes de marche. |
| Occlusion par un tonneau de la place | Réussi | Depuis la caméra de jeu, le rayon vers les bottes traverse d’abord le tonneau. Celui vers le visage reste dégagé. Approche au joystick après placement initial près des tonneaux ouest. |
| Demi-tour au joystick | Réussi | En inversant le glissement, Aliénor tourne de 180 degrés et repasse devant le tonneau. |
| Arrêt et retour à l’atelier | Réussi | Depuis les tonneaux ouest, retour auprès d’Anselme par glissements tactiles. Le relâchement du doigt immobilise Aliénor à portée de conversation. |

## Appels de dessin

Gabarit 1 024 × 768 pixels CSS, densité 1. Soixante images échantillonnées à des instants choisis dans la séquence et sur la place. Les intervalles indiquent les comptes minimum et maximum observés. Les deux qualités sont forcées dans l’onglet de test.

| Situation | Normal | Allégé |
|---|---:|---:|
| Ouverture du quai à la place | 43 à 93 (10 images) | 41 à 89 (10 images) |
| Place, devant l’atelier | 81 (1 image) | 82 (1 image) |
| Rencontre devant l’atelier | 58 à 67 (8 images) | 60 à 67 (6 images) |
| Pierre, depuis le titre | 43 à 63 (8 images) | 41 à 70 (8 images) |
| Place, vers le palais | 103 à 104 (2 images) | 99 à 101 (2 images) |
| Fête, vue libre vers les tréteaux | 182 à 192 (2 images) | 159 à 165 (2 images) |
