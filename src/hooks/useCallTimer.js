import { useState, useEffect, useCallback, useRef } from 'react';

export function useCallTimer(isActive) {
  const [seconds, setSeconds] = useState(0);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!isActive) {
      startTimeRef.current = null;
      return;
    }

    startTimeRef.current = Date.now();
    const interval = setInterval(() => {
      if (startTimeRef.current) {
        setSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isActive]);

  const displaySeconds = isActive ? seconds : 0;
  const formatted = `${String(Math.floor(displaySeconds / 60)).padStart(2, '0')}:${String(displaySeconds % 60).padStart(2, '0')}`;

  const reset = useCallback(() => {
    setSeconds(0);
    startTimeRef.current = null;
  }, []);

  return { seconds: displaySeconds, formatted, reset };
}
