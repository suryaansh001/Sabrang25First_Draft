'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, CreditCard, ListChecks, ShoppingCart } from 'lucide-react';
import createApiUrl from '../../lib/api';

type EventCatalogItem = {
  id: number;
  title: string;
  price: string;
  category: string;
};

type FieldType = 'text' | 'email' | 'number' | 'phone' | 'select';

type FormField = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
};

type FieldSet = FormField[];

// Minimal catalog. In a later refactor, extract from a shared module or backend.
const EVENT_CATALOG: EventCatalogItem[] = [
  { id: 1, title: 'RAMPWALK - PANACHE', price: '₹85-120', category: 'Flagship' },
  { id: 2, title: 'BANDJAM', price: '₹60', category: 'Flagship' },
  { id: 3, title: 'DANCE BATTLE', price: '₹45', category: 'Flagship' },
  { id: 4, title: 'STEP UP', price: '₹40', category: 'Flagship' },
  { id: 5, title: 'ECHOES OF NOOR', price: 'Free', category: 'Flagship' },
  { id: 7, title: 'BIDDING BEFORE WICKET', price: '₹25', category: 'Fun & Games' },
  { id: 8, title: 'SEAL THE DEAL', price: '₹15', category: 'Fun & Games' },
  { id: 9, title: 'VERSEVAAD', price: 'Free', category: 'Flagship' },
  { id: 10, title: 'IN CONVERSATION WITH', price: 'Free', category: 'Workshops & Talks' },
  { id: 11, title: 'CLAY MODELLING', price: '₹40', category: 'Creative Arts' },
  { id: 12, title: 'FOCUS', price: '₹50', category: 'Creative Arts' },
  { id: 13, title: 'BGMI TOURNAMENT', price: '₹50/squad', category: 'Fun & Games' },
  { id: 14, title: 'VALORANT TOURNAMENT', price: '₹100/team', category: 'Fun & Games' },
  { id: 15, title: 'FREE FIRE TOURNAMENT', price: '₹40/squad', category: 'Fun & Games' },
  { id: 17, title: 'DUMB SHOW', price: 'Free', category: 'Fun & Games' },
  { id: 18, title: 'COURTROOM', price: '₹30', category: 'Special Events' },
  { id: 19, title: 'ART RELAY', price: '₹20', category: 'Creative Arts' }
];

