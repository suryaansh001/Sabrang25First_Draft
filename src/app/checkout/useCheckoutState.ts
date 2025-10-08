
// Custom hook for checkout state management
import { useState, useCallback, useRef, useEffect } from 'react';
import { CheckoutState, Step } from './types';
import { saveToStorage, loadFromStorage } from './utils';

const INITIAL_STATE: CheckoutState = {
  selectedEventIds: [],
  visitorPassDays: 0,
  visitorPassDetails: {},
  flagshipBenefitsByEvent: {},
  formDataBySignature: {},
  teamMembersBySignature: {},
  promoInput: '',
  appliedPromo: null,
};

export function useCheckoutState() {
  const [state, setState] = useState<CheckoutState>(INITIAL_STATE);
  const [step, setStep] = useState<Step>(() => loadFromStorage<Step>('checkout_current_step', 'select'));
  const [filesBySignature, setFilesBySignature] = useState<Record<string, Record<string, File>>>({});
  const [memberFilesBySignature, setMemberFilesBySignature] = useState<Record<string, Record<number, File>>>({});
  
  // Use ref to prevent excessive saves
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Save step to storage whenever it changes
  useEffect(() => {
    saveToStorage('checkout_current_step', step);
  }, [step]);

  // Debounced save to storage
  const debouncedSave = useCallback((key: string, data: any) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveToStorage(key, data);
    }, 500);
  }, []);

  // Update state with automatic save
  const updateState = useCallback((updates: Partial<CheckoutState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      // Save to storage
      Object.keys(updates).forEach(key => {
        debouncedSave(key, newState[key as keyof CheckoutState]);
      });
      return newState;
    });
  }, [debouncedSave]);

  // Load initial state from storage on mount
  useEffect(() => {
    const loadedState: CheckoutState = {
      selectedEventIds: loadFromStorage<number[]>('selectedEventIds', []),
      visitorPassDays: loadFromStorage<number>('visitorPassDays', 0),
      visitorPassDetails: loadFromStorage<Record<string, string>>('visitorPassDetails', {}),
      flagshipBenefitsByEvent: loadFromStorage<Record<number, any>>('flagshipBenefitsByEvent', {}),
      formDataBySignature: loadFromStorage<Record<string, Record<string, string>>>('formDataBySignature', {}),
      teamMembersBySignature: loadFromStorage<Record<string, Array<Record<string, string>>>>('teamMembersBySignature', {}),
      promoInput: loadFromStorage<string>('promoInput', ''),
      appliedPromo: null, // Don't persist promo
    };
    setState(loadedState);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    state,
    updateState,
    step,
    setStep,
    filesBySignature,
    setFilesBySignature,
    memberFilesBySignature,
    setMemberFilesBySignature,
  };
}
