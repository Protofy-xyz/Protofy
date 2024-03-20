@echo off
setlocal enabledelayedexpansion
CALL .\helpers\get-envs.bat || (echo Failed to run helpers\get-envs.bat & exit /b)
CALL .\init.bat || (echo Failed to run init.bat & exit /b)
CALL .\build.bat || (echo Failed to run build.bat & exit /b)

echo Docker compose command: %DOCKER_COMPOSE_CMD%
echo Compose files: %SERVICES_COMPOSE_FILES%

%DOCKER_COMPOSE_CMD% -p protofy %SERVICES_COMPOSE_FILES% up
