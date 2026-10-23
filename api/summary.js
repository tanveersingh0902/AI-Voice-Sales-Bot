// Vercel Serverless Function: Secure Gemini Call Summarization
// Keeps GEMINI_API_KEY on the server so it is NEVER exposed to client browsers or network logs.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is not configured in Vercel environment variables.',
    });
  }

  const { transcript, model } = req.body || {};

  if (!transcript || !Array.isArray(transcript) || transcript.length === 0) {
    return res.status(400).json({ error: 'A non-empty transcript array is required.' });
  }

  const selectedModel = model || process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const formattedTranscript = transcript
    .map((msg) => `${msg.role === 'assistant' ? 'Sales Rep (Alex)' : 'Customer'}: ${msg.text}`)
    .join('\n');

  const prompt = `You are analyzing a sales call transcript for NexaCRM. Based on the following conversation, generate a structured JSON summary.

Transcript:
${formattedTranscript}

Respond with ONLY valid JSON in this exact format:
{
  "customerName": "The customer's name if mentioned, otherwise 'Unknown Customer'",
  "summary": "A 2-3 sentence summary of the call covering key discussion points and outcome",
  "customerRequirements": ["requirement 1", "requirement 2"],
  "objections": ["objection 1", "objection 2"],
  "nextSteps": ["step 1", "step 2"],
  "salesStatus": "One of: Converted, Interested, Follow-up Required, Not Interested, Demo Requested, No Response"
}

If no objections were raised, use an empty array. Always provide at least one next step.`;

  const generationConfig = {
    responseMimeType: 'application/json',
    responseSchema: {
      type: 'OBJECT',
      properties: {
        customerName: {
          type: 'STRING',
          description: "The customer's name if mentioned, otherwise 'Unknown Customer'",
        },
        summary: {
          type: 'STRING',
          description: 'A 2-3 sentence summary of the call covering key discussion points and outcome',
        },
        customerRequirements: {
          type: 'ARRAY',
          description: 'Array of customer requirements or needs',
          items: { type: 'STRING' },
        },
        objections: {
          type: 'ARRAY',
          description: 'Array of customer objections or concerns, empty array if none',
          items: { type: 'STRING' },
        },
        nextSteps: {
          type: 'ARRAY',
          description: 'Array of actionable next steps',
          items: { type: 'STRING' },
        },
        salesStatus: {
          type: 'STRING',
          description: 'One of: Converted, Interested, Follow-up Required, Not Interested, Demo Requested, No Response',
        },
      },
      required: [
        'customerName',
        'summary',
        'customerRequirements',
        'objections',
        'nextSteps',
        'salesStatus',
      ],
    },
  };

  // Set low thinking level for Gemini 3.x models to eliminate multi-second reasoning delay
  if (selectedModel.startsWith('gemini-3') || selectedModel.includes('3.')) {
    generationConfig.thinkingConfig = { thinkingLevel: 'LOW' };
  } else if (selectedModel.includes('2.5')) {
    generationConfig.thinkingConfig = { thinkingBudget: 0 };
  }

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
    generationConfig,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: errorData?.error?.message || `Gemini API returned error: ${response.statusText}`,
      });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(502).json({ error: 'Empty response received from Gemini API.' });
    }

    const trimmed = text.trim();
    const match = trimmed.match(/\{[\s\S]*\}/);
    const parsed = match ? JSON.parse(match[0]) : JSON.parse(trimmed);
    return res.status(200).json(parsed);
  } catch (err) {
    console.error('Server error in /api/summary:', err);
    return res.status(500).json({ error: err.message || 'Internal server error processing summary' });
  }
}
