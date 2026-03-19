// src/hooks/useDebounce.js
import { useState, useEffect } from "react";

// ── useDebounce ───────────────────────────────────────
// User type karna band kare tab search karo
// Har keystroke pe API call nahi hoga — 500ms wait karo
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // delay ke baad value update karo
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup — agar user phir type kare to timer reset karo
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;