@echo off
REM Windows Quick Setup & Test Script for Portfolio

echo ================================
echo Portfolio Setup ^& Test
echo ================================

REM Step 1: Install dependencies
echo.
echo 📦 Installing dependencies...
call npm install
cd server
call npm install
cd ..

REM Step 2: Check .env.local
if not exist ".env.local" (
    echo.
    echo ⚠️  Missing .env.local file!
    echo Please create .env.local with:
    echo   VITE_SUPABASE_URL=your_url
    echo   VITE_SUPABASE_ANON_KEY=your_key
    echo.
    echo Continuing with development server...
)

REM Step 3: Run linter
echo.
echo ✅ Running linter...
call npm run lint

REM Step 4: Start dev server
echo.
echo 🚀 Starting development server...
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo.
echo Press Ctrl+C to stop
echo.

call npm run start-all
