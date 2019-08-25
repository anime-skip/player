#!/bin/bash
set -e
trap "pkill firefox && echo -e \"\x1B[0m\"" INT

function title {
    echo -e "\x1B[34m\x1B[1m$1\x1b[0m"
}
function text {
    echo -e "\x1B[0m- $1\x1B[2m"
}
echo "$1"

rm -rf dist/* &> /dev/null
./scripts/build-vue.sh "$1"
./scripts/build-extension.sh "$1"

title "Installing dist/"
text "web-ext run"
# --browser-console \
# https://vrv.co/watch/GYP5EVKGY/Demon-Slayer-Kimetsu-no-Yaiba:Against-Corps-Rules
# file:///media/aklinker1/External%20Storage/Programming/full-stack/anime-skip/web-extension/example/index.html
web-ext run \
    --start-url "file:///media/aklinker1/External%20Storage/Programming/full-stack/anime-skip/web-extension/example/index.html" \
    --source-dir ./dist \
    --firefox-profile=/home/aklinker1/.mozilla/firefox/dhrin1rt.default > /dev/null

echo -e "\x1B[0m"
