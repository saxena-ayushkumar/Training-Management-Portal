@echo off
echo Starting Training Management System Backend...
echo.
cd /d "%~dp0backend"

echo Checking if JAR exists...
if not exist "target\trainer-app-backend-1.0.0.jar" (
    echo JAR file not found. Building project...
    call mvnw.cmd clean package -DskipTests
    if errorlevel 1 (
        echo Build failed!
        pause
        exit /b 1
    )
)

echo Starting backend server on port 8080...
java -jar target/trainer-app-backend-1.0.0.jar
pause