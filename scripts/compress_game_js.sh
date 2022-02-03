#! /bin/bash

PROJECT_PATH=~/acapp/
JS_PATH=${PROJECT_PATH}game/static/js/
JS_PATH_DIST=${JS_PATH}dist/
JS_PATH_SRC=${JS_PATH}src/

# 将src中的js文件打包到dist中的game.js中
find $JS_PATH_SRC -type f -name '*.js' | sort | xargs cat | terser -c -m > ${JS_PATH_DIST}game.js

# 将game/static拷贝到主目录
echo yes | python3 ${PROJECT_PATH}manage.py collectstatic
