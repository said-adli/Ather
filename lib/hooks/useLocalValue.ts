"use client";
import { useCallback, useSyncExternalStore } from 'react';
const event = 'ather:local-value';
function subscribe(notify: () => void) {
  window.addEventListener('storage', notify);
  window.addEventListener(event, notify);
  return () => { window.removeEventListener('storage', notify); window.removeEventListener(event, notify); };
}
export function useLocalValue(key: string) {
  const snapshot = useCallback(() => {
    try { return localStorage.getItem(key); } catch { return null; }
  }, [key]);
  const value = useSyncExternalStore(subscribe, snapshot, () => null);
  const write = (next: string) => {
    localStorage.setItem(key, next);
    window.dispatchEvent(new Event(event));
  };
  return [value, write] as const;
}
export function parseLocalValue(raw: string | null): Record<string, unknown> {
  try { const value = JSON.parse(raw || 'null'); return value && typeof value === 'object' ? value : {}; } catch { return {}; }
}
