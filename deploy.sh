#!/bin/bash

# 🚀 Easy Deployment Script for Course Planner
echo "🚀 Course Planner Deployment Helper"
echo "=================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📝 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit: Course Planner with authentication"
    echo "✅ Git repository initialized!"
else
    echo "📝 Committing latest changes..."
    git add .
    git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "✅ Changes committed!"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Push to GitHub:"
echo "   git remote add origin https://github.com/yourusername/CoursePlanner.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "2. Deploy Backend to Railway:"
echo "   • Go to railway.app"
echo "   • Create new project from GitHub repo"
echo "   • Set root directory to 'backend'"
echo "   • Add environment variables (see EASY_DEPLOYMENT_GUIDE.md)"
echo ""
echo "3. Deploy Frontend to Vercel:"
echo "   • Go to vercel.com"
echo "   • Import GitHub repo"
echo "   • Set root directory to 'frontend'"
echo "   • Add REACT_APP_API_URL environment variable"
echo ""
echo "📖 Full guide: EASY_DEPLOYMENT_GUIDE.md"
echo "🎉 Your app will be live in minutes!"
