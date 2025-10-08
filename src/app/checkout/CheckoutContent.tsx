'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import { EVENT_CATALOG as ORIGINAL_EVENT_CATALOG, EventCatalogItem } from '../../lib/eventCatalog';
import { useCheckoutState } from './useCheckoutState';
import { Step } from './types';
import { SelectEventsStep } from './components/SelectEventsStep';
import { FormsStep } from './components/FormsStep';
import { ReviewStep } from './components/ReviewStep';
import { PaymentStep } from './components/PaymentStep';
import { StepIndicator } from './components/StepIndicator';
import { parsePrice, clearCheckoutStorage } from './utils';
const EVENT_CATALOG = ORIGINAL_EVENT_CATALOG.map(event => {
  switch (event.title) {
    case 'Pacnache':
      return { ...event, price: '₹2999' };
    case 'Dance Battle':
      return { ...event, price: '₹2499' };
    case 'Band Jam':
      return { ...event, price: '₹1499' };
    default:
      return event;
  }
});

const STEPS = [
  { id: 'select' as Step, name: 'Select Events' },
  { id: 'forms' as Step, name: 'Your Details' },
  { id: 'review' as Step, name: 'Review' },
  { id: 'payment' as Step, name: 'Payment' },
];

export function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    state,
    updateState,
    step,
    setStep,
    filesBySignature,
    setFilesBySignature,
    memberFilesBySignature,
    setMemberFilesBySignature,
  } = useCheckoutState();

  const [formErrors, setFormErrors] = useState<Record<string, Record<string, string>>>({});

  // Clear storage on component unmount (when navigating away)
  useEffect(() => {
    return () => {
      // This runs when component unmounts (user navigates away)
      clearCheckoutStorage();
    };
  }, []);

  // Listen for proceed to payment event
  useEffect(() => {
    const handleProceedToPayment = () => {
      setStep('payment');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleProceedToReview = () => {
      setStep('review');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleProceedToForms = () => {
      setStep('forms');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('proceedToPayment', handleProceedToPayment);
    window.addEventListener('proceedToReview', handleProceedToReview);
    window.addEventListener('proceedToForms', handleProceedToForms);
    return () => {
      window.removeEventListener('proceedToPayment', handleProceedToPayment);
      window.removeEventListener('proceedToReview', handleProceedToReview);
      window.removeEventListener('proceedToForms', handleProceedToForms);
    };
  }, [setStep]);

  // Get selected events
  const selectedEvents = useMemo(
    () => EVENT_CATALOG.filter(e => state.selectedEventIds.includes(e.id)),
    [state.selectedEventIds]
  );

  // Calculate prices
  const totalPrice = useMemo(() => {
    const eventTotal = selectedEvents.reduce((total, event) => total + parsePrice(event.price), 0);
    const visitorPassTotal = state.visitorPassDays * 69;
    return parseFloat((eventTotal + visitorPassTotal).toFixed(2));
  }, [selectedEvents, state.visitorPassDays]);

  const finalPrice = useMemo(() => {
    const discount = state.appliedPromo?.discountAmount || 0;
    return parseFloat(Math.max(0, totalPrice - discount).toFixed(2));
  }, [totalPrice, state.appliedPromo]);

  // Navigation handlers
  const goNext = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (step === 'select') {
      if (state.selectedEventIds.length === 0 && state.visitorPassDays === 0) return;
      setStep('forms');
    } else if (step === 'forms') {
      // Validation is triggered by custom event from FormsStep
      return;
    } else if (step === 'review') {
      setStep('payment');
    }
  }, [step, state.selectedEventIds, state.visitorPassDays, setStep]);

  const goBack = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (step === 'select') {
      router.back();
    } else if (step === 'forms') {
      setStep('select');
    } else if (step === 'review') {
      setStep('forms');
    } else if (step === 'payment') {
      setStep('review');
    }
  }, [step, router, setStep]);

  // Render current step
  const renderStep = () => {
    switch (step) {
      case 'select':
        return (
          <SelectEventsStep
            eventCatalog={EVENT_CATALOG}
            selectedEventIds={state.selectedEventIds}
            visitorPassDays={state.visitorPassDays}
            onUpdateState={updateState}
          />
        );
      case 'forms':
        return (
          <FormsStep
            selectedEvents={selectedEvents}
            state={state}
            updateState={updateState}
            filesBySignature={filesBySignature}
            setFilesBySignature={setFilesBySignature}
            memberFilesBySignature={memberFilesBySignature}
            setMemberFilesBySignature={setMemberFilesBySignature}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
            onNext={goNext}
          />
        );
      case 'review':
        return (
          <ReviewStep
            selectedEvents={selectedEvents}
            state={state}
            totalPrice={totalPrice}
            finalPrice={finalPrice}
            updateState={updateState}
          />
        );
      case 'payment':
        return (
          <PaymentStep
            selectedEvents={selectedEvents}
            state={state}
            finalPrice={finalPrice}
            filesBySignature={filesBySignature}
            memberFilesBySignature={memberFilesBySignature}
          />
        );
      default:
        return null;
    }
  };

  const canProceed = () => {
    if (step === 'select') {
      return state.selectedEventIds.length > 0 || state.visitorPassDays > 0;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black text-white relative overflow-hidden">
      {/* Animated background elements - removed for cleaner look */}
      <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-8 max-w-7xl relative z-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-purple-300 hover:text-purple-100 transition-colors mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-cyan-400">Checkout</span>
          </h1>
          <p className="text-gray-400">Complete your registration for Sabrang 2025</p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={step} steps={STEPS} />

        {/* Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          {renderStep()}
        </motion.div>

        {/* Navigation Buttons */}
        {step !== 'payment' && step !== 'forms' && (
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={goBack}
              className="px-6 py-3 bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-white/10 rounded-lg transition-all flex items-center gap-2 backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
            
            {step !== 'review' && (
              <button
                onClick={goNext}
                disabled={!canProceed()}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-all flex items-center gap-2 shadow-lg"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
