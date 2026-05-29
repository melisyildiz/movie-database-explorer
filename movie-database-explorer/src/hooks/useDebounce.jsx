// src/hooks/useDebounce.jsx
import { useState, useEffect } from 'react';

export default function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Belirlenen süre (delay) kadar bekler
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Eğer süre dolmadan kullanıcı yeni bir harf yazarsa, eski sayacı iptal eder ve baştan başlar
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}