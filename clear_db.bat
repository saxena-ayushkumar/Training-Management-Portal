@echo off
echo Clearing database tables...
echo.

REM Try different MySQL paths
set MYSQL_PATH=""
if exist "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" set MYSQL_PATH="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
if exist "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" set MYSQL_PATH="C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe"
if exist "C:\xampp\mysql\bin\mysql.exe" set MYSQL_PATH="C:\xampp\mysql\bin\mysql.exe"

if %MYSQL_PATH%=="" (
    echo MySQL not found in common locations.
    echo Please run the SQL commands manually in MySQL Workbench or command line:
    echo.
    type clear_database.sql
    pause
    exit /b 1
)

echo Using MySQL at: %MYSQL_PATH%
echo.

%MYSQL_PATH% -u root -payush trainer_app_db < clear_database.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Database cleared successfully!
) else (
    echo.
    echo Error clearing database. Please check your credentials and try again.
)

pause