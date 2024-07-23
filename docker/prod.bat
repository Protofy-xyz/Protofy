setlocal enabledelayedexpansion
CALL .\helpers\get-envs.bat --prod || (echo Failed to run helpers\get-envs.bat & exit /b)
set SERVICE=false

:loop
if "%~1"=="" goto afterloop
if "%~1"=="--service" (
    set SERVICE=true
)
shift
goto loop
:afterloop


if "%SERVICE%"=="true" (
    set COMMAND=%DOCKER_COMPOSE_CMD% -p protofy %SERVICES_COMPOSE_FILES% up -d && call logs.bat
) else (
    set COMMAND=%DOCKER_COMPOSE_CMD% -p protofy %SERVICES_COMPOSE_FILES% up
)

echo Running as service: %SERVICE%
echo Executing command: %COMMAND%

CALL %COMMAND%

