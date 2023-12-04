@echo off

SET /P email=Enter email: 
SET /P password=Enter password: 
SET /P level=Enter level: 

FOR /F "tokens=*" %%i IN ('cd') DO SET currentDir=%%i
SET parentDir=%currentDir%\..

docker run -ti -v %parentDir%:/workspace -v protofy_modules:/workspace/node_modules --rm protofy/workspace -c "yarn add-user %email% %password% %level%"