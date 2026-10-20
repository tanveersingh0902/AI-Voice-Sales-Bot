const VAPI_API_URL = 'https://api.vapi.ai';

export async function fetchRecordingUrl(callId) {
  const privateKey = import.meta.env.VITE_VAPI_PRIVATE_KEY;

  if (!privateKey) {
    console.warn('VITE_VAPI_PRIVATE_KEY not configured — cannot fetch recording.');
    return null;
  }

  if (!callId) {
    return null;
  }

  try {
    // Wait a few seconds for recording to process
    await new Promise((r) => setTimeout(r, 3000));

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
    return data?.recordingUrl || data?.artifact?.recordingUrl || null;
  } catch (err) {
    console.error('Error fetching recording:', err);
    return null;
  }
}
