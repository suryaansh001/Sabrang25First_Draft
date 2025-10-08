
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
  const [step, setStep] = useState<Step>('select');
  const [filesBySignature, setFilesBySignature] = useState<Record<string, Record<string, File>>>({});
  const [memberFilesBySignature, setMemberFilesBySignature] = useState<Record<string, Record<number, File>>>({});
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Use ref to prevent excessive saves
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Load step from storage after hydration to avoid mismatch
  useEffect(() => {
    const savedStep = loadFromStorage<Step>('checkout_current_step', 'select');
    setStep(savedStep);
    setIsHydrated(true);
  }, []);

  // Save step to storage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      saveToStorage('checkout_current_step', step);
    }
  }, [step, isHydrated]);

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
      if (updates.selectedEventIds) saveToStorage('checkout_selected_events', updates.selectedEventIds);
      if (updates.visitorPassDays !== undefined) saveToStorage('checkout_visitor_pass', updates.visitorPassDays);
      if (updates.visitorPassDetails) saveToStorage('checkout_visitor_pass_details', updates.visitorPassDetails);
      if (updates.formDataBySignature) saveToStorage('checkout_form_data', updates.formDataBySignature);
      if (updates.teamMembersBySignature) saveToStorage('checkout_team_members', updates.teamMembersBySignature);
      if (updates.promoInput !== undefined) saveToStorage('checkout_promo_input', updates.promoInput);
      if (updates.appliedPromo !== undefined) saveToStorage('checkout_applied_promo', updates.appliedPromo);
      return newState;
    });
  }, []);

  // Load state from storage on mount
  useEffect(() => {
    const savedSelectedEvents = loadFromStorage<number[]>('checkout_selected_events', []);
    // Filter out event id 10 (In Conversation With) as registration is closed
    const filteredSelectedEvents = savedSelectedEvents.filter(id => id !== 10);
    const savedVisitorPass = loadFromStorage<number>('checkout_visitor_pass', 0);
    const savedVisitorPassDetails = loadFromStorage<Record<string, string>>('checkout_visitor_pass_details', {});
    const savedFormData = loadFromStorage<Record<string, Record<string, string>>>('checkout_form_data', {});
    const savedTeamMembers = loadFromStorage<Record<string, Array<Record<string, string>>>>('checkout_team_members', {});
    const savedPromoInput = loadFromStorage<string>('checkout_promo_input', '');
    const savedAppliedPromo = loadFromStorage<{code: string; discountAmount: number} | null>('checkout_applied_promo', null);

    setState({
      selectedEventIds: filteredSelectedEvents,
      visitorPassDays: savedVisitorPass,
      visitorPassDetails: savedVisitorPassDetails,
      flagshipBenefitsByEvent: {},
      formDataBySignature: savedFormData,
      teamMembersBySignature: savedTeamMembers,
      promoInput: savedPromoInput,
      appliedPromo: savedAppliedPromo,
    });
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
