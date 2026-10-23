import { getConfig } from './config';

const VAPI_API_URL = 'https://api.vapi.ai';

export async function fetchRecordingUrl(callId) {
  if (!callId) {
    return null;
  }

  // 1. Try secure backend endpoint on Vercel
  // Keeps VAPI_PRIVATE_KEY 100% secret on the server
  try {
    const apiRes = await fetch(`/api/recording?callId=${encodeURIComponent(callId)}`);
    if (apiRes.ok) {
      const data = await apiRes.json();
      return data?.recordingUrl || null;
    }
  } catch (err) {
    console.warn('Backend /api/recording unavailable, checking fallback:', err.message);
  }

  // 2. Client-side fallback (for local development)
  const privateKey = getConfig('VAPI_PRIVATE_KEY');

  if (!privateKey) {
    console.warn('VAPI_PRIVATE_KEY not configured — cannot fetch recording.');
    return null;
  }

  const maxRetries = 4;
  const pollIntervalMs = 2000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 1) {
        await new Promise((r) => setTimeout(r, pollIntervalMs));
      }

      const response = await fetch(`${VAPI_API_URL}/call/${callId}`, {
        headers: {
          Authorization: `Bearer ${privateKey}`,
        },
      });

      if (!response.ok) {
        console.error(`Failed to fetch call details: ${response.status}`);
        return null;
      }

      const data = await response.json();
      const recordingUrl = data?.recordingUrl || data?.artifact?.recordingUrl || null;

      if (recordingUrl) {
        return recordingUrl;
      }
    } catch (err) {
      console.error('Error fetching recording:', err);
      return null;
    }
  }

  return null;
}