// Define base field sets
const SOLO_FIELDS: FieldSet = [
  { name: 'fullName', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter your name' },
  { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'you@example.com' },
  { name: 'phone', label: 'Phone', type: 'phone', required: true, placeholder: '10-digit number' },
  { name: 'college', label: 'College/Organization', type: 'text', required: true },
  { name: 'year', label: 'Year', type: 'select', options: [
    { value: '1', label: '1st' },
    { value: '2', label: '2nd' },
    { value: '3', label: '3rd' },
    { value: '4', label: '4th+' }
  ] }
];

const TEAM_FIELDS: FieldSet = [
  { name: 'teamName', label: 'Team Name', type: 'text', required: true },
  { name: 'captainName', label: 'Captain Name', type: 'text', required: true },
  { name: 'captainEmail', label: 'Captain Email', type: 'email', required: true },
  { name: 'captainPhone', label: 'Captain Phone', type: 'phone', required: true },
  { name: 'numMembers', label: 'Total Members', type: 'number', required: true, placeholder: 'e.g., 6' }
];

const TEAM_ESPORTS_FIELDS: FieldSet = [
  { name: 'teamName', label: 'Team Name', type: 'text', required: true },
  { name: 'leaderDiscord', label: 'Leader Discord ID', type: 'text', required: true },
  { name: 'leaderRiotId', label: 'Leader In-Game ID', type: 'text', required: true },
  { name: 'contact', label: 'Contact Number', type: 'phone', required: true }
];

const SQUAD_ESPORTS_FIELDS: FieldSet = [
  { name: 'squadName', label: 'Squad Name', type: 'text', required: true },
  { name: 'captainIgn', label: 'Captain In-Game Name', type: 'text', required: true },
  { name: 'captainUid', label: 'Captain UID', type: 'text', required: true },
  { name: 'contact', label: 'Contact Number', type: 'phone', required: true }
];

// Optional: per-event overrides or custom fields
const EVENT_CUSTOM_FIELDS: Partial<Record<number, FieldSet>> = {
  // Example: Panache requires theme name
  1: [
    ...TEAM_FIELDS,
    { name: 'theme', label: 'Theme Title', type: 'text', required: true }
  ],
  12: [
    ...SOLO_FIELDS,
    { name: 'cameraModel', label: 'Camera/Phone Model', type: 'text' }
  ]
};

// Determine default fields for an event when not overridden
function getDefaultFieldsForEvent(ev: EventCatalogItem): FieldSet {
  if (ev.title.includes('VALORANT')) return TEAM_ESPORTS_FIELDS;
  if (ev.title.includes('BGMI') || ev.title.includes('FREE FIRE')) return SQUAD_ESPORTS_FIELDS;
  if (ev.title.includes('RAMPWALK') || ev.title.includes('DANCE') || ev.title.includes('DUMB SHOW') || ev.title.includes('COURTROOM')) return TEAM_FIELDS;
  // Fallback to solo
  return SOLO_FIELDS;
}

function getEventFields(ev: EventCatalogItem): FieldSet {
  return EVENT_CUSTOM_FIELDS[ev.id] || getDefaultFieldsForEvent(ev);
}

type Step = 'select' | 'forms' | 'review' | 'payment';

const STEPS: { id: Step; name: string; icon: React.ElementType }[] = [
  { id: 'select', name: 'Select Events', icon: ShoppingCart },
  { id: 'forms', name: 'Fill Details', icon: ListChecks },
  { id: 'review', name: 'Review & Confirm', icon: Check },
  { id: 'payment', name: 'Payment', icon: CreditCard },
];

function parsePrice(priceStr: string): number {
  if (!priceStr || priceStr.toLowerCase() === 'free') return 0;
  const match = priceStr.match(/₹(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

const Stepper = ({ currentStep }: { currentStep: Step }) => {
  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);
  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => (
        <React.Fragment key={step.id}>
          <div className={`flex flex-col items-center transition-all duration-300 ${i <= currentStepIndex ? 'text-amber-400' : 'text-neutral-500'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${i <= currentStepIndex ? 'bg-amber-400/10 border-amber-400' : 'bg-neutral-800 border-neutral-700'}`}>
              <step.icon className={`w-5 h-5 ${i <= currentStepIndex ? 'text-amber-400' : 'text-neutral-500'}`} />
            </div>
            <p className="text-xs mt-2 text-center">{step.name}</p>
          </div>
          {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-4 transition-colors duration-300 ${i < currentStepIndex ? 'bg-amber-400' : 'bg-neutral-700'}`} />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cashfreeLoadedRef = useRef<boolean>(false);

  const [step, setStep] = useState<Step>('select');
  const [selectedEventIds, setSelectedEventIds] = useState<number[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, Record<string, string>>>({});
  // formDataByFormKey stores one object per schema; events sharing the schema reuse it
  const [formDataBySignature, setFormDataBySignature] = useState<Record<string, Record<string, string>>>({});

  // Preselect from query param, if any
  useEffect(() => {
    const q = searchParams?.get('event');
    if (!q) return;
    const id = Number(q);
    if (!Number.isFinite(id)) return;
    if (EVENT_CATALOG.some(e => e.id === id)) {
      setSelectedEventIds(prev => (prev.includes(id) ? prev : [...prev, id]));
    }
  }, [searchParams]);

  const selectedEvents = useMemo(() => EVENT_CATALOG.filter(e => selectedEventIds.includes(e.id)), [selectedEventIds]);

  const totalPrice = useMemo(() => {
    return selectedEvents.reduce((total, event) => total + parsePrice(event.price), 0);
  }, [selectedEvents]);

  // Group selected events by their exact field set signature (no duplicate filling)
  const fieldGroups = useMemo(() => {
    const groups: { signature: string; fields: FieldSet; events: EventCatalogItem[] }[] = [];
    const map = new Map<string, { signature: string; fields: FieldSet; events: EventCatalogItem[] }>();
    for (const ev of selectedEvents) {
      const fields = getEventFields(ev);
      const signature = JSON.stringify(fields.map(f => ({ name: f.name, type: f.type, label: f.label, required: !!f.required, options: f.options }))); // stable
      if (!map.has(signature)) {
        map.set(signature, { signature, fields, events: [ev] });
      } else {
        map.get(signature)!.events.push(ev);
      }
    }
    for (const v of map.values()) groups.push(v);
    return groups;
  }, [selectedEvents]);

  const handleToggleEvent = (id: number) => {
    setSelectedEventIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleFieldChange = (signature: string, field: string, value: string) => {
    setFormDataBySignature(prev => ({
      ...prev,
      [signature]: {
        ...(prev[signature] || {}),
        [field]: value
      }
    }));
  };

  const validateForms = () => {
    const errors: Record<string, Record<string, string>> = {};
    let isValid = true;

    fieldGroups.forEach(group => {
      errors[group.signature] = {};
      group.fields.forEach(field => {
        if (field.required) {
          const value = formDataBySignature[group.signature]?.[field.name] || '';
          if (!value.trim()) {
            errors[group.signature][field.name] = `${field.label} is required.`;
            isValid = false;
          }
        }
      });
    });

    setFormErrors(errors);
    return isValid;
  };

  const goNext = () => {
    if (step === 'select') {
      if (selectedEventIds.length === 0) return;
      setStep('forms');
      return;
    }
    if (step === 'forms') {
      const isValid = validateForms();
      if (!isValid) return;
      setStep('review');
      return;
    }
    if (step === 'review') {
      setStep('payment');
      // In a real flow, initiate payment here
      return;
    }
  };

  const goBack = () => {
    if (step === 'select') {
      router.back();
      return;
    }
    if (step === 'forms') { setStep('select'); return; }
    if (step === 'review') { setStep('forms'); return; }
    if (step === 'payment') { setStep('review'); return; }
  };

  const reviewPayload = useMemo(() => {
    return fieldGroups.map(g => ({
      signature: g.signature,
      fields: g.fields,
      events: g.events,
      data: formDataBySignature[g.signature] || {}
    }));
  }, [fieldGroups, formDataBySignature]);

  const loadCashfreeSdk = async () => {
    if (cashfreeLoadedRef.current) return;
    await new Promise<void>((resolve, reject) => {
      const existing = document.querySelector('script[data-sdk="cashfree"]') as HTMLScriptElement | null;
      if (existing) {
        cashfreeLoadedRef.current = true;
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/ui/2.0.0/cashfree.js';
      script.async = true;
      script.defer = true;
      script.setAttribute('data-sdk', 'cashfree');
      script.onload = () => { cashfreeLoadedRef.current = true; resolve(); };
      script.onerror = () => reject(new Error('Failed to load Cashfree SDK'));
      document.body.appendChild(script);
    });
  };

  const proceedToPayment = async () => {
    try {
      const response = await fetch(createApiUrl('/payments/cashfree/create-order'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          items: selectedEvents.map(e => ({ eventId: e.id, title: e.title, price: e.price })),
          formsBySignature: formDataBySignature
        })
      });
      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(errText || 'Failed to create order');
      }
      const data = await response.json();
      // Prefer redirect link if backend provides it
      if (data.payment_link) {
        window.location.href = data.payment_link as string;
        return;
      }
      // Else use SDK flow with token
      const orderToken = data.order_token || data.payment_session_id || data.token;
      const mode = data.mode || (window.location.hostname === 'localhost' ? 'sandbox' : 'production');
      if (!orderToken) throw new Error('Missing payment session token from server');
      await loadCashfreeSdk();
      const anyWindow = window as unknown as Record<string, any>;
      const cf = anyWindow.Cashfree || anyWindow?.cashfree;
      if (!cf) throw new Error('Cashfree SDK not available');
      // Try v2 style API
      if (typeof cf.initialize !== 'function' && typeof cf?.payments !== 'function') {
        // Some SDKs expose cf as a callable factory
      }
      // Common newer API
      if (typeof cf?.initialize === 'function') {
        const ins = cf.initialize({ mode });
        await ins.checkout({ paymentSessionId: orderToken });
        return;
      }
      // Fallback older API patterns
      if (typeof cf?.payments === 'function') {
        const ins = cf.payments({ mode });
        await ins.checkout({ paymentSessionId: orderToken });
        return;
      }
      // Last resort: if backend sends link, we already redirected above
      throw new Error('Unsupported Cashfree SDK interface');
    } finally {
      // Keep user on page for now
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans">
      <div className="absolute inset-0 -z-10 h-full w-full bg-neutral-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(252,211,77,0.15),rgba(255,255,255,0))]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="flex items-center justify-between mb-8 md:mb-12">
          <button onClick={goBack} className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors p-2 rounded-md -ml-2">
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center bg-gradient-to-br from-amber-200 via-amber-400 to-orange-500 bg-clip-text text-transparent">
            Event Registration
          </h1>
          <div className="w-20 hidden sm:block" /> {/* Spacer */}
        </header>

        <div className="max-w-2xl mx-auto mb-10">
          <Stepper currentStep={step} />
        </div>

        <main>
          <AnimatePresence mode="wait">
          {step === 'select' && (
            <motion.div key="select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-3">
                  {EVENT_CATALOG.map(ev => {
                    const isSelected = selectedEventIds.includes(ev.id);
                    return (
                      <button
                        key={ev.id}
                        onClick={() => handleToggleEvent(ev.id)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 group ${isSelected ? 'border-amber-500 bg-amber-500/10' : 'border-neutral-800 bg-neutral-800/30 hover:border-neutral-700 hover:bg-neutral-800/60'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${isSelected ? 'bg-amber-500 border-amber-500' : 'bg-neutral-700 border-neutral-600 group-hover:border-neutral-500'}`}>
                            {isSelected && <Check className="w-4 h-4 text-black" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">{ev.title}</p>
                            <p className="text-xs text-neutral-400">{ev.category}</p>
                          </div>
                          <p className="font-mono text-sm text-neutral-300">{ev.price}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <aside className="lg:col-span-1 lg:sticky lg:top-24">
                  <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
                    <h3 className="text-lg font-bold mb-4 text-amber-400">Your Selections</h3>
                    {selectedEvents.length > 0 ? (
                      <>
                        <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                          {selectedEvents.map(ev => (
                            <li key={ev.id} className="flex justify-between items-center text-sm">
                              <span className="text-neutral-300">{ev.title}</span>
                              <span className="font-mono text-neutral-400">{ev.price}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-6 pt-4 border-t border-neutral-800 flex justify-between items-baseline">
                          <span className="text-lg font-bold">Total</span>
                          <span className="font-mono text-xl font-bold text-amber-400">₹{totalPrice}</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-neutral-400 text-sm py-8 text-center">Select events to get started.</p>
                    )}
                    <button
                      disabled={selectedEventIds.length === 0}
                      onClick={goNext}
                      className="w-full mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg transition-all duration-300 font-semibold text-black bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 disabled:from-neutral-700 disabled:to-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed"
                    >
                      Continue <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </aside>
              </div>
            </motion.div>
          )}

          {step === 'forms' && (
            <motion.div key="forms" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <div className="max-w-3xl mx-auto space-y-8">
                {fieldGroups.length === 0 && <div className="text-center text-neutral-400 py-10">No additional details required for the selected events.</div>}
                {fieldGroups.map(group => (
                  <div key={group.signature} className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 shadow-lg">
                    <div className="mb-4 border-b border-neutral-800 pb-4">
                      <h2 className="text-xl font-bold text-amber-400">Participant Details</h2>
                      <p className="text-sm text-neutral-400 mt-1">This form applies to: <span className="font-medium text-neutral-300">{group.events.map(e => e.title).join(', ')}</span></p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                      {group.fields.map(field => (
                        <div key={field.name} className={field.type === 'text' && (field.name.includes('Name') || field.name.includes('college')) ? 'md:col-span-2' : ''}>
                          <label htmlFor={`${group.signature}-${field.name}`} className="block text-sm font-medium text-neutral-300 mb-1.5">{field.label}{field.required && <span className="text-orange-500 ml-1">*</span>}</label>
                          {field.type === 'select' ? (
                            <select
                              id={`${group.signature}-${field.name}`}
                              className="w-full px-3 py-2 rounded-lg bg-neutral-800/50 border-2 border-neutral-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                              value={(formDataBySignature[group.signature]?.[field.name]) || ''}
                              onChange={e => handleFieldChange(group.signature, field.name, e.target.value)}
                            >
                              <option value="">Select...</option>
                              {(field.options || []).map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                          ) : (
                            <input
                              id={`${group.signature}-${field.name}`}
                              type={field.type === 'phone' ? 'tel' : field.type}
                              inputMode={field.type === 'phone' || field.type === 'number' ? 'numeric' : undefined}
                              className="w-full px-3 py-2 rounded-lg bg-neutral-800/50 border-2 border-neutral-700 placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                              placeholder={field.placeholder}
                              value={(formDataBySignature[group.signature]?.[field.name]) || ''}
                              onChange={e => handleFieldChange(group.signature, field.name, e.target.value)}
                            />
                          )}
                          {formErrors[group.signature]?.[field.name] && <p className="text-red-500 text-xs mt-1">{formErrors[group.signature][field.name]}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex justify-end pt-4">
                  <button onClick={goNext} className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg transition-all duration-300 font-semibold text-black bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600">
                    Review & Confirm <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'review' && (
            <motion.div key="review" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 shadow-lg">
                  <h2 className="text-2xl font-bold text-amber-400 mb-6">Review Your Registration</h2>
                  {reviewPayload.map(group => (
                    <div key={group.signature} className="mb-6 last:mb-0 rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
                      <p className="text-sm text-neutral-400 mb-2">Details for: <span className="font-semibold text-neutral-200">{group.events.map(e => e.title).join(', ')}</span></p>
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        {group.fields.map(field => (
                          <div key={field.name} className="flex justify-between border-b border-neutral-800 py-2">
                            <dt className="text-neutral-400">{field.label}</dt>
                            <dd className="text-neutral-200 font-medium text-right break-all">{group.data?.[field.name] || 'N/A'}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                  <div className="mt-8 border-t border-neutral-700 pt-6">
                    <h3 className="text-xl font-semibold mb-4">Total Summary</h3>
                    <div className="space-y-2">
                      {selectedEvents.map(ev => (
                        <div key={ev.id} className="flex justify-between items-center text-sm">
                          <span className="text-neutral-300">{ev.title}</span>
                          <span className="font-mono text-neutral-400">{ev.price}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-neutral-800 flex justify-between items-baseline">
                      <span className="text-lg font-bold">Total Payable</span>
                      <span className="font-mono text-2xl font-bold text-amber-400">₹{totalPrice}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button onClick={goNext} className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg transition-all duration-300 font-semibold text-black bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600">
                    Proceed to Payment <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div key="payment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <div className="max-w-2xl mx-auto text-center">
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 shadow-lg">
                  <div className="w-16 h-16 mx-auto rounded-full bg-amber-400/10 border-2 border-amber-400 flex items-center justify-center mb-6">
                    <CreditCard className="w-8 h-8 text-amber-400" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Final Step: Payment</h2>
                  <p className="text-neutral-300 mb-6 max-w-md mx-auto">You are about to complete your registration. You will be redirected to our secure payment partner.</p>
                  <div className="bg-neutral-800/50 rounded-lg p-4 my-6">
                    <p className="text-neutral-400 text-sm">Total Amount</p>
                    <p className="text-4xl font-bold font-mono text-amber-400">₹{totalPrice}</p>
                  </div>
                  <button onClick={proceedToPayment} className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg transition-all duration-300 font-semibold text-black bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600">
                    Pay Now
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
