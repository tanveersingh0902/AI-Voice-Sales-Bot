const VAPI_API_URL = 'https://api.vapi.ai';

function getEnv(key) {
  if (typeof window === 'undefined') return '';
  return import.meta.env[key] || localStorage.getItem(key) || '';
}

export async function fetchRecordingUrl(callId) {
  const privateKey = getEnv('VITE_VAPI_PRIVATE_KEY');

  if (!privateKey) {
    console.warn('VITE_VAPI_PRIVATE_KEY not configured — cannot fetch recording.');
    return null;
  }

  if (!callId) {
    return null;
  }

  const maxRetries = 5;
  const pollIntervalMs = 3000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await new Promise((r) => setTimeout(r, pollIntervalMs));

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
