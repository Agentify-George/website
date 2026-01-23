#!/bin/bash
# Inject API key into megan/index.html from environment variable

if [ -z "$AGENTIFY_API_KEY" ]; then
  echo "Warning: AGENTIFY_API_KEY environment variable not set"
  exit 0
fi

# Create a temporary script tag with the API key
SCRIPT_TAG="  <script>\n    window.AGENTIFY_API_KEY = '$AGENTIFY_API_KEY';\n  </script>"

# Insert the script tag before the React app script in megan/index.html
sed -i.bak "/<script type=\"module\" crossorigin src=\".\/assets\/index-/i\\
$SCRIPT_TAG
" megan/index.html

echo "✓ API key injected into megan/index.html"
