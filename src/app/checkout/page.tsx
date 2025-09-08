'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, CreditCard, ArrowRight } from 'lucide-react';
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

const EVENT_CUSTOM_FIELDS: Partial<Record<number, FieldSet>> = {
  1: [
    ...TEAM_FIELDS,
    { name: 'theme', label: 'Theme Title', type: 'text', required: true }
  ],
  12: [
    ...SOLO_FIELDS,
    { name: 'cameraModel', label: 'Camera/Phone Model', type: 'text' }
  ]
};

function getDefaultFieldsForEvent(ev: EventCatalogItem): FieldSet {
  if (ev.title.includes('VALORANT')) return TEAM_ESPORTS_FIELDS;
  if (ev.title.includes('BGMI') || ev.title.includes('FREE FIRE')) return SQUAD_ESPORTS_FIELDS;
  if (ev.title.includes('RAMPWALK') || ev.title.includes('DANCE') || ev.title.includes('DUMB SHOW') || ev.title.includes('COURTROOM')) return TEAM_FIELDS;
  return SOLO_FIELDS;
}

function getEventFields(ev: EventCatalogItem): FieldSet {
  return EVENT_CUSTOM_FIELDS[ev.id] || getDefaultFieldsForEvent(ev);
}

type Step = 'select' | 'forms' | 'review' | 'payment';

const STEPS: { id: Step; name: string }[] = [
  { id: 'select', name: 'Select Events' },
  { id: 'forms', name: 'Your Details' },
  { id: 'review', name: 'Review' },
  { id: 'payment', name: 'Payment' },
];

