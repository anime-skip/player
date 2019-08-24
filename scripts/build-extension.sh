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
