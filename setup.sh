#!/bin/bash
# Quick Setup & Test Script for Portfolio

echo "================================"
echo "Portfolio Setup & Test"
echo "================================"

# Step 1: Install dependencies
echo -e "\n📦 Installing dependencies..."
npm install
cd server && npm install && cd ..

# Step 2: Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo -e "\n⚠️  Missing .env.local file!"
    echo "Please create .env.local with:"
    echo "  VITE_SUPABASE_URL=your_url"
    echo "  VITE_SUPABASE_ANON_KEY=your_key"
    echo -e "\nContinuing with development server..."
fi

# Step 3: Run tests
echo -e "\n✅ Running linter..."
npm run lint

# Step 4: Start dev server
echo -e "\n🚀 Starting development server..."
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:5000"
echo -e "\nPress Ctrl+C to stop\n"

npm run start-all
