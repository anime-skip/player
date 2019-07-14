#!/bin/bash
set -e
function title {
    echo -e "\x1B[34m\x1B[1m$1\x1b[0m"
}
function text {
    echo -e "\x1B[0m- $1\x1B[2m"
}
echo ""

rm -rf dist/* &> /dev/null
./scripts/build-vue.sh
./scripts/build-extension.sh

title "Installing dist/"
text "web-ext run"
web-ext run \
    --browser-console \
    --start-url "./example/index.html" \
    --source-dir ./dist > /dev/null &
PID=$!
sleep 2
kill -9 $PID &> /dev/null

echo -e "\x1B[0m"
