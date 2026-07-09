#!/bin/bash

# SmartLLM Cloud Backend Startup Script

echo "🚀 Starting SmartLLM Cloud Backend..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from .env.example..."
    cp .env.example .env
    echo "✏️  Please update .env with your configuration"
fi

# Check Python version
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "✓ Python version: $python_version"

# Create virtual environment if not exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "📦 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📚 Installing dependencies..."
pip install -q -r requirements.txt

# Check for database
echo "🗄️  Checking database..."
if command -v psql &> /dev/null; then
    echo "✓ PostgreSQL client found"
else
    echo "⚠️  PostgreSQL client not found. Install postgresql-client to use local databases"
fi

# Start with Docker Compose or local server
if [ "$1" == "docker" ]; then
    echo "🐳 Starting with Docker Compose..."
    docker-compose up -d
    echo "✓ Services starting..."
    echo "   API: http://localhost:8000"
    echo "   Docs: http://localhost:8000/docs"
    echo "   PostgreSQL: localhost:5432"
    echo "   Redis: localhost:6379"
    sleep 5
    docker-compose logs -f
else
    echo "🔧 Starting FastAPI server..."
    echo "📡 API available at: http://localhost:8000"
    echo "📚 Docs available at: http://localhost:8000/docs"
    echo "🔄 Auto-reload enabled"
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
fi
