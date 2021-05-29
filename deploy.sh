#!/usr/bin/env sh

# 当发生错误时中止脚本
set -e

# 构建
mkdir dist
cp index.html dist/
cp lastfm-export dist/ -r
cp ncmdaily dist/ -r

cd playlist-compare
yarn install
yarn run build
mv dist plscp
cp plscp ../dist -r

# cd 到构建输出的目录下 
cd ../dist

# 部署到自定义域域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 部署到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 部署到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:oldshensheep/toyweb.git master:gh-pages

cd -