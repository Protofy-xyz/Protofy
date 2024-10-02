#!/bin/bash

DIRNAME="$(dirname "$0")"

# Wait 10 seconds before start
sleep 10

echo "Running start_project.sh..."
osascript -e "tell application \"Terminal\" to do script \"$DIRNAME/start_project.sh\""
echo "start_project.sh is now running on a new terminal."

# Ejecutar el script de initChrome
echo "Running init_chrome.sh..."
"$DIRNAME/init_chrome.sh"
echo "init_chrome.sh finished."