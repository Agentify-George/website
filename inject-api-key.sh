#!/bin/bash
# Inject API key into megan/index.html from Netlify environment variable

if [ -z "$AGENTIFY_API_KEY" ]; then
  echo "⚠️  Warning: AGENTIFY_API_KEY environment variable not set"
  echo "The voice agent will not work without an API key"
  exit 0
fi

# Replace the placeholder with the actual API key
sed -i.bak "s/__AGENTIFY_API_KEY__/$AGENTIFY_API_KEY/g" megan/index.html

# Clean up backup file
rm -f megan/index.html.bak

echo "✅ API key injected into megan/index.html"