function parsePrice(priceStr: string): number {
  if (!priceStr || priceStr.toLowerCase() === 'free') return 0;
  const match = priceStr.match(/₹(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

const Stepper = ({ currentStep }: { currentStep: Step }) => {
  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);
  return (
    <div className="flex items-center justify-center mb-12">
      {STEPS.map((step, i) => (
        <React.Fragment key={step.id}>
          <div className={`flex items-center ${i <= currentStepIndex ? 'text-purple-300' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${i <= currentStepIndex ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
              {i + 1}
            </div>
            <span className="ml-2 text-sm hidden sm:inline">{step.name}</span>
          </div>
          {i < STEPS.length - 1 && <div className={`w-12 h-px mx-4 ${i < currentStepIndex ? 'bg-purple-400' : 'bg-gray-700'}`} />}
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
  const [formDataBySignature, setFormDataBySignature] = useState<Record<string, Record<string, string>>>({});

  // Preselect from query param
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

  const fieldGroups = useMemo(() => {
    const groups: { signature: string; fields: FieldSet; events: EventCatalogItem[] }[] = [];
    const map = new Map<string, { signature: string; fields: FieldSet; events: EventCatalogItem[] }>();
    for (const ev of selectedEvents) {
      const fields = getEventFields(ev);
      const signature = JSON.stringify(fields.map(f => ({ name: f.name, type: f.type, label: f.label, required: !!f.required, options: f.options })));
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
      if (data.payment_link) {
        window.location.href = data.payment_link as string;
        return;
      }
      const orderToken = data.order_token || data.payment_session_id || data.token;
      const mode = data.mode || (window.location.hostname === 'localhost' ? 'sandbox' : 'production');
      if (!orderToken) throw new Error('Missing payment session token from server');
      await loadCashfreeSdk();
      const anyWindow = window as unknown as Record<string, any>;
      const cf = anyWindow.Cashfree || anyWindow?.cashfree;
      if (!cf) throw new Error('Cashfree SDK not available');
      if (typeof cf?.initialize === 'function') {
        const ins = cf.initialize({ mode });
        await ins.checkout({ paymentSessionId: orderToken });
        return;
      }
      if (typeof cf?.payments === 'function') {
        const ins = cf.payments({ mode });
        await ins.checkout({ paymentSessionId: orderToken });
        return;
      }
      throw new Error('Unsupported Cashfree SDK interface');
    } finally {
      // Keep user on page
    }
  };

  // Group events by category
  const eventsByCategory = useMemo(() => {
    const categories = new Map<string, EventCatalogItem[]>();
    EVENT_CATALOG.forEach(event => {
      const cat = event.category;
      if (!categories.has(cat)) categories.set(cat, []);
      categories.get(cat)!.push(event);
    });
    return categories;
  }, []);

  return (
    <div className="min-h-screen text-white">
      {/* Fancy cosmic background with aurora overlays */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-950 via-purple-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(147,51,234,0.25),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.15),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="aurora">
          <div className="aurora-blob aurora-1"></div>
          <div className="aurora-blob aurora-2"></div>
          <div className="aurora-blob aurora-3"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={goBack} 
            className="flex items-center gap-2 text-white/70 hover:text-purple-300 transition"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300 bg-clip-text text-transparent title-glow-animation">
            Event Registration
          </h1>
          <div className="w-16"></div>
        </div>

        <Stepper currentStep={step} />

        {/* Rest of your steps remain as before, but card classes adjusted */}
        {/* Example: */}
        <main>
          <AnimatePresence mode="wait">
            {step === 'select' && (
              <motion.div 
                key="select" 
                initial={{ opacity: 0, x: 50 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -50 }}
              >
                <div className="grid lg:grid-cols-4 gap-8">
                  <div className="lg:col-span-3">
                    <h2 className="text-xl font-semibold mb-6">Choose Your Events</h2>
                    {Array.from(eventsByCategory.entries()).map(([category, events]) => (
                      <div key={category} className="mb-8">
                        <h3 className="text-lg font-medium text-white/80 mb-4">{category}</h3>
                        <div className="space-y-3">
                          {events.map(event => {
                            const isSelected = selectedEventIds.includes(event.id);
                            return (
                              <motion.div
                                key={event.id}
                                onClick={() => handleToggleEvent(event.id)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.995 }}
                                className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 border overflow-hidden ${
                                  isSelected
                                    ? 'bg-purple-500/20 border-purple-400 shadow-lg shadow-purple-900/30'
                                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                                }`}
                              >
                                {/* subtle animated shine */}
                                <div className="pointer-events-none absolute -inset-1 opacity-0 hover:opacity-100 transition-opacity duration-500">
                                  <div className="absolute -top-8 -left-10 h-20 w-36 rotate-12 bg-gradient-to-r from-white/10 to-transparent blur-xl"></div>
                                </div>
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h4 className="font-semibold">{event.title}</h4>
                                    <p className="text-sm text-gray-400">{event.price}</p>
                                  </div>
                                  {isSelected && (
                                    <div className="relative">
                                      <span className="absolute -inset-2 rounded-full bg-purple-500/20 blur-md"></span>
                                      <Check className="relative w-5 h-5 text-purple-300" />
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg shadow-purple-900/20 relative overflow-hidden">
                      <div className="pointer-events-none absolute -top-10 right-0 h-24 w-24 rounded-full bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-400/20 blur-2xl"></div>
                      <h3 className="font-semibold text-purple-200">Selected Events</h3>
                      <ul className="mt-4 space-y-2 text-sm">
                        {selectedEvents.map(ev => (
                          <li key={ev.id} className="flex justify-between">
                            <span>{ev.title}</span>
                            <span>{ev.price}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t border-white/10 mt-4 pt-4 flex justify-between font-semibold">
                        <span>Total</span>
                        <span>₹{totalPrice}</span>
                      </div>
                      <button
                        onClick={goNext}
                        disabled={selectedEventIds.length === 0}
                        className={`relative w-full mt-6 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-white font-medium transition-all duration-300 ${
                          selectedEventIds.length === 0 
                            ? 'bg-gray-600 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 shadow-[0_0_20px_rgba(147,51,234,0.25)] hover:shadow-[0_0_30px_rgba(147,51,234,0.4)] hover:scale-105'
                        }`}
                      >
                        Continue <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
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
