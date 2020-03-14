#!/bin/bash
source scripts/_utils.sh
set -e

title "Building src/extension"

text "Compiling typescript"
if [ "$1" == "debug" ]; then
    yarn tsc -p tsconfig-extension.json
else
    yarn tsc -p tsconfig-extension.json > /dev/null
fi

text "Copying assets"
if [ "$1" == "debug" ]; then
    cp -a src/extension/. dist
else
    cp -a src/extension/. dist > /dev/null
fi

text "Cleaning dist/"
if [ "$1" == "debug" ]; then
    find ./dist -name '*.ts' -type f -delete
    node scripts/refactor-extension-ts.js
else
    find ./dist -name '*.ts' -type f -delete > /dev/null
    node scripts/refactor-extension-ts.js > /dev/null
fi

echo -e "\x1B[0m"
