@echo off
title CareerAI Hub Starter
echo ===================================================
echo             CAREERAI HUB - START SCRIPT
echo ===================================================
echo.
echo [1/3] Starting local server in a new window...
start "CareerAI Hub Server" cmd /c "npm run dev"

echo.
echo [2/3] Waiting 5 seconds for the server to initialize...
timeout /t 5 /nobreak >nul

echo.
echo [3/3] Launching websites in your default browser...
echo -> Opening Main Website: http://localhost:3000
start http://localhost:3000

echo -> Opening Database Site: http://localhost/phpmyadmin
start http://localhost/phpmyadmin

echo.
echo ===================================================
echo Server is running! Keep this window open if you want
echo to monitor logs or shut down the server later.
echo ===================================================
echo.
echo Press any key to exit this helper window (the server will keep running).
pause >nul
