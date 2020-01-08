#!/bin/bash
source scripts/_utils.sh
set -e

title "Building src/player, src/options, and src/popup"

text "Compiling vue"
if [ "$1" == "debug" ]; then
    yarn vue-cli-service build
else 
    yarn vue-cli-service build > /dev/null
fi

text "Copying assets"
mkdir dist/img
if [ "$1" == "debug" ]; then
    cp -r src/pages/*/img/* dist/img
    # cp -r src/pages/options/img/* dist/img
    # cp -r src/pages/popup/img/* dist/img
else 
    cp -r src/pages/*/img/* dist/img > /dev/null
    # cp -r src/pages/options/img/* dist/img > /dev/null
    # cp -r src/pages/popup/img/* dist/img > /dev/null
fi

text "Cleaning dist/"
if [ "$1" == "debug" ]; then
    rm -f dist/player.html
    rm -f dist/options.html
    rm -f dist/popup.html
else 
    rm -f dist/player.html > /dev/null
    rm -f dist/options.html > /dev/null
    rm -f dist/popup.html > /dev/null
fi

echo -e "\x1B[0m"
