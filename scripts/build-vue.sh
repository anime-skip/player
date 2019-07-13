#!/bin/bash
set -e
function title {
    echo -e "\x1B[34m\x1B[1m$1\x1b[0m"
}
function text {
    echo -e "\x1B[0m- $1\x1B[2m"
}

title "Building src/player, src/options, and src/popup"

text "Compiling vue"
yarn vue-cli-service build > /dev/null

text "Copying assets"
cp -a src/pages/player/img/. dist/img > /dev/null
cp -a src/pages/options/img/. dist/img > /dev/null
cp -a src/pages/options/img/. dist/img > /dev/null

text "Cleaning dist/"
rm -f dist/player.html > /dev/null
rm -f dist/options.html > /dev/null
rm -f dist/popup.html > /dev/null

echo -e "\x1B[0m"
