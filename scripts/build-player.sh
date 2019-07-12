#!/bin/bash
yarn vue-cli-service build

# Rename Output
rm -f dist/js/*.js.map
rm -f dist/index.html