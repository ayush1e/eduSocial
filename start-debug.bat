@echo off
echo Starting React Application with Debug Information...
echo.

echo Checking Node.js version...
node --version
echo.

echo Checking npm version...
npm --version
echo.

echo Installing dependencies if needed...
npm install
echo.

echo Starting development server...
npm run dev

pause
