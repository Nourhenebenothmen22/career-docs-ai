import { useState, useEffect, useCallback } from 'react';

export function useFormState(storageKey, initialState) {
  const saved = localStorage.getItem(storageKey);
  const [formData, setFormData] = useState(saved ? JSON.parse(saved) : initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(formData));
  }, [storageKey, formData]);

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: null }));
  }, []);

  const reset = useCallback(() => {
    setFormData(initialState);
    setErrors({});
    localStorage.removeItem(storageKey);
  }, [storageKey, initialState]);

  return { formData, setFormData, updateField, errors, setErrors, reset };
}
