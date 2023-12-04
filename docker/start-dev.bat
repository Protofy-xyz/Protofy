@echo off

CALL .\init.bat || (echo Failed to run init.bat & exit /b)
CALL .\build.bat || (echo Failed to run build.bat & exit /b)

docker-compose -p protofy -f ..\apps\admin-api\docker.yml -f ..\apps\admin-api\docker.dev.yml -f ..\apps\api\docker.yml -f ..\apps\api\docker.dev.yml -f ..\apps\next\docker.yml -f ..\apps\next\docker.dev.yml -f ..\apps\proxy\docker.yml -f ..\apps\proxy\docker.dev.yml up