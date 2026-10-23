import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'vapiCallHistory';

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save call history:', err);
  }
}

export function useCallHistory() {
  const [history, setHistory] = useState(loadHistory);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const addCall = useCallback((callData) => {
    setHistory((prev) => [callData, ...prev]);
  }, []);

  const updateCall = useCallback((callId, updates) => {
    setHistory((prev) =>
      prev.map((call) => (call.id === callId ? { ...call, ...updates } : call))
    );
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, addCall, updateCall, clearHistory };
}
