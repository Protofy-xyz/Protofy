setlocal enabledelayedexpansion
docker build -f Dockerfile.prod -t protofy/protofy ../../
exit /b 0