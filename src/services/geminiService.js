import { getConfig } from './config';

const DEFAULT_MODEL = 'gemini-3.8-flash';

async function callGeminiApi(model, apiKey, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

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

  if (model.startsWith('gemini-3') || model.includes('3.')) {
    generationConfig.thinkingConfig = { thinkingLevel: 'LOW' };
  } else if (model.includes('2.5')) {
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

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

function extractJson(text) {
  const trimmed = text.trim();
  const match = trimmed.match(/\{[\s\S]*\}/);
  if (match) {
    return JSON.parse(match[0]);
  }
  return JSON.parse(trimmed);
}

export async function generateCallSummary(transcript) {
  // 1. First, attempt secure backend call to /api/summary
  // This keeps GEMINI_API_KEY safe on Vercel without exposing it to the browser.
  try {
    const apiRes = await fetch('/api/summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript }),
    });

    if (apiRes.ok) {
      return await apiRes.json();
    }

    // If server returned an error other than 404/405, throw the error message
    if (apiRes.status !== 404 && apiRes.status !== 405) {
      const errData = await apiRes.json().catch(() => ({}));
      throw new Error(errData?.error || `Server summary failed with status ${apiRes.status}`);
    }
  } catch (err) {
    // If /api/summary is not reachable (e.g. local vite dev without serverless), fall back to client
    if (!err.message?.includes('404')) {
      console.warn('Backend /api/summary unavailable, using fallback:', err.message);
    }
  }

  // 2. Client-side fallback (for local dev or when keys are provided in browser)
  const apiKey = getConfig('GEMINI_API_KEY');

  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please add GEMINI_API_KEY to your Vercel Environment Variables.');
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
    const configuredModel = getConfig('GEMINI_MODEL') || DEFAULT_MODEL;
    const response = await callGeminiApi(configuredModel, apiKey, prompt);

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

    return extractJson(text);
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new Error('Failed to parse Gemini response as JSON. The AI returned an unexpected format.');
    }
    throw err;
  }
}
