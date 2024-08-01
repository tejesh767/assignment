#!/usr/bin/env bash
# Install dependencies
npm install

# Rebuild sqlite3
npm rebuild sqlite3 --build-from-source

# Run your start script
npm start
