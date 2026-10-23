import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const vapiPublicKey = env.VITE_VAPI_PUBLIC_KEY || env.VAPI_PUBLIC_KEY || '';
  const vapiAssistantId = env.VITE_VAPI_ASSISTANT_ID || env.VAPI_ASSISTANT_ID || '';
  const vapiPrivateKey = env.VITE_VAPI_PRIVATE_KEY || env.VAPI_PRIVATE_KEY || '';
  const geminiApiKey = env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || '';

  return {
    plugins: [react(), tailwindcss()],
    define: {
      __VAPI_PUBLIC_KEY__: JSON.stringify(vapiPublicKey),
      __VAPI_ASSISTANT_ID__: JSON.stringify(vapiAssistantId),
      'import.meta.env.VITE_VAPI_PUBLIC_KEY': JSON.stringify(vapiPublicKey),
      'import.meta.env.VAPI_PUBLIC_KEY': JSON.stringify(vapiPublicKey),
      'import.meta.env.VITE_VAPI_ASSISTANT_ID': JSON.stringify(vapiAssistantId),
      'import.meta.env.VAPI_ASSISTANT_ID': JSON.stringify(vapiAssistantId),
      'import.meta.env.VITE_VAPI_PRIVATE_KEY': JSON.stringify(vapiPrivateKey),
      'import.meta.env.VAPI_PRIVATE_KEY': JSON.stringify(vapiPrivateKey),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(geminiApiKey),
      'import.meta.env.GEMINI_API_KEY': JSON.stringify(geminiApiKey),
    },
  };
});
