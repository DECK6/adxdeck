#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_root"

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  echo "Usage: ./blog/publish.sh [commit-message]"
  echo
  echo "Builds the blog, stages blog runtime and SEO assets, commits, and pushes the current branch."
  exit 0
fi

commit_message="${1:-feat: publish blog updates}"

if ! command -v node >/dev/null 2>&1; then
  echo "node is required to run blog/build.js"
  exit 1
fi

node blog/build.js

git add -A -- blog/posts blog/images blog/posts.json blog/index.html blog/post.html blog/blog.js blog/build.js blog/publish.sh blog/BLOG-GUIDE.md script.js sitemap.xml robots.txt

if git diff --cached --quiet; then
  echo "No blog publish changes to commit."
  exit 1
fi

git commit -m "$commit_message"

branch="$(git branch --show-current)"
git push -u origin "$branch"
