/**
 * Netlify Function: Log Retell Call Data
 * 
 * This function receives call analytics and logging data from the frontend.
 * It's part of the closed-loop lead intelligence system.
 */

exports.handler = async function (event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST' && event.httpMethod !== 'OPTIONS') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            }
        };
    }

    try {
        const data = JSON.parse(event.body);
        console.log('📊 Call Log Received:', {
            callId: data.callId,
            code: data.code,
            reason: data.reason,
            timestamp: data.timestamp,
            page: data.page
        });

        // TODO: Phase 3 - Implement Google Sheets logging here
        // This will involve using the googleapis npm package to append to the CRM sheet

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                success: true,
                message: 'Call data logged successfully',
                received_at: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('Error logging call data:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to log call data',
                message: error.message
            })
        };
    }
};
