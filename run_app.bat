@echo off
echo ===================================================
echo   Starting ResQ Lanka (Full-Stack Disaster System)
echo   Backend:  FastAPI + MongoDB (Port 8000)
echo   Frontend: React (JS) + Vite (Port 5173)
echo ===================================================

echo [1/2] Launching FastAPI Backend...
start "ResQ Lanka - FastAPI Backend" cmd /k "cd backend && .\venv\Scripts\python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 2 >nul

echo [2/2] Launching React Frontend...
start "ResQ Lanka - React Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================
echo   Services running!
echo   Frontend: http://localhost:5173
echo   Backend Swagger API Docs: http://localhost:8000/docs
echo ===================================================
