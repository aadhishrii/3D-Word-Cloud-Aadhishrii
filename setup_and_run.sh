#!/usr/bin/env bash
set -e

BACKEND_DIR="Backend"
FRONTEND_DIR="Frontend"

echo "=== [1/4] Backend: creating / using virtual environment ==="

cd "$BACKEND_DIR"

# Create venv if it doesn't exist
if [ ! -d ".venv" ]; then
  echo "No .venv found. Creating a new virtual environment..."
  python3 -m venv .venv
fi

# Activate venv
# shellcheck disable=SC1091
source .venv/bin/activate

echo "Using Python: $(which python)"

echo "=== [2/4] Backend: installing dependencies ==="

if [ -f "requirements.txt" ]; then
  echo "Found requirements.txt, installing from it..."
  pip install --upgrade pip
  pip install -r requirements.txt
else
  echo "No requirements.txt found, installing core libraries directly..."
  pip install --upgrade pip
  pip install fastapi "uvicorn[standard]" requests beautifulsoup4 scikit-learn nltk
fi

cd ..

echo "=== [3/4] Frontend: installing dependencies ==="

cd "$FRONTEND_DIR"

if [ ! -d "node_modules" ]; then
  echo "node_modules not found. Running npm install..."
  npm install
else
  echo "node_modules already present. Skipping npm install."
fi

cd ..

echo "=== [4/4] Starting backend and frontend ==="

# Start backend in background
(
  cd "$BACKEND_DIR"
  # shellcheck disable=SC1091
  source .venv/bin/activate
  echo "Starting FastAPI backend on http://localhost:8000 ..."
  uvicorn app.main:app --reload --port 8000 --reload-exclude ".venv/*"
) &

BACKEND_PID=$!

# Start frontend in background
(
  cd "$FRONTEND_DIR"
  echo "Starting Vite frontend on http://localhost:5173 ..."
  npm run dev
) &

FRONTEND_PID=$!

echo ""
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Both servers are starting. Open http://localhost:5173 in your browser."
echo "Press Ctrl+C to stop."

# Wait for the background processes
wait
