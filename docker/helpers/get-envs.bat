@echo off

:: Loop through all arguments to check if --prod is present
set "DEV_MODE=true"
:loop
if "%~1"=="" goto endloop
if "%~1"=="--prod" (
  set "DEV_MODE=false"
  echo Running in production!
)
shift
goto loop
:endloop

set "SERVICES_COMPOSE_FILES="
set "DOCKER_COMPOSE_CMD=docker-compose"

:: Check if 'docker compose' is available
docker compose version >nul 2>&1
if %ERRORLEVEL% equ 0 set "DOCKER_COMPOSE_CMD=docker compose"


:: This script gets the docker.yml files and docker.dev.yml files
:: from each service inside "<root_project_dir>\apps"
:: If flag --prod is provided only returns docker.yml files

set "compose_files="
set "appsDir=..\apps\"
set "servicesDir="

for /d %%i in ("%appsDir%*") do (
  set "dir=%%i"
  :: Remove last backslash from dir
  set "dir=!dir:~0,-1!"

  :: Check if have docker.yml or docker.dev.yml
  if exist "!dir!\docker.yml" (
    set "compose_files=!compose_files! -f !dir!\docker.yml"
  )
  if "!DEV_MODE!"=="true" if exist "!dir!\docker.dev.yml" (
    set "compose_files=!compose_files! -f !dir!\docker.dev.yml"
  )
)

set "SERVICES_COMPOSE_FILES=!compose_files!"
