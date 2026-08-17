#!/usr/bin/env bash
# push-updates.sh — publish the frontier-source pass II branch to GitHub.
#
# Usage:
#   ./push-updates.sh            # push the branch and open a PR (needs gh; falls back to compare URL)
#   ./push-updates.sh --to-main  # merge the branch into main locally and push main directly
#
# Requirements: git with push access to origin. `gh` (GitHub CLI, logged in) is
# used for the PR when available; without it the script prints the compare URL.
set -euo pipefail

BRANCH="frontier-source-pass-ii"
BASE="main"
REPO_SLUG="Samuele95/prometheus"

cd "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Sanity: right repo, branch exists, working tree clean.
git rev-parse --is-inside-work-tree >/dev/null
origin_url=$(git remote get-url origin)
case "$origin_url" in
  *"$REPO_SLUG"*) ;;
  *) echo "ERROR: origin is '$origin_url', expected $REPO_SLUG" >&2; exit 1 ;;
esac
git rev-parse --verify "$BRANCH" >/dev/null 2>&1 || {
  echo "ERROR: branch '$BRANCH' not found. Apply the pass-II patches first (git am 000*.patch)." >&2; exit 1; }
[ -z "$(git status --porcelain)" ] || {
  echo "ERROR: working tree not clean — commit or stash first." >&2; exit 1; }

echo "==> Commits to publish ($BASE..$BRANCH):"
git log --oneline "$BASE..$BRANCH" || true

if [ "${1:-}" = "--to-main" ]; then
  git checkout "$BASE"
  git merge --ff-only "$BRANCH" || {
    echo "ERROR: fast-forward merge failed — $BASE has diverged. Rebase '$BRANCH' onto $BASE and retry." >&2
    exit 1; }
  git push origin "$BASE"
  echo "==> Pushed $BASE to origin. Done."
  exit 0
fi

git push -u origin "$BRANCH"
echo "==> Branch pushed."

PR_TITLE="Frontier-source pass II: absorb eight Anthropic primaries (Aug 2026)"
PR_BODY=$(cat <<'EOF'
Incremental, non-destructive absorption of eight Anthropic primaries (four
claude.com/blog posts, four anthropic.com/research publications). Gap analysis
first: everything the earlier frontier pass already absorbed was verified
present and left byte-untouched.

Added (all source-backed, per CHANGELOG's per-task source map):
- Principle 10 — rationale extends the operator's reach (teaching-why)
- Principle 11 — suppression names, naming partially amplifies + workspace-capacity notes (global-workspace)
- Progressive disclosure, cross-layer redundancy, interface-design-as-operator, rich references (new-rules)
- Shape 1 trigger/stop taxonomy, deterministic stop conditions, interview q6 (loops)
- Delegation ladder in audit A (Cowork guide)
- Persistence / capability-prior correction long-horizon operator (Riemann zeta run)
- Topology 5 (swarm/shared-forum) + empirical multi-agent failure-mode catalog + five audit N checks (multiagent research)
- CITATIONS A2 section (research adapted across the training/inference boundary), CHANGELOG entry
- Gem mirror synced anchor-for-anchor; ship-manifest hashes regenerated; docs/prometheus-skill.zip rebuilt; README refreshed

Model-agnostic invariant held: vendor/model names only in CITATIONS, provenance,
and pre-existing per-runtime footnotes.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01L4NHs52AvJc95BjoRbNXwr
EOF
)

if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  gh pr create --repo "$REPO_SLUG" --base "$BASE" --head "$BRANCH" \
    --title "$PR_TITLE" --body "$PR_BODY" || true
  gh pr view --repo "$REPO_SLUG" --web 2>/dev/null || true
else
  echo "==> gh not available/authenticated — open the PR manually:"
  echo "    https://github.com/$REPO_SLUG/compare/$BASE...$BRANCH"
fi
