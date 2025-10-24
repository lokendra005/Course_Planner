#!/bin/bash

# 🔐 Generate Production Secrets
echo "🔐 Generating Production Secrets"
echo "==============================="

# Generate JWT Secret
JWT_SECRET=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-64)
echo "JWT_SECRET=$JWT_SECRET"

# Generate Session Secret  
SESSION_SECRET=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-64)
echo "SESSION_SECRET=$SESSION_SECRET"

echo ""
echo "🎯 Copy these to your Railway environment variables:"
echo "JWT_SECRET=$JWT_SECRET"
echo "SESSION_SECRET=$SESSION_SECRET"
echo "FRONTEND_URL=https://your-app-name.vercel.app"
echo "NODE_ENV=production"

echo ""
echo "🎯 Copy this to your Vercel environment variables:"
echo "REACT_APP_API_URL=https://your-backend-name.railway.app"

echo ""
echo "⚠️  Keep these secrets safe and never commit them to git!"
