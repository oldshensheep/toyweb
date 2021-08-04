import os
import shutil

exclude_dirs = ['playlist-compare', '.github',
                '.git', '.idea', 'deploy.py', '.gitignore']

for root, dirs, files in os.walk('./'):
    os.mkdir('dist')
    files = set(dirs+files) - set(exclude_dirs)
    print(files)
    os.system('cd playlist-compare && yarn install && yarn run build')
    os.system('cd playlist-compare && mv dist plscp && cp plscp ../dist -r')
    for f in files:
        shutil.move(f, 'dist')
    break
