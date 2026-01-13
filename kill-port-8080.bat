@echo off
echo Checking port 8080...
netstat -ano | findstr :8080
echo.
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') do (
    echo Killing process %%a on port 8080...
    taskkill /PID %%a /F
)
echo Port 8080 is now free!
pause