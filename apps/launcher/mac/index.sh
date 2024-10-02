#!/bin/bash

# Wait 10 seconds before start
sleep 10

echo "Running start_project.sh..."
osascript -e 'tell application "Terminal" to do script "/Users/miquelcos/Protofy/apps/launcher/mac/start_project.sh"'
echo "start_project.sh is now running on a new terminal."

# Ejecutar el script de initChrome
echo "Running init_chrome.sh..."
/Users/miquelcos/Protofy/apps/launcher/mac/init_chrome.sh
echo "init_chrome.sh finished."