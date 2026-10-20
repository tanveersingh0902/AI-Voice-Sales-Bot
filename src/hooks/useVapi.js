import { useState, useRef, useCallback, useEffect } from 'react';
import Vapi from '@vapi-ai/web';

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
  voice: {
    provider: '11labs',
    voiceId: 'chris',
  },
  firstMessage: "Hey there! I'm Alex from NexaCRM. Thanks for taking the time to chat. I'd love to learn about how you're currently managing your customer relationships — what CRM tools are you using today?",
  name: 'NexaCRM Sales Assistant',
};

export function useVapi() {
  const [status, setStatus] = useState('idle');
  const [messages, setMessages] = useState([]);
  const [callId, setCallId] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const vapiRef = useRef(null);
  const callStartTimeRef = useRef(null);

  useEffect(() => {
    const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
    if (!publicKey) {
      setError('VITE_VAPI_PUBLIC_KEY is not configured. Please add it to your .env file.');
      return;
    }

    try {
      const VapiClass = getVapiConstructor();
      const vapi = new VapiClass(publicKey);
      vapiRef.current = vapi;

      vapi.on('call-start', () => {
        setStatus('live');
        setError(null);
        callStartTimeRef.current = Date.now();
      });

      vapi.on('call-end', () => {
        setStatus('ended');
        setIsSpeaking(false);
      });

      vapi.on('speech-start', () => {
        setIsSpeaking(true);
      });

      vapi.on('speech-end', () => {
        setIsSpeaking(false);
      });

      vapi.on('message', (msg) => {
        if (msg.type === 'transcript') {
          if (msg.transcriptType === 'final') {
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
        }
        if (msg.type === 'conversation-update') {
          // We get structured conversation updates too
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
          // Safe ignore if stop fails on cleanup
        }
      };
    } catch (err) {
      console.error('Failed to initialize Vapi:', err);
      setError(err?.message || 'Failed to initialize voice assistant.');
    }
  }, []);

  const startCall = useCallback(async () => {
    try {
      setError(null);
      setMessages([]);
      setStatus('connecting');
      setCallId(null);

      if (!vapiRef.current) {
        const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
        if (!publicKey) {
          throw new Error('VITE_VAPI_PUBLIC_KEY is not configured. Please add it to your .env file.');
        }
        const VapiClass = getVapiConstructor();
        vapiRef.current = new VapiClass(publicKey);
      }

      const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;

      let call;
      if (assistantId) {
        call = await vapiRef.current.start(assistantId);
      } else {
        call = await vapiRef.current.start(ASSISTANT_CONFIG);
      }

      if (call?.id) {
        setCallId(call.id);
      }
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

  const getCallDurationMs = useCallback(() => {
    if (!callStartTimeRef.current) return 0;
    return Date.now() - callStartTimeRef.current;
  }, []);

  return {
    status,
    messages,
    callId,
    isSpeaking,
    error,
    startCall,
    endCall,
    getCallDurationMs,
    setStatus,
  };
}
