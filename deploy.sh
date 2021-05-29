#!/usr/bin/env sh

# 当发生错误时中止脚本
set -e

# 构建
mkdir dist
cp index.html dist/
cp 404.html dist/
cp lastfm-export dist/ -r
cp ncmdaily dist/ -r

cd playlist-compare
yarn install
yarn run build
mv dist plscp
cp plscp ../dist -r
