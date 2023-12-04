@echo off
SET "MODULES_VOLUME_NAME=protofy_modules"
SET "NEXT_VOLUME_NAME=protofy_next"

FOR /F "tokens=*" %%i IN ('docker volume ls -q') DO (
    IF "%%i"=="%MODULES_VOLUME_NAME%" SET "MODULES_EXISTS=YES"
    IF "%%i"=="%NEXT_VOLUME_NAME%" SET "NEXT_EXISTS=YES"
)

IF NOT DEFINED MODULES_EXISTS (
    echo Volume %MODULES_VOLUME_NAME% not found. Creating it...
    docker volume create %MODULES_VOLUME_NAME%
)

IF NOT DEFINED NEXT_EXISTS (
    echo Volume %NEXT_VOLUME_NAME% not found. Creating it...
    docker volume create %NEXT_VOLUME_NAME%
)

exit /b 0