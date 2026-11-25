#!/bin/bash
# Garde-fou avant commit : refuse un `git commit` si un fichier .json
# préparé (staged) n'est pas du JSON valide.
# Appelé par Claude Code (hook PreToolUse sur Bash) : la commande arrive
# en JSON sur l'entrée standard. Code 2 = commit refusé, le message va à Claude.

entree=$(cat)
commande=$(printf '%s' "$entree" | python3 -c 'import json,sys
try: print(json.load(sys.stdin).get("tool_input",{}).get("command",""))
except Exception: pass' 2>/dev/null)

# Rien à faire si ce n'est pas un commit.
printf '%s' "$commande" | grep -qE '(^|[;&|[:space:]])git[[:space:]].*commit' || exit 0

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
fichiers=$(git diff --cached --name-only --diff-filter=ACMR -- '*.json' 2>/dev/null)
[ -z "$fichiers" ] && exit 0

if ! command -v python3 >/dev/null 2>&1; then
    echo "Vérification JSON impossible : python3 est introuvable. Commit laissé passer sans contrôle." >&2
    exit 0
fi

mauvais=""
while IFS= read -r f; do
    [ -z "$f" ] && continue
    if ! git show ":$f" | python3 -c 'import json,sys; json.loads(sys.stdin.buffer.read().decode("utf-8-sig"))' 2>/dev/null; then
        mauvais="$mauvais$f"$'\n'
    fi
done <<< "$fichiers"

if [ -n "$mauvais" ]; then
    echo "COMMIT REFUSÉ : ces fichiers JSON ne sont pas valides :" >&2
    printf '%s' "$mauvais" | sed 's/^/  - /' >&2
    echo "Corrigez-les (virgule en trop, guillemet manquant…) puis recommencez le commit." >&2
    exit 2
fi
exit 0
