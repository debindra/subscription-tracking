#!/bin/bash

# Subscription Tracker - Quick Start Script
# This script helps you get the application running quickly

echo "🚀 Starting Subscription Tracker..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if Redis is running
if ! command -v redis-cli &> /dev/null; then
    echo "⚠️  Redis is not installed. Installing Redis..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install redis
        brew services start redis
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update
        sudo apt-get install -y redis-server
        sudo systemctl start redis
    fi
fi

# Test Redis connection
if redis-cli ping &> /dev/null; then
    echo "✅ Redis is running"
else
    echo "⚠️  Starting Redis..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew services start redis
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo systemctl start redis
    fi
fi

# Check if dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env file not found!"
    echo "Please copy backend/.env.example to backend/.env and configure it."
    echo "See SETUP.md for detailed instructions."
    exit 1
fi

if [ ! -f "frontend/.env.local" ]; then
    echo "⚠️  Frontend .env.local file not found!"
    echo "Please copy frontend/.env.example to frontend/.env.local and configure it."
    echo "See SETUP.md for detailed instructions."
    exit 1
fi

echo ""
echo "✅ All checks passed!"
echo ""
echo "🔧 Starting services..."
echo ""

# Start backend in background
echo "🔴 Starting backend on http://localhost:3001"
cd backend && npm run start:dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 5

# Start frontend in background
echo "🟢 Starting frontend on http://localhost:3000"
cd frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Services started successfully!"
echo ""
echo "📊 Dashboard: http://localhost:3000"
echo "🔌 API: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for Ctrl+C
trap "echo ''; echo '🛑 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait

