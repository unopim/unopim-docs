#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run docs:build

# navigate into the build output directory
cd .vitepress/dist

echo 'devdocs.unopim.com' > CNAME

# skip Jekyll on GitHub Pages — without this the legacy build fails
touch .nojekyll

git init
git add -A
git commit -m 'Deploy docs to GitHub gh-pages'
git push -f git@github.com:unopim/unopim-docs.git master:gh-pages

cd -
