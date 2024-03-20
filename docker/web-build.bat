@echo off
CALL .\helpers\get-envs.bat || (echo Failed to run helpers\get-envs.bat & exit /b)
CALL .\init.bat || (echo Failed to run init.bat & exit /b)
CALL .\build.bat || (echo Failed to run build.bat & exit /b)

%DOCKER_COMPOSE_CMD% -f web-build.yml  up