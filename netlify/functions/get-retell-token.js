/**
 * Netlify Function: Generate Retell AI Access Token
 * 
 * This serverless function creates a secure access token for Retell AI web calls.
 * The token is generated server-side to keep your API key secure.
 * 
 * Setup:
 * 1. Add RETELL_API_KEY to your Netlify environment variables
 * 2. Deploy this function
 * 3. Function will be available at: /.netlify/functions/get-retell-token
 */

exports.handler = async function (event, context) {
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

    // Call Retell API to create web call
    const response = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RETELL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: agentId,
        // Optional: Add metadata for tracking
        metadata: {
          source: 'website',
          timestamp: new Date().toISOString()
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Retell API error:', errorData);
      throw new Error(`Retell API error: ${response.status}`);
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
        callId: data.call_id
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to generate access token',
        message: error.message
      })
    };
  }
};
