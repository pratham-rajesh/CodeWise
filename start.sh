#!/bin/bash

echo "🎯 Starting Pattern-Trainer Agent..."
echo "=================================="
echo ""
echo "Starting Express backend on http://localhost:3000"
echo "Starting Next.js frontend on http://localhost:3001"
echo ""
echo "Open your browser to: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start backend in background
npm run dev:server &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 2

# Start frontend
npm run dev:next &
FRONTEND_PID=$!

# Function to kill both processes on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up trap to catch Ctrl+C
trap cleanup INT TERM

# Wait for both processes
wait
