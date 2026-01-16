@echo off
echo Starting Training Management Portal...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && mvn spring-boot:run"

timeout /t 10 /nobreak

echo Starting Frontend Server...
start "Frontend Server" cmd /k "npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo.
pause
