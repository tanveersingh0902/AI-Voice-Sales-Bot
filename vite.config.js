import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  // '' prefix = read plain names (no VITE_) from .env files and Vercel's build env
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    // Only these two PUBLIC values are embedded in the browser bundle.
    // VAPI_PRIVATE_KEY and GEMINI_API_KEY are never listed here.
    define: {
      __VAPI_PUBLIC_KEY__: JSON.stringify(env.VAPI_PUBLIC_KEY || ''),
      __VAPI_ASSISTANT_ID__: JSON.stringify(env.VAPI_ASSISTANT_ID || ''),
    },
  };
});
