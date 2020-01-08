#!/bin/bash
source scripts/_utils.sh
set -e
trap "pkill firefox && echo -e \"\x1B[0m\"" INT

echo "$1"

rm -rf dist/* &> /dev/null
./scripts/build-vue.sh "$1"
./scripts/build-extension.sh "$1"

title "Installing dist/"
text "web-ext run"
# --browser-console \
# about:debugging#/runtime/this-firefox
# https://vrv.co/watch/GYP5EVKGY/Demon-Slayer-Kimetsu-no-Yaiba:Against-Corps-Rules
function install() {
    eval "web-ext run \
        --start-url 'file://$(pwd)/example/index.html' \
        --source-dir ./dist \
        --firefox-profile=/home/aklinker1/.mozilla/firefox/dhrin1rt.default $1"
}
if [ "$1" == "debug" ]; then 
    install ""
else
    install "> /dev/null"
fi
echo -e "\x1B[0m"
