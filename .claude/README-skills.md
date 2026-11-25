# Skills de jeu vidéo (Claude Code Game Studios)

Copiés depuis https://github.com/Donchitos/Claude-Code-Game-Studios (licence MIT, voir LICENSE-claude-code-game-studios), commit abc0de79d6ceb0b5d7aa693945849b3937afbe6a.

Installés : skills/, agents/, et les dossiers dont ils dépendent (docs/, scripts/, rules/, engines/, genres/).
Volontairement non installés : hooks/, settings.json, statusline.sh et le CLAUDE.md du kit, pour ne pas modifier le comportement du projet Le Contrun.

Exemples : /help, /brainstorm, /prototype, /art-bible, /balance-check, /playtest-report, /team-audio, /team-narrative.

## Garde-fous du projet (`settings.json`)

Repris du kit, en version réduite :
- commandes refusées : suppressions massives (`rm -rf`…), `git push --force`, `git reset --hard`, `git clean -f`, `sudo`, `chmod 777`, lecture ou modification des fichiers `.env` ;
- `hooks/verifier-json.sh` (écrit pour Le Contrun) : refuse un commit si un fichier `.json` préparé n'est pas valide.
