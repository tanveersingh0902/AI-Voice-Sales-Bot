// Unified configuration resolver
// Reads credentials from Vite build-time defines (with and without VITE_ prefix) and localStorage fallback.

function getRawValue(key) {
  if (typeof window === 'undefined') return '';

  // 1. Check import.meta.env with VITE_ prefix
  try {
    const withVite = import.meta.env[`VITE_${key}`];
    if (withVite) return withVite;
  } catch {
    // ignore
  }

  // 2. Check import.meta.env exact key
  try {
    const exact = import.meta.env[key];
    if (exact) return exact;
  } catch {
    // ignore
  }

  // 3. Check build-time defines if available
  try {
    if (key === 'VAPI_PUBLIC_KEY' && typeof __VAPI_PUBLIC_KEY__ !== 'undefined' && __VAPI_PUBLIC_KEY__) {
      return __VAPI_PUBLIC_KEY__;
    }
    if (key === 'VAPI_ASSISTANT_ID' && typeof __VAPI_ASSISTANT_ID__ !== 'undefined' && __VAPI_ASSISTANT_ID__) {
      return __VAPI_ASSISTANT_ID__;
    }
  } catch {
    // ignore
  }

  // 4. Check localStorage with VITE_ prefix
  try {
    const localWithVite = localStorage.getItem(`VITE_${key}`);
    if (localWithVite) return localWithVite;

    // 5. Check localStorage exact key
    const localExact = localStorage.getItem(key);
    if (localExact) return localExact;
  } catch {
    // ignore
  }

  return '';
}

export function getConfig(key) {
  if (!key) return '';
  const normalizedKey = key.replace(/^VITE_/, '');
  return getRawValue(normalizedKey);
}

export function setConfig(key, value) {
  if (typeof window === 'undefined' || !key) return;
  const normalizedKey = key.replace(/^VITE_/, '');
  const trimmed = (value || '').trim();
  try {
    if (trimmed) {
      localStorage.setItem(normalizedKey, trimmed);
      localStorage.setItem(`VITE_${normalizedKey}`, trimmed);
    } else {
      localStorage.removeItem(normalizedKey);
      localStorage.removeItem(`VITE_${normalizedKey}`);
    }
  } catch {
    // ignore
  }
}

