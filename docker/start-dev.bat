@echo off
setlocal enabledelayedexpansion
CALL .\init.bat || (echo Failed to run init.bat & exit /b)
CALL .\build.bat || (echo Failed to run build.bat & exit /b)
CALL .\start-dev-fast.bat || (echo Failed to run start-dev-fast.bat & exit /b)