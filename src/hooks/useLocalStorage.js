import { useState, useEffect, useRef } from "react";

export function useLocalStorage(key, defaultValue) {
  const isFirst = useRef(true);
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return defaultValue;
      const parsed = JSON.parse(raw);
      return typeof defaultValue === "object" && !Array.isArray(defaultValue)
        ? { ...defaultValue, ...parsed }
        : parsed;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or unavailable - ignore, in-memory state still works for this session */
    }
  }, [key, value]);

  return [value, setValue];
}
