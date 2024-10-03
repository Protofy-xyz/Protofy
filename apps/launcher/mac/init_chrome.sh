#!/bin/bash
LAUNCHER_DIR="$(dirname "$0")/.."

echo "Running Init Chrome..."
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --kiosk \
  --overscroll-history-navigation=0 \
  --disable-web-security \
  --disable-infobars \
  --no-sandbox \
  --disable-extensions \
  --start-fullscreen \
  --check-for-update-interval=1 \
  --simulate-critical-update \
  "file://$LAUNCHER_DIR/index.html"
echo "Google Chrome Initialized"