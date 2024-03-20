CALL .\helpers\get-envs.bat --prod || (echo Failed to run helpers\get-envs.bat & exit /b)
%DOCKER_COMPOSE_CMD% -p protofy %SERVICES_COMPOSE_FILES% up