const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { agentId } = JSON.parse(event.body);

    if (!agentId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Agent ID is required' })
      };
    }

    // Get Retell API key from environment variables
    const RETELL_API_KEY = process.env.RETELL_API_KEY;

    if (!RETELL_API_KEY) {
      console.error('RETELL_API_KEY not found in environment variables');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server configuration error' })
      };
    }

    // Call Retell API to get access token
    const response = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RETELL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: agentId,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Retell API error:', errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to create web call' })
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        accessToken: data.access_token,
        callId: data.call_id,
      })
    };

  } catch (error) {
    console.error('Error in get-retell-token function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
