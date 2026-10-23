// Vercel Serverless Function: Secure Vapi Recording Fetcher
// Keeps VAPI_PRIVATE_KEY strictly on the server so it is NEVER exposed in the client browser.

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  const privateKey =
    process.env.VAPI_PRIVATE_KEY ||
    process.env.VITE_VAPI_PRIVATE_KEY;

  if (!privateKey) {
    return res.status(500).json({
      error: 'VAPI_PRIVATE_KEY is not configured in Vercel environment variables.',
    });
  }

  const { callId } = req.query || {};

  if (!callId) {
    return res.status(400).json({ error: 'callId query parameter is required.' });
  }

  const maxRetries = 5;
  const pollIntervalMs = 3000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await new Promise((r) => setTimeout(r, pollIntervalMs));

      const response = await fetch(`https://api.vapi.ai/call/${encodeURIComponent(callId)}`, {
        headers: {
          Authorization: `Bearer ${privateKey}`,
        },
      });

      if (!response.ok) {
        return res.status(response.status).json({
          error: `Vapi API error: ${response.status} ${response.statusText}`,
        });
      }

      const data = await response.json();
      const recordingUrl = data?.recordingUrl || data?.artifact?.recordingUrl || null;

      if (recordingUrl) {
        return res.status(200).json({ recordingUrl });
      }
    } catch (err) {
      console.error('Error fetching Vapi recording on server:', err);
      return res.status(500).json({ error: err.message || 'Error fetching recording' });
    }
  }

  return res.status(200).json({ recordingUrl: null });
}

