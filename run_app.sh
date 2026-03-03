#!/bin/bash
cd app || exit
echo "Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi
echo "Starting NoporSearch..."
npm run dev
