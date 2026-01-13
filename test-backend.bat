@echo off
echo Testing Backend Compilation...
cd backend
echo Compiling project...
call mvnw.cmd compile
if errorlevel 1 (
    echo Compilation failed!
    pause
    exit /b 1
)
echo Compilation successful!
echo.
echo Backend is ready to run.
echo Use 'mvnw.cmd spring-boot:run' to start the server.
pause