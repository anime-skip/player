#!/bin/bash
rm -rf dist/*
./scripts/player-build.sh
./scripts/extension-build.sh
cd dist && web-ext run