const DEFAULT_MODEL = 'gemini-2.5-flash';
const FALLBACK_MODEL = 'gemini-2.0-flash';

async function callGeminiApi(model, apiKey, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
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
    },
  };

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export async function generateCallSummary(transcript) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
  }

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

  try {
    const configuredModel = import.meta.env.VITE_GEMINI_MODEL || DEFAULT_MODEL;
    let response = await callGeminiApi(configuredModel, apiKey, prompt);

    // If default model returns 404, retry with fallback model
    if (!response.ok && response.status === 404 && configuredModel === DEFAULT_MODEL) {
      response = await callGeminiApi(FALLBACK_MODEL, apiKey, prompt);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Gemini API error (${response.status}): ${errorData?.error?.message || response.statusText}`
      );
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Empty response from Gemini API.');
    }

    const cleanedText = text.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
    const parsed = JSON.parse(cleanedText);
    return parsed;
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new Error('Failed to parse Gemini response as JSON. The AI returned an unexpected format.');
    }
    throw err;
  }
}

