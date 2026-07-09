#!/bin/bash
cd "$(dirname "$0")"

# Create venv if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate venv
source venv/bin/activate

# Install requirements if not installed
if ! python3 -c "import fastapi" 2>/dev/null; then
    echo "Installing dependencies..."
    pip install -q -r requirements.txt
fi

# Start the server
echo "Starting SmartLLM Cloud Backend on http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
