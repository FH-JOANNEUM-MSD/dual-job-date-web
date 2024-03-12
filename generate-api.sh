#!/bin/sh

TARGET_DIR="./generated-api"
OPENAPI_GENERATOR_CLI="./node_modules/.bin/openapi-generator-cli"

set -e

rm -rf $TARGET_DIR/*
echo "F"
$OPENAPI_GENERATOR_CLI generate
echo "A"
find $TARGET_DIR -mindepth 1 ! -regex '^'$TARGET_DIR'/model\(/.*\)?' ! -regex '^'$TARGET_DIR'/api\(/.*\)?' -delete
