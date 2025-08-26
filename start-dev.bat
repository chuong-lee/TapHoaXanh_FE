@echo off
echo Starting Tap Hoa Xanh Development Environment...
echo.

echo Starting Frontend (Next.js) on port 3000...
start "Frontend" cmd /k "npm run dev"

echo.
echo Starting Backend (NestJS) on port 3001...
cd ../TapHoaXanh_BE
start "Backend" cmd /k "npm run start:dev"

echo.
echo Development servers are starting...
echo Frontend: http://localhost:3000
echo Backend: http://localhost:3001
echo.
pause
