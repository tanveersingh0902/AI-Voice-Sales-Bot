import { useState, useRef, useCallback, useEffect } from 'react';
import Vapi from '@vapi-ai/web';
import { getPublic } from '../services/publicConfig';

function getVapiConstructor() {
  if (typeof Vapi === 'function') return Vapi;
  if (typeof Vapi?.default === 'function') return Vapi.default;
  if (typeof window !== 'undefined' && typeof window.Vapi === 'function') return window.Vapi;
  return Vapi;
}

const ASSISTANT_CONFIG = {
  model: {
    provider: 'openai',
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          'You are Alex, a friendly and persuasive sales representative for NexaCRM. Start by warmly greeting the customer, ask about their current CRM pain points, explain how NexaCRM solves them, handle any objections confidently, and guide them toward booking a free demo. Keep responses concise (under 3 sentences). Be conversational, not robotic.',
      },
    ],
  },
  voice: { provider: '11labs', voiceId: 'chris' },
  firstMessage:
    "Hey there! I'm Alex from NexaCRM. Thanks for taking the time to chat. I'd love to learn about how you're currently managing your customer relationships — what CRM tools are you using today?",
  name: 'NexaCRM Sales Assistant',
};

export function useVapi() {
  const [status, setStatus] = useState('idle');
  const [messages, setMessages] = useState([]);
  const [callId, setCallId] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const vapiRef = useRef(null);

  useEffect(() => {
    const publicKey = getPublic('VAPI_PUBLIC_KEY');
    if (!publicKey) {
      setError('VAPI_PUBLIC_KEY is not configured. Please add it to your environment variables.');
      return;
    }

    try {
      const VapiClass = getVapiConstructor();
      const vapi = new VapiClass(publicKey);
      vapiRef.current = vapi;

      vapi.on('call-start', () => {
        setStatus('live');
        setError(null);
      });
      vapi.on('call-end', () => {
        setStatus('ended');
        setIsSpeaking(false);
      });
      vapi.on('speech-start', () => setIsSpeaking(true));
      vapi.on('speech-end', () => setIsSpeaking(false));
      vapi.on('message', (msg) => {
        if (msg.type === 'transcript' && msg.transcriptType === 'final') {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              role: msg.role,
              text: msg.transcript,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        }
      });
      vapi.on('error', (err) => {
        console.error('Vapi error:', err);
        setError(err?.message || 'An error occurred during the call.');
        setStatus('idle');
        setIsSpeaking(false);
      });

      return () => {
        try {
          vapi.stop();
        } catch {
          // ignore
        }
      };
    } catch (err) {
      console.error('Failed to initialize Vapi:', err);
      setError(err?.message || 'Failed to initialize voice assistant.');
    }
  }, []);

  const startCall = useCallback(async () => {
    if (!vapiRef.current) return;
    try {
      setError(null);
      setMessages([]);
      setStatus('connecting');
      setCallId(null);

      const assistantId = getPublic('VAPI_ASSISTANT_ID');
      const call = assistantId
        ? await vapiRef.current.start(assistantId)
        : await vapiRef.current.start(ASSISTANT_CONFIG);

      if (call?.id) setCallId(call.id);
    } catch (err) {
      console.error('Failed to start call:', err);
      setError(err?.message || 'Failed to start the call. Please check your configuration.');
      setStatus('idle');
    }
  }, []);

  const endCall = useCallback(() => {
    try {
      vapiRef.current?.stop();
    } catch (err) {
      console.error('Failed to end call:', err);
    }
  }, []);

  return { status, messages, callId, isSpeaking, error, startCall, endCall, setStatus };
}
