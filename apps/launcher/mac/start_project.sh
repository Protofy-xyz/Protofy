#!/bin/bash

ROOT_DIR="$(dirname "$0")/../../.."

# Change to project directory
cd $ROOT_DIR

echo "Running yarn start..."
/usr/local/bin/yarn start   # Make sure yarn is in the correct path
echo "yarn start finished"