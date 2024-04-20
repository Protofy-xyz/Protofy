setlocal enabledelayedexpansion
CALL .\init.bat || (echo Failed to run init.bat & exit /b)
CALL .\build.bat || (echo Failed to run build.bat & exit /b)
CALL .\dev-service-fast.bat || (echo Failed to run dev-service-fast.bat & exit /b)