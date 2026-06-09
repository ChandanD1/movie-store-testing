#!/bin/bash

# Movie Store Setup Script
# This script helps set up and launch the Movie Store application

echo "🎬 Movie Store Setup Script"
echo "=========================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    print_error "Homebrew is not installed. Please install Homebrew first:"
    echo "  /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    exit 1
fi

print_success "Homebrew is installed"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_warning "Node.js is not installed. Installing Node.js..."
    brew install node
else
    print_success "Node.js is installed: $(node --version)"
fi

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    print_warning "MongoDB is not installed. Installing MongoDB..."
    brew tap mongodb/brew
    brew install mongodb-community
else
    print_success "MongoDB is installed"
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    print_warning "MongoDB is not running. Starting MongoDB..."
    brew services start mongodb-community
    sleep 3
    if pgrep -x "mongod" > /dev/null; then
        print_success "MongoDB started successfully"
    else
        print_error "Failed to start MongoDB. Please start it manually:"
        echo "  brew services start mongodb-community"
        exit 1
    fi
else
    print_success "MongoDB is already running"
fi

# Navigate to backend directory
cd "$(dirname "$0")/backend"

# Install backend dependencies
print_warning "Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_success "Backend dependencies installed"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Check if port 8080 is in use
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    print_warning "Port 8080 is already in use. Killing the process..."
    lsof -ti:8080 | xargs kill -9
    sleep 2
fi

# Start the application
echo ""
print_success "Starting Movie Store backend API..."
echo ""
echo "=========================================================="
echo "🎬 Movie Store Backend API is starting..."
echo "=========================================================="
echo ""
echo "Backend API will be listening at: http://localhost:8080"
echo "Note: Remember to start the frontend React application in"
echo "      a separate terminal: cd frontend && npm run dev"
echo "      The frontend will be available at: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop the backend server"
echo ""

# Start the server
npm start

# Note: The script will wait here until the server is stopped
