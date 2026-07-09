#!/bin/bash

# SmartLLM Cloud - Startup Script
# This script starts both the backend and frontend servers

set -e

echo "========================================"
echo "SmartLLM Cloud - Starting Services"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed. Please install Python 3.9+ first."
    exit 1
fi

# Install backend dependencies if not done
if [ ! -d "backend/venv" ]; then
    echo -e "${BLUE}Setting up backend virtual environment...${NC}"
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
    echo -e "${GREEN}Backend dependencies installed${NC}"
fi

# Install frontend dependencies if not done
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}Installing frontend dependencies...${NC}"
    pnpm install
    echo -e "${GREEN}Frontend dependencies installed${NC}"
fi

echo ""
echo -e "${BLUE}Starting backend server...${NC}"
echo "Backend will run on: http://localhost:8000"
echo "API docs available at: http://localhost:8000/docs"
echo ""

# Start backend in background
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

sleep 2

echo ""
echo -e "${BLUE}Starting frontend server...${NC}"
echo "Frontend will run on: http://localhost:3000"
echo ""

# Start frontend
pnpm dev &
FRONTEND_PID=$!

echo ""
echo -e "${GREEN}========================================"
echo "Services started successfully!"
echo "========================================"
echo ""
echo -e "Frontend:  ${BLUE}http://localhost:3000${NC}"
echo -e "Backend:   ${BLUE}http://localhost:8000${NC}"
echo -e "API Docs:  ${BLUE}http://localhost:8000/docs${NC}"
echo ""
echo "Demo Credentials:"
echo "  Email: demo@smartllm.ai"
echo "  Password: demo123"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "========================================"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
