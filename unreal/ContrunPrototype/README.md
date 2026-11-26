# Le Contr’un sur Windows

Ce prototype Unreal Engine 5.7 permet de parcourir un premier secteur de Sarlande, du clos à l’atelier d’imprimerie en passant par la rue des Drapiers. Il reprend le tracé de l’atlas, le modèle Meshy d’Aliénor, des façades et des pistes audio du jeu. Le script de préparation reconstruit deux boucles de déplacement pour le squelette d’Aliénor à partir de son modèle.

## Préparer le PC

- Installer [Unreal Engine 5.7 dans Epic Games Launcher](https://www.unrealengine.com/download).
- Installer Visual Studio 2022 avec la charge de travail **Développement de jeux en C++**, MSVC v143 et le SDK Windows. Epic recommande Visual Studio 17.14, MSVC 14.44.35214 et le SDK 10.0.22621.0 pour cette version. [Prérequis Unreal Engine 5.7](https://dev.epicgames.com/documentation/en-us/unreal-engine/setting-up-visual-studio-development-environment-for-cplusplus-projects-in-unreal-engine?application_version=5.7)
- Installer Git, Node.js LTS, Blender 4.3 ou 4.5 et FFmpeg. Ouvrir un nouveau PowerShell après l’installation. `git`, `node` et `ffmpeg` doivent être accessibles depuis ce terminal. Le chemin de Blender peut être passé au script avec `-BlenderExe`.

## Construire le jeu

Dans PowerShell, récupérer les dossiers utilisés par le prototype.

```powershell
git clone --filter=blob:none --sparse --branch codex/prototype-ue5-windows https://github.com/lmangolini8-svg/le-contrun.git
Set-Location le-contrun
git sparse-checkout set jeu modeles son unreal
```

Depuis la racine du dépôt, lancer la compilation. Adapter le chemin de Blender à l’installation locale.

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\unreal\ContrunPrototype\Tools\Build-Windows.ps1 `
  -EngineRoot "C:\Program Files\Epic Games\UE_5.7" `
  -BlenderExe "C:\Program Files\Blender Foundation\Blender 4.5\blender.exe"
```

Le script prépare les ressources, compile le module C++, crée la carte dans l’éditeur et prépare la version Windows sous `unreal/ContrunPrototype/Build/Windows/`. Il affiche le chemin de `ContrunPrototype.exe` quand les fichiers du jeu sont présents. Pour faire essayer le jeu sur un autre PC, transmettre le dossier de la version Windows en entier. Pour retravailler la scène, ouvrir `ContrunPrototype.uproject` dans l’éditeur, puis la carte `Sarlande/Cartes/ClosImprimerie` dans le navigateur de contenu.

Pour vérifier seulement la conversion des modèles, du relief et du son, utiliser `-PrepareOnly`. Cette étape s’exécute aussi sur Linux avec `node unreal/ContrunPrototype/Tools/prepare_assets.js`.

## Première partie sur le Zenbook Duo

1. Brancher le PC et jouer sur un seul écran. La première configuration vise 30 images par seconde en fenêtre à 1920 × 1200, avec une échelle de rendu de 85 %.
2. Traverser le clos et la rue des Drapiers avec **ZQSD**, **WASD** ou les flèches. La souris tourne la caméra et **Maj** accélère. Vérifier la vitesse de marche, la caméra dans les passages étroits et le contact des pieds d’Aliénor avec le sol.
3. Entrer dans l’atelier, dialoguer avec Anselme, puis ressortir avec **E**. **Échap** ferme le dialogue. Vérifier que le retour se fait près de la porte et que les ambiances changent au passage.
4. Mesurer les images par seconde dans la rue et dans l’atelier sur le `.exe`, par exemple avec le widget Performances de la Xbox Game Bar (**Win + G**). Si 30 images par seconde ne tiennent pas, refaire le même trajet à 1280 × 800 avec `-ResX=1280 -ResY=800 -WINDOWED` et relever le résultat.

La version Windows et la fluidité restent à vérifier sur le Zenbook.
