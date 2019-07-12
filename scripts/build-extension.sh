#!/bin/bash
set -e
rm -rf dist/*
yarn tsc --config tsconfig.extension.json
cp -a src/. dist
find ./dist -name '*.ts' -type f -delete
node refactor-ts.js",