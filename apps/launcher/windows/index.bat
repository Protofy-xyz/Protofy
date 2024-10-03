@echo off
set DIRNAME=%~dp0

echo Running start_project.bat...
start "" cmd /k "%DIRNAME%\start_project.bat"
echo start_project.bat is now running in a new terminal.

REM Run the init_chrome.bat script
echo Running init_chrome.bat...
start "" cmd /k "%DIRNAME%\init_chrome.bat"
echo init_chrome.bat finished.