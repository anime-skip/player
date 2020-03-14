#!/bin/bash
function title {
    echo -e "\x1B[34m\x1B[1m$1\x1b[0m"
}

function text {
    echo -e "\x1B[0m- $1\x1B[2m"
}