#!/bin/bash

echo "🚀 Travel Partner Finder Deployment Script"
echo "=========================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Initializing..."
    git init
    git add .
    git commit -m "Initial commit - Travel Partner Finder"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository found"
fi

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo "📝 Uncommitted changes found. Committing..."
    git add .
    git commit -m "Prepare for deployment - $(date)"
    echo "✅ Changes committed"
fi

echo ""
echo "📋 Deployment Checklist:"
echo "========================"
echo "1. ✅ Environment configuration files created"
echo "2. ✅ API configuration updated"
echo "3. ✅ CORS settings configured"
echo "4. ✅ Socket.io configuration updated"
echo "5. ✅ Build scripts ready"
echo ""

echo "🔧 Next Steps:"
echo "=============="
echo "1. Push your code to GitHub:"
echo "   git remote add origin https://github.com/yourusername/travel-partner-finder.git"
echo "   git push -u origin main"
echo ""
echo "2. Set up MongoDB Atlas:"
echo "   - Create cluster at https://www.mongodb.com/atlas"
echo "   - Get connection string"
echo ""
echo "3. Deploy Backend to Railway:"
echo "   - Go to https://railway.app"
echo "   - Connect GitHub repo"
echo "   - Set environment variables"
echo ""
echo "4. Deploy Frontend to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Connect GitHub repo"
echo "   - Set root directory to 'client'"
echo "   - Set environment variables"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "🎉 Your project is ready for deployment!"