#!/bin/bash

# Test script to demonstrate how to run with Google OAuth credentials
# Replace these with your actual Google OAuth credentials from Google Cloud Console

echo "🧪 Testing backend with Google OAuth credentials..."
echo "⚠️  Note: Replace these with your actual credentials from Google Cloud Console"
echo ""

# Kill existing backend
pkill -f "node.*server.js" 2>/dev/null || true

# Start backend with Google OAuth credentials
cd backend && \
GOOGLE_CLIENT_ID="your_actual_google_client_id_here" \
GOOGLE_CLIENT_SECRET="your_actual_google_client_secret_here" \
JWT_SECRET="test_jwt_secret_for_development" \
SESSION_SECRET="test_session_secret_for_development" \
FRONTEND_URL="http://localhost:3000" \
PORT=5001 \
npm start &

# Wait for server to start
sleep 3

echo "Testing endpoints..."
echo ""

# Test health endpoint
echo "🔍 Health check:"
curl -s http://localhost:5001/api/health
echo ""
echo ""

# Test Google auth endpoint
echo "🔍 Google auth endpoint:"
curl -s http://localhost:5001/auth/google
echo ""
echo ""

# Test courses endpoint
echo "🔍 Courses endpoint (first 200 chars):"
curl -s http://localhost:5001/api/courses | head -c 200
echo ""
echo ""

echo "✅ Backend is running on http://localhost:5001"
echo "🌐 Frontend should be accessible at http://localhost:3000"
echo ""
echo "📋 To set up real Google OAuth:"
echo "1. Go to https://console.cloud.google.com/"
echo "2. Create a new project or select existing"
echo "3. Enable Google+ API"
echo "4. Create OAuth 2.0 credentials"
echo "5. Replace the placeholder values above with real credentials"
