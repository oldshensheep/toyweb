import os
import shutil

exclude_dirs = ['.github',
                '.git', '.idea', 'deploy.py', '.gitignore']

for root, dirs, files in os.walk('./'):
    os.mkdir('dist')
    files = set(dirs+files) - set(exclude_dirs)
    print(files)
    for f in files:
        shutil.move(f, 'dist')
    break
