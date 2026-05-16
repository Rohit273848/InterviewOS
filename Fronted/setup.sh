#!/bin/bash

echo "🚀 InterviewOS Setup Script"
echo "============================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo "   This may take 2-3 minutes..."
echo ""

npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Installation complete!"
    echo ""
    echo "🎉 You're all set! Run the following command to start:"
    echo ""
    echo "   npm run dev"
    echo ""
    echo "Then open http://localhost:5173 in your browser"
    echo ""
else
    echo ""
    echo "❌ Installation failed. Please check the errors above."
    exit 1
fi
