@echo off
set DISPLAY=:0

REM Start script
echo "Init Chromium..."

REM Get the current directory and move one level up
set "CURRDIR=%cd%"
cd ..

REM Get the parent directory and form the new path
set "PARENTDIR=%cd%"
cd "%CURRDIR%"  REM Go back to the original directory

REM Build the new file path
set "HTML_PATH=file:///%PARENTDIR%\index.html"

echo %HTML_PATH%
REM Run Chromium
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --start-fullscreen --disable-pinch --overscroll-history-navigation=0 --disable-web-security --disable-session-crashed-bubble --test-type --incognito --disable-infobars --allow-file-access-from-files --user-data-dir="C:\Program Files\Google\chrome-win\chrome" --check-for-update-interval=1 --simulate-critical-update --kiosk "%HTML_PATH%"

echo "Chromium is now running"