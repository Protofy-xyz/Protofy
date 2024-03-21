setlocal enabledelayedexpansion
CALL .\init.bat || (echo Failed to run init.bat & exit /b)
CALL .\build.bat || (echo Failed to run build.bat & exit /b)
CALL .\dev-fast.bat || (echo Failed to run dev-fast.bat & exit /b)