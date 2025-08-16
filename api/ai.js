// API proxy function for Vercel/Netlify serverless deployment
// This file should be placed in /api/ai.ts (for Vercel) or /functions/api/ai.ts (for Netlify)

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Provider');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const body = req.body;
    const provider = req.headers['x-provider'] || 'deepseek';

    // Get API key from environment variables
    const apiKey = provider === 'openai'
      ? process.env.OPENAI_API_KEY
      : process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: `API key for ${provider} not configured on server`
      });
    }

    // Determine endpoint based on provider
    const endpoint = provider === 'openai'
      ? 'https://api.openai.com/v1/chat/completions'
      : 'https://api.deepseek.com/chat/completions';

    // Forward the request to the API provider
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(body),
      // Set a server-side timeout
      signal: AbortSignal.timeout(18000) // 18 seconds (to leave buffer for our 20s client timeout)
    });

    // Get response data
    const data = await response.json();

    // Return the response
    return res.status(response.status).json(data);
  } catch (error) {
    // Handle timeout errors
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      return res.status(504).json({ error: 'Request timed out' });
    }

    console.error('API proxy error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
