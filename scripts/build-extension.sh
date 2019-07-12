#!/bin/bash
set -e
function title {
    echo -e "\x1B[34m\x1B[1m$1\x1b[0m"
}
function text {
    echo -e "\x1B[0m- $1\x1B[2m"
}

title "Building src/extension"

text "Compiling typescript"
yarn tsc -p tsconfig-extension.json > /dev/null

text "Copying assets"
cp -a src/extension/. dist > /dev/null

text "Cleaning dist/"
find ./dist -name '*.ts' -type f -delete > /dev/null
node scripts/refactor-extension-ts.js > /dev/null

echo -e "\x1B[0m"
