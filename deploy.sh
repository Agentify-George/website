#!/bin/bash

# Agentify Voice Agent - Quick Deploy Script
# This script deploys the simplified voice agent to Netlify

echo "🚀 Deploying Agentify Voice Agent..."
echo ""

# Check if we're in the right directory
if [ ! -f "voice-agent-simple.html" ]; then
    echo "❌ Error: voice-agent-simple.html not found"
    echo "Please run this script from the Agentify Website directory"
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Not a git repository"
    echo "Please initialize git first"
    exit 1
fi

# Show what will be committed
echo "📦 Files to be deployed:"
git status --short
echo ""

# Ask for confirmation
read -p "Deploy these changes? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

# Add all files
echo "📝 Staging files..."
git add .

# Commit
echo "💾 Committing changes..."
git commit -m "Add simplified voice agent - production ready"

# Push
echo "🚀 Pushing to remote..."
git push

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "Next steps:"
echo "1. Wait 1-2 minutes for Netlify to deploy"
echo "2. Go to https://weareagentify.ai"
echo "3. Click 'Try Our Voice Agent' button"
echo "4. Test the voice interface"
echo ""
echo "📖 See VOICE_AGENT_SETUP.md for full setup instructions"
