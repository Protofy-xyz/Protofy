CALL .\helpers\get-envs.bat

docker build -t protofy/workspace . && %DOCKER_COMPOSE_CMD% -f build.yml up
exit /b 0