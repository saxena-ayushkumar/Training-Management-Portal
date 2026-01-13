@echo off
echo ========================================
echo Training Management System Startup
echo ========================================
echo.

echo 1. Make sure MySQL is running with database 'trainer_app_db'
echo 2. Backend will start on http://localhost:8080
echo 3. Frontend will start on http://localhost:3000
echo.

set /p choice="Press Enter to continue or 'q' to quit: "
if /i "%choice%"=="q" exit /b

echo.
echo Starting backend...
start "Backend" cmd /k "cd backend && mvnw.cmd spring-boot:run"

timeout /t 5 /nobreak > nul

echo Starting frontend...
start "Frontend" cmd /k "npm start"

echo.
echo Both services are starting...
echo Check the opened windows for status.
pause