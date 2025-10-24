#!/bin/bash

# Course Planner Environment Setup Script
echo "🔧 Setting up Course Planner environment..."

# Create backend .env file if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend/.env file..."
    cat > backend/.env << EOF
# Google OAuth Configuration (replace with your actual credentials)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# JWT Secret (generate a random string for production)
JWT_SECRET=course_planner_jwt_secret_$(openssl rand -hex 32)

# Session Secret (generate a random string for production)
SESSION_SECRET=course_planner_session_secret_$(openssl rand -hex 32)

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Port
PORT=5001
EOF
    echo "✅ Created backend/.env file"
else
    echo "⚠️  backend/.env already exists"
fi

# Create frontend .env file if it doesn't exist
if [ ! -f "frontend/.env" ]; then
    echo "📝 Creating frontend/.env file..."
    cat > frontend/.env << EOF
# Backend API URL
REACT_APP_API_URL=http://localhost:5001
EOF
    echo "✅ Created frontend/.env file"
else
    echo "⚠️  frontend/.env already exists"
fi

echo ""
echo "🎉 Environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Follow the Google OAuth setup guide in GOOGLE_AUTH_SETUP.md"
echo "2. Replace the placeholder values in backend/.env with your actual Google OAuth credentials"
echo "3. Start the servers:"
echo "   Backend:  cd backend && npm start"
echo "   Frontend: cd frontend && npm start"
echo ""
echo "🌐 Your app will be available at: http://localhost:3000"
echo "🔧 Backend API will be available at: http://localhost:5001"
