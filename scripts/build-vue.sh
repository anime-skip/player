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
if [ "$1" == "debug" ]; then
    yarn vue-cli-service build
else 
    yarn vue-cli-service build > /dev/null
fi

text "Copying assets"
if [ "$1" == "debug" ]; then
    cp -a src/pages/player/img/. dist/img
    cp -a src/pages/options/img/. dist/img
    cp -a src/pages/popup/img/. dist/img
else 
    cp -a src/pages/player/img/. dist/img > /dev/null
    cp -a src/pages/options/img/. dist/img > /dev/null
    cp -a src/pages/popup/img/. dist/img > /dev/null
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
