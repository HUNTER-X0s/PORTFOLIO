@echo off
echo Starting all Anurag Portfolio services...

echo Starting Node.js Backend Server...
start "Backend Server" cmd /k "cd server && npm run dev || pause"

echo Starting Admin Dashboard (Next.js)...
start "Admin Dashboard" cmd /k "cd admin && npm run dev || pause"

echo Starting RAG AI Chatbot (Python FastAPI)...
start "RAG AI Chatbot" cmd /k "cd rag-chatbot && set PORT=10000 && python main.py || pause"

echo Starting Main Portfolio Frontend (Next.js)...
start "Portfolio Frontend" cmd /k "cd portfolio && npm run dev || pause"

echo.
echo All services are starting up in separate windows!
echo - Main Portfolio: http://localhost:3000
echo - Admin Dashboard: http://localhost:3001
echo - Node Backend: http://localhost:5000
echo - RAG AI Chatbot: http://localhost:10000
echo.
pause
