// Values injected at build time by vite.config.js (see `define`).
const BUILD_TIME = {
  VAPI_PUBLIC_KEY: __VAPI_PUBLIC_KEY__,
  VAPI_ASSISTANT_ID: __VAPI_ASSISTANT_ID__,
};

export function getPublic(key) {
  if (typeof window === 'undefined') return '';
  return BUILD_TIME[key] || localStorage.getItem(key) || '';
}
