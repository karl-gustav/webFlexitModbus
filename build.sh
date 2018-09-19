#!/bin/bash

set -e

if [ -d dist/ ] ; then
    rm -rf dist/
fi

mkdir dist/

GOOS=linux GOARCH=arm GOARM=6 go build -o dist/flexit_web.new webFlexitModbus.go

cp -r *.html *.css *.js *.service dist/
