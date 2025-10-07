'use client';

import React, { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, CreditCard, ArrowRight, X, Home, Info, Calendar, Star, Clock, Users, HelpCircle, Handshake, Mail, Camera, Ticket, CheckCircle, XCircle, Loader } from 'lucide-react';
import createApiUrl from '../../lib/api';
import { events as EVENTS_DATA } from '../Events/[id]/rules/events.data';
import { EventCatalogItem, EVENT_CATALOG as ORIGINAL_EVENT_CATALOG } from '../../lib/eventCatalog';
import {load} from '@cashfreepayments/cashfree-js';
import { verifyPaymentStatus } from '../../utils/paymentVerification';


// Control flag to enable/disable the checkout flow.
const REGISTRATION_OPEN = true;

// Override prices for specific events as requested.
const EVENT_CATALOG: EventCatalogItem[] = ORIGINAL_EVENT_CATALOG.map(event => {
  switch (event.title) {
    case 'Pacnache': // Corrected typo from 'Panache' to 'Pacnache'
      return { ...event, price: '₹2999' };
    case 'Dance Battle':
      return { ...event, price: '₹2499' };
    case 'Band Jam':
      return { ...event, price: '₹1499' };
    default:
      return event;
  }
});

// Define missing types
interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'number' | 'select' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  accept?: string;
  // New property for input validation
  inputProps?: {
    pattern?: string; // Regex pattern for validation
    title?: string; // Tooltip message for invalid input
    maxLength?: number; // Maximum length of input
  };
}

type FieldSet = FormField[];

const SOLO_FIELDS: FieldSet = [
  { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Enter your full name' },
  { name: 'collegeMailId', label: 'Email', type: 'email', required: true, placeholder: 'you@example.com' },
  { name: 'contactNo', label: 'Mobile Number', type: 'phone', required: true, placeholder: '10-digit number' },
  { name: 'gender', label: 'Gender', type: 'select', required: true, options: [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ]},
  { name: 'age', label: 'Age', type: 'number', required: true, placeholder: 'e.g., 20' },
  { name: 'universityName', label: 'Institution Name', type: 'text', required: true, placeholder: 'Your school/college/university' },
  { name: 'referralCode', label: 'Referral Code', type: 'text', required: false, placeholder: 'Optional' },
  { name: 'universityCardImage', label: 'Institution Identity Card', type: 'file', required: true, accept: 'image/*' },
  { name: 'address', label: 'Address', type: 'text', required: true, placeholder: 'Enter your full address' },
];

const VISITOR_PASS_FIELDS: FieldSet = [
  { name: 'name', label: 'Visitor Name', type: 'text', required: true, placeholder: 'Enter visitor full name' },
  { name: 'collegeMailId', label: 'Email', type: 'email', required: true, placeholder: 'visitor@example.com' },
  { name: 'contactNo', label: 'Mobile Number', type: 'phone', required: true, placeholder: '10-digit number' },
  { name: 'gender', label: 'Gender', type: 'select', required: true, options: [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ]},
  { name: 'age', label: 'Age', type: 'number', required: true, placeholder: 'e.g., 20' },
  { name: 'universityName', label: 'Institution Name', type: 'text', required: true, placeholder: 'Visitor school/college/university' },
  { name: 'universityCardImage', label: 'Institution Identity Card', type: 'file', required: true, accept: 'image/*' },
  { name: 'address', label: 'Address', type: 'text', required: true, placeholder: 'Enter visitor full address' },
];

const SUPPORT_ARTIST_FIELDS: FieldSet = [
  { name: 'name', label: 'Support Artist Name', type: 'text', required: true, placeholder: 'Enter support artist full name' },
  { name: 'role', label: 'Role/Profession', type: 'text', required: true, placeholder: 'e.g., Makeup Artist, Stylist, Manager' },
  { name: 'contactNo', label: 'Mobile Number', type: 'phone', required: true, placeholder: '10-digit number' },
  { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'artist@example.com' },
  { name: 'idNumber', label: 'Government ID (Upload)', type: 'file', required: true, accept: 'image/*,.pdf' },
  { name: 'idType', label: 'ID Type', type: 'select', required: true, options: [
    { value: 'aadhar', label: 'Aadhar Card' },
    { value: 'passport', label: 'Passport' },
    { value: 'driving', label: 'Driving License' },
    { value: 'other', label: 'Other' },
  ]},
];

const TEAM_ESPORTS_FIELDS: FieldSet = [
  { name: 'teamName', label: 'Team Name', type: 'text', required: true },
  { name: 'leaderDiscord', label: 'Leader Discord ID', type: 'text', required: true },
  { name: 'leaderRiotId', label: 'Leader In-Game ID', type: 'text', required: true },
  ...SOLO_FIELDS
];

const TEAM_FIELDS: FieldSet = [
  { name: 'teamName', label: 'Team Name', type: 'text', required: true },
  ...SOLO_FIELDS,
  { name: 'numMembers', label: 'Total Members', type: 'number', required: true, placeholder: 'e.g., 6' }
];

const SQUAD_ESPORTS_FIELDS: FieldSet = [
  { name: 'teamName', label: 'Squad Name', type: 'text', required: true },
  { name: 'leaderIgn', label: 'Leader In-Game Name', type: 'text', required: true },
  { name: 'leaderUid', label: 'Leader UID', type: 'text', required: true },
  ...SOLO_FIELDS
];

const EVENT_CUSTOM_FIELDS: Partial<Record<number, FieldSet>> = {};

function getDefaultFieldsForEvent(ev: EventCatalogItem): FieldSet {
  // Restore team-specific forms for relevant events
  if (ev.title.includes('VALORANT')) return TEAM_ESPORTS_FIELDS;
  if (ev.title.includes('BGMI') || ev.title.includes('FREE FIRE')) return SQUAD_ESPORTS_FIELDS;
  if (ev.title.includes('RAMPWALK') || ev.title.includes('DANCE') || ev.title.includes('BANDJAM') || ev.title.includes('BAND JAM') ) return TEAM_FIELDS;
  return SOLO_FIELDS;
}

function getEventFields(ev: EventCatalogItem): FieldSet {
  return EVENT_CUSTOM_FIELDS[ev.id] || getDefaultFieldsForEvent(ev);
}

// Team size configuration for events
interface TeamSizeConfig {
  min: number;
  max: number;
}

const TEAM_SIZE_CONFIG: Record<string, TeamSizeConfig> = {
  'RAMPWALK - PANACHE': { min: 7, max: 18 },
  'DANCE BATTLE': { min: 10, max: 21 },
  'ECHOES OF NOOR': { min: 1, max: 2 },
  'VERSEVAAD': { min: 1, max: 2 },
  'BANDJAM': { min: 3, max: 8 },
  'VALORANT TOURNAMENT': { min: 5, max: 5 }, // Fixed size: exactly 5 members
  'FREE FIRE TOURNAMENT': { min: 4, max: 4 }, // Fixed size: exactly 4 members
  'BGMI TOURNAMENT': { min: 4, max: 5 } // Variable: 4-5 members
};

function getTeamSizeConfig(eventTitle: string): TeamSizeConfig | null {
  return TEAM_SIZE_CONFIG[eventTitle] || null;
}

function isTeamEvent(eventTitle: string): boolean {
  const config = getTeamSizeConfig(eventTitle);
  return config ? config.max > 1 : false;
}

function isFlagshipGroupEvent(eventTitle: string): boolean {
  const flagshipGroupEvents = ['RAMPWALK - PANACHE', 'DANCE BATTLE', 'BANDJAM'];
  return flagshipGroupEvents.includes(eventTitle);
}

function isFlagshipSoloEvent(eventTitle: string): boolean {
  const flagshipSoloEvents = ['STEP UP', 'ECHOES OF NOOR', 'VERSEVAAD'];
  return flagshipSoloEvents.includes(eventTitle);
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
  const match = priceStr.match(/₹([\d,]+)/);
  if (!match) return 0;
  const numeric = match[1].replace(/,/g, '');
  return parseInt(numeric, 10) || 0;
}

// Helper function to format price to 2 decimal places
function formatPrice(price: number): string {
  return price.toFixed(2);
}

const Stepper = React.memo(({ currentStep }: { currentStep: Step }) => {
  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);
  return (
    <div className="flex items-center justify-center mb-6 sm:mb-8 overflow-x-auto px-2">
      <div className="flex items-center min-w-max">
      {STEPS.map((step, i) => (
        <React.Fragment key={step.id}>
          <div className={`flex items-center ${i <= currentStepIndex ? 'text-purple-300' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold ${i <= currentStepIndex ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
              {i + 1}
            </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm hidden xs:inline">{step.name}</span>
          </div>
            {i < STEPS.length - 1 && <div className={`w-6 sm:w-12 h-px mx-2 sm:mx-4 ${i < currentStepIndex ? 'bg-purple-400' : 'bg-gray-700'}`} />}
        </React.Fragment>
      ))}
      </div>
    </div>
  );
});

interface PaymentStatus {
  success: boolean;
  status: string;
  transactionId?: string;
  amount?: number;
  method?: string;
  reason?: string;
}


function CheckoutPageContent() {
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const cashfreeLoadedRef = useRef<boolean>(false);

  const [step, setStep] = useState<Step>('select');
  const [reducedMotion, setReducedMotion] = useState<boolean>(true);

  // Function to scroll to top when changing steps
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll to top when step changes
  useEffect(() => {
    scrollToTop();
  }, [step]);
  const [selectedEventIds, setSelectedEventIds] = useState<number[]>([]);
  const [visitorPassDays, setVisitorPassDays] = useState<number>(0);
  const [visitorPassDetails, setVisitorPassDetails] = useState<Record<string, string>>({});
  const [flagshipBenefitsByEvent, setFlagshipBenefitsByEvent] = useState<Record<number, {
    supportArtistQuantity: number;
    supportArtistDetails: Array<Record<string, string>>;
    flagshipVisitorPassQuantity: number;
    flagshipVisitorPassDetails: Array<Record<string, string>>;
    flagshipSoloVisitorPassQuantity: number;
    flagshipSoloVisitorPassDetails: Array<Record<string, string>>;
  }>>({});
  const [formErrors, setFormErrors] = useState<Record<string, Record<string, string>>>({});
  const [formDataBySignature, setFormDataBySignature] = useState<Record<string, Record<string, string>>>({});
  const [teamMembersBySignature, setTeamMembersBySignature] = useState<Record<string, Array<Record<string, string>>>>({});
  const [filesBySignature, setFilesBySignature] = useState<Record<string, Record<string, File>>>({});
  const [memberFilesBySignature, setMemberFilesBySignature] = useState<Record<string, Record<number, File>>>({});
  const [infoEvent, setInfoEvent] = useState<import('../Events/[id]/rules/events.data').Event | null>(null);
  // Simple offline payment instructions (QR + bank details)
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [promoInput, setPromoInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountAmount: number } | null>(null);
  const [promoStatus, setPromoStatus] = useState<{ loading: boolean; error: string | null }>({ loading: false, error: null });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paymentSession, setPaymentSession] = useState<{
    paymentSessionId: string;
    orderId: string;
    amount: number;
    mode: string;
  } | null>(null);
  const [paymentMode, setPaymentMode] = useState<'card' | 'upi'>('card');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentInitializationState, setPaymentInitializationState] = useState<{
  isLoading: boolean;
  error: string | null;
  retryCount: number;
  }>({
    isLoading: false,
    error: null,
    retryCount: 0
  });
  const [paymentVerificationStatus, setPaymentVerificationStatus] = useState<PaymentStatus | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  // Fallback Cashfree form URL for manual payment if SDK/init fails or times out
  const CASHFREE_FALLBACK_FORM_URL = 'https://payments.cashfree.com/forms?code=sabrang25';

  // Memoized action row
  const ActionRow = React.memo(function ActionRow(props: {
    connectionQuality: 'good' | 'poor' | 'offline';
    onSave: () => void;
    onFallback: () => void;
    onBack: () => void;
    onNext: () => void;
  }) {
    const { connectionQuality, onSave, onFallback, onBack, onNext } = props;
    return (
      <div className="flex items-center gap-3 mt-8">
        <div className={`text-xs px-2 py-1 rounded-full border ${connectionQuality === 'good' ? 'text-green-300 border-green-400/40 bg-green-500/10' : connectionQuality === 'poor' ? 'text-yellow-300 border-yellow-400/40 bg-yellow-500/10' : 'text-red-300 border-red-400/40 bg-red-500/10'}`}>
          {connectionQuality === 'good' ? 'Good connection' : connectionQuality === 'poor' ? 'Slow connection' : 'Offline'}
        </div>
        <button type="button" onClick={onSave} className="px-3 py-2 rounded-full bg-white/10 border border-white/10 hover:bg-white/15 transition cursor-pointer text-xs">
          Save Progress
        </button>
        <button type="button" onClick={onFallback} className="px-3 py-2 rounded-full bg-orange-500/20 border border-orange-400/40 hover:bg-orange-500/30 transition cursor-pointer text-xs text-orange-200">
          Try Fallback Payment
        </button>
        <button onClick={onBack} className="px-5 py-2 rounded-full bg-white/10 border border-white/10 hover:bg-white/15 transition cursor-pointer">Back</button>
        <button onClick={onNext} className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 transition cursor-pointer">Continue</button>
      </div>
    );
  });


  // Local draft autosave (persist non-file inputs)
  const CHECKOUT_DRAFT_KEY = 'sabrang_checkout_draft_v1';
  // Load draft on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHECKOUT_DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as Record<string, any>;
      if (Array.isArray(draft.selectedEventIds)) setSelectedEventIds(draft.selectedEventIds);
      if (typeof draft.visitorPassDays === 'number') setVisitorPassDays(draft.visitorPassDays);
      if (draft.visitorPassDetails && typeof draft.visitorPassDetails === 'object') setVisitorPassDetails(draft.visitorPassDetails);
      if (draft.formDataBySignature && typeof draft.formDataBySignature === 'object') setFormDataBySignature(draft.formDataBySignature);
      if (draft.teamMembersBySignature && typeof draft.teamMembersBySignature === 'object') setTeamMembersBySignature(draft.teamMembersBySignature);
      if (draft.flagshipBenefitsByEvent && typeof draft.flagshipBenefitsByEvent === 'object') setFlagshipBenefitsByEvent(draft.flagshipBenefitsByEvent);
      if (typeof draft.promoInput === 'string') setPromoInput(draft.promoInput);
      if (draft.appliedPromo && typeof draft.appliedPromo === 'object') setAppliedPromo(draft.appliedPromo);
    } catch {}
  }, []);
  // Debounced save when key state changes
  useEffect(() => {
    const toSave = {
      selectedEventIds,
      visitorPassDays,
      visitorPassDetails,
      formDataBySignature,
      teamMembersBySignature,
      flagshipBenefitsByEvent,
      promoInput,
      appliedPromo,
    };
    const id = window.setTimeout(() => {
      try { localStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(toSave)); } catch {}
    }, 800);
    return () => window.clearTimeout(id);
  }, [
    selectedEventIds,
    visitorPassDays,
    visitorPassDetails,
    formDataBySignature,
    teamMembersBySignature,
    flagshipBenefitsByEvent,
    promoInput,
    appliedPromo,
  ]);
  const clearDraft = () => {
    try { localStorage.removeItem(CHECKOUT_DRAFT_KEY); } catch {}
  };


  // Force reduced motion for smooth scrolling experience on this page
  useEffect(() => {
    setReducedMotion(true);
  }, []);

  // Preselect events passed via query param selected=1,2,3 or from localStorage cart
  useEffect(() => {
    const selectedParam = searchParams.get('selected');
    if (selectedParam) {
      const ids = selectedParam
        .split(',')
        .map(s => parseInt(s.trim(), 10))
        .filter(n => !Number.isNaN(n));
      if (ids.length) setSelectedEventIds(ids);
    } else {
      // Fallback to localStorage cart if no URL parameters
      try {
        const raw = localStorage.getItem('sabrang_cart');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            const ids = parsed.map(n => parseInt(String(n), 10)).filter(n => !Number.isNaN(n));
            if (ids.length) setSelectedEventIds(ids);
          }
        }
      } catch {}
    }
  }, [searchParams]);

  // Payment verification on page load
  useEffect(() => {
    const orderId = searchParams.get('order_id');
    if (orderId) {
      setIsVerifying(true);
      verifyPaymentStatus(orderId)
        .then(result => {
          setPaymentVerificationStatus(result);
          // If payment is successful, clear the cart
          if (result.success) {
            setSelectedEventIds([]);
            setVisitorPassDays(0);
            try {
              localStorage.removeItem('sabrang_cart');
            } catch {}
          }
        })
        .catch(error => {
          setPaymentVerificationStatus({ success: false, status: 'ERROR', reason: error.message || 'Verification failed.' });
        })
        .finally(() => setIsVerifying(false));
    } else {
      setIsVerifying(false);
    }
  }, [searchParams]);

  // Sync selected events to localStorage cart
  useEffect(() => {
    try {
      localStorage.setItem('sabrang_cart', JSON.stringify(selectedEventIds));
    } catch {}
  }, [selectedEventIds]);

  const selectedEvents = useMemo(() => EVENT_CATALOG.filter(e => selectedEventIds.includes(e.id)), [selectedEventIds]);

  // Initialize flagship benefits for each event
  useEffect(() => {
    setFlagshipBenefitsByEvent(prev => {
      const updated = { ...prev };
      let hasChanged = false;

      selectedEvents.forEach(event => {
        if (!updated[event.id]) {
          updated[event.id] = {
            supportArtistQuantity: 0,
            supportArtistDetails: [],
            flagshipVisitorPassQuantity: 0,
            flagshipVisitorPassDetails: [],
            flagshipSoloVisitorPassQuantity: 0,
            flagshipSoloVisitorPassDetails: []
          };
          hasChanged = true;
        }
      });

      return hasChanged ? updated : prev;
    });
  }, [selectedEvents]);

  // Auto-create details arrays when quantities change for each event
  useEffect(() => {
    setFlagshipBenefitsByEvent(prev => {
      const updated = { ...prev };
      let hasChanged = false;

      Object.entries(prev).forEach(([eventId, benefits]) => {
        const eventIdNum = parseInt(eventId, 10);
        const event = selectedEvents.find(e => e.id === eventIdNum);
        if (!event) return;

        // Handle support artists
        if (benefits.supportArtistQuantity > benefits.supportArtistDetails.length) {
          const newDetails = [...benefits.supportArtistDetails];
          while (newDetails.length < benefits.supportArtistQuantity) {
            // Initialize with empty but properly structured object
            const emptyArtist: Record<string, any> = {};
            SUPPORT_ARTIST_FIELDS.forEach(field => {
              emptyArtist[field.name] = '';
            });
            newDetails.push(emptyArtist);
          }
          updated[eventIdNum].supportArtistDetails = newDetails;
          hasChanged = true;
        } else if (benefits.supportArtistQuantity < benefits.supportArtistDetails.length) {
          updated[eventIdNum].supportArtistDetails = benefits.supportArtistDetails.slice(0, benefits.supportArtistQuantity);
          hasChanged = true;
        }

        // Handle flagship visitor passes
        if (benefits.flagshipVisitorPassQuantity > benefits.flagshipVisitorPassDetails.length) {
          const newDetails = [...benefits.flagshipVisitorPassDetails];
          while (newDetails.length < benefits.flagshipVisitorPassQuantity) {
            // Initialize with empty but properly structured object
            const emptyVisitor: Record<string, any> = {};
            VISITOR_PASS_FIELDS.forEach(field => {
              emptyVisitor[field.name] = '';
            });
            newDetails.push(emptyVisitor);
          }
          updated[eventIdNum].flagshipVisitorPassDetails = newDetails;
          hasChanged = true;
        } else if (benefits.flagshipVisitorPassQuantity < benefits.flagshipVisitorPassDetails.length) {
          updated[eventIdNum].flagshipVisitorPassDetails = benefits.flagshipVisitorPassDetails.slice(0, benefits.flagshipVisitorPassQuantity);
          hasChanged = true;
        }

        // Handle flagship solo visitor passes
        if (benefits.flagshipSoloVisitorPassQuantity > benefits.flagshipSoloVisitorPassDetails.length) {
          const newDetails = [...benefits.flagshipSoloVisitorPassDetails];
          while (newDetails.length < benefits.flagshipSoloVisitorPassQuantity) {
            // Initialize with empty but properly structured object
            const emptySoloVisitor: Record<string, any> = {};
            VISITOR_PASS_FIELDS.forEach(field => {
              emptySoloVisitor[field.name] = '';
            });
            newDetails.push(emptySoloVisitor);
          }
          updated[eventIdNum].flagshipSoloVisitorPassDetails = newDetails;
          hasChanged = true;
        } else if (benefits.flagshipSoloVisitorPassQuantity < benefits.flagshipSoloVisitorPassDetails.length) {
          updated[eventIdNum].flagshipSoloVisitorPassDetails = benefits.flagshipSoloVisitorPassDetails.slice(0, benefits.flagshipSoloVisitorPassQuantity);
          hasChanged = true;
        }
      });

      return hasChanged ? updated : prev;
    });
  }, [selectedEvents]);

  const fieldGroups = useMemo(() => {
    const groups: { signature: string; fields: FieldSet; events: EventCatalogItem[] }[] = [];
    const soloEvents: EventCatalogItem[] = [];
    const teamEvents: EventCatalogItem[] = [];
    
    // Separate solo and team events
    for (const ev of selectedEvents) {
      const fields = getEventFields(ev);
      const isSoloEvent = fields === SOLO_FIELDS;
      
      if (isSoloEvent) {
        soloEvents.push(ev);
      } else {
        teamEvents.push(ev);
      }
    }
    
    // Group all solo events together
    if (soloEvents.length > 0) {
      const soloFields = SOLO_FIELDS;
      const soloSignature = `solo_events_${soloEvents.map(e => e.id).join('_')}_${JSON.stringify(soloFields.map(f => ({ name: f.name, type: f.type, label: f.label, required: !!f.required, options: f.options })))}`;
      groups.push({ signature: soloSignature, fields: soloFields, events: soloEvents });
    }
    
    // Keep team events separate (one form per team event)
    for (const ev of teamEvents) {
      const fields = getEventFields(ev);
      const signature = `event_${ev.id}_${JSON.stringify(fields.map(f => ({ name: f.name, type: f.type, label: f.label, required: !!f.required, options: f.options })))}`;
      groups.push({ signature, fields, events: [ev] });
    }
    
    return groups;
  }, [selectedEvents]);

  // Auto-create minimum required team member forms when moving to forms step
  useEffect(() => {
    if (step === 'forms') {
      setTeamMembersBySignature(prev => {
        const updated = { ...prev };
        let hasChanged = false;

        fieldGroups.forEach(group => {
          const isTeamGroup = group.fields.some(f => f.name === 'teamName');

          if (isTeamGroup) {
            const event = group.events[0];
            if (event) {
              const teamConfig = getTeamSizeConfig(event.title);
              // Only create team member forms for events that support multiple members
              if (teamConfig && teamConfig.max > 1) {
                const minMembers = teamConfig.min;
                // Calculate how many additional member forms we need (-1 because leader is in main form)
                const requiredAdditionalMembers = Math.max(0, minMembers - 1);
                
                // Only auto-create if we don't already have the minimum members
                if (!updated[group.signature] || updated[group.signature].length < requiredAdditionalMembers) {
                  updated[group.signature] = Array.from({ length: requiredAdditionalMembers }, (_, index) => 
                    SOLO_FIELDS.reduce((acc, f) => ({ 
                      ...acc, 
                      [f.name]: '', 
                      _memberIndex: index + 2 // +2 because leader is #1, so members start from #2
                    }), {})
                  );
                  hasChanged = true;
                }
              }
            }
          }
        });
        
        return hasChanged ? updated : prev;
      });
    }
  }, [step, fieldGroups]);

  // Initialize visitor pass details when days are selected
  useEffect(() => {
    if (visitorPassDays > 0 && Object.keys(visitorPassDetails).length === 0) {
      const newDetails = VISITOR_PASS_FIELDS.reduce((acc, f) => ({ ...acc, [f.name]: '' }), {});
      setVisitorPassDetails(newDetails);
    }
  }, [visitorPassDays]);

  const totalPrice = useMemo(() => {
    const eventTotal = selectedEvents.reduce((total, event) => total + parsePrice(event.price), 0);
    const visitorPassTotal = visitorPassDays * 69; // ₹69 per day
    return parseFloat((eventTotal + visitorPassTotal).toFixed(2));
  }, [selectedEvents, visitorPassDays]);

  const finalPrice = useMemo(() => {
    const discount = appliedPromo?.discountAmount || 0;
    return parseFloat(Math.max(0, totalPrice - discount).toFixed(2));
  }, [totalPrice, appliedPromo]);

  const lastPriceRef = useRef(totalPrice);
  // Revalidate promo code when total price changes (debounced, reduced frequency and threshold)
  useEffect(() => {
    if (appliedPromo && totalPrice > 0) {
      if (Math.abs(totalPrice - lastPriceRef.current) > 1) {
        lastPriceRef.current = totalPrice;
        const emailForValidation = getDerivedEmail() || 'temp@example.com';
        debouncedPromoValidation(appliedPromo.code, emailForValidation, totalPrice, (data) => {
          if (data?.success) {
            setAppliedPromo({ code: appliedPromo.code, discountAmount: data.discountAmount });
          } else {
            if (data?.message && String(data.message).toLowerCase().includes('invalid')) {
              setAppliedPromo(null);
              setPromoStatus({ loading: false, error: 'Promo code is no longer valid for this order amount' });
            }
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPrice, appliedPromo?.code]);

  const getDerivedEmail = () => {
    // Search across all groups for collegeMailId or email
    for (const group of fieldGroups) {
      const data = formDataBySignature[group.signature] || {};
      if (data['collegeMailId']) return String(data['collegeMailId']);
      if (data['email']) return String(data['email']);
    }
    
    // Check visitor pass details
    if (visitorPassDetails['collegeMailId']) {
      return String(visitorPassDetails['collegeMailId']);
    }
    
    // Check flagship benefits for any event
    for (const benefits of Object.values(flagshipBenefitsByEvent)) {
      // Check flagship visitor pass details
      if (benefits.flagshipVisitorPassDetails && benefits.flagshipVisitorPassDetails.length > 0) {
        const email = benefits.flagshipVisitorPassDetails[0]['collegeMailId'];
        if (email) return String(email);
      }
      
      // Check flagship solo visitor pass details
      if (benefits.flagshipSoloVisitorPassDetails && benefits.flagshipSoloVisitorPassDetails.length > 0) {
        const email = benefits.flagshipSoloVisitorPassDetails[0]['collegeMailId'];
        if (email) return String(email);
      }
      
      // Check support artist details
      if (benefits.supportArtistDetails && benefits.supportArtistDetails.length > 0) {
        const email = benefits.supportArtistDetails[0]['email'];
        if (email) return String(email);
      }
    }
    
    return '';
  };

  const tryApplyPromo = async () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    
    setPromoStatus({ loading: true, error: null });
    try {
      const userEmail = getDerivedEmail();
      
      // If no email is available, use a placeholder for validation
      // Most promo codes don't require specific email domains anyway
      const emailForValidation = userEmail || 'temp@example.com';
      
      const response = await retryFetch(createApiUrl('/admin/promo-codes/validate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          code,
          userEmail: emailForValidation,
          orderAmount: totalPrice
        })
      }, 2); // 2 retries for promo validation
      
      const data = await response.json();
      if (!response.ok || !data.success) {
        const msg = data.message || 'Invalid promo code';
        setPromoStatus({ loading: false, error: msg });
        setAppliedPromo(null);
        return;
      }
      
      setAppliedPromo({ code, discountAmount: data.discountAmount });
      setPromoStatus({ loading: false, error: null });
    } catch (e) {
      setPromoStatus({ loading: false, error: 'Failed to validate promo code' });
      setAppliedPromo(null);
    }
  };

  const eventDataById = useMemo(() => {
    const map = new Map<number, import('../Events/[id]/rules/events.data').Event>();
    for (const ev of EVENTS_DATA) map.set(ev.id, ev); // This uses the local import
    return map;
  }, []);

  const handleToggleEvent = (id: number) => {
    setSelectedEventIds(prev => {
      if (prev.includes(id)) {
        // Remove event if already selected
        return prev.filter(x => x !== id);
      } else {
        // Check for time conflicts before adding
        const hasConflict = hasTimeConflict(id);
        if (hasConflict) {
          // Show error message or prevent selection
          const conflictMessage = getConflictMessage(id);
          alert(`Cannot select this event. ${conflictMessage}. Please deselect the conflicting event first.`);
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const validateForms = () => {
    const errors: Record<string, Record<string, string>> = {};
    let isValid = true;

    // Validate visitor pass details
    if (visitorPassDays > 0) {
      errors['visitorPasses'] = {};
        VISITOR_PASS_FIELDS.forEach(field => {
          if (field.required) {
          const value = visitorPassDetails[field.name] || '';
            if (!value.trim()) {
            errors['visitorPasses'][`visitor_${field.name}`] = `${field.label} is required.`;
              isValid = false;
            } else if (field.name === 'contactNo') {
              // Validate phone number format (exactly 10 digits)
              const phoneRegex = /^\d{10}$/;
              if (!phoneRegex.test(value.trim())) {
              errors['visitorPasses'][`visitor_${field.name}`] = 'Mobile number must be exactly 10 digits.';
                isValid = false;
              }
            } else if (field.name === 'collegeMailId') {
              // Validate email format
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(value.trim())) {
              errors['visitorPasses'][`visitor_${field.name}`] = 'Please enter a valid email address.';
                isValid = false;
              }
            }
          }
      });
    }

    // Validate flagship benefits for each event
    Object.entries(flagshipBenefitsByEvent).forEach(([eventId, benefits]) => {
      const eventIdNum = parseInt(eventId, 10);
      const event = selectedEvents.find(e => e.id === eventIdNum);
      if (!event) return;

    // Validate support artist details
      if (benefits.supportArtistQuantity > 0) {
        errors[`supportArtists_${eventId}`] = {};
        benefits.supportArtistDetails.forEach((artist, index) => {
        SUPPORT_ARTIST_FIELDS.forEach(field => {
          if (field.required) {
            const value = artist[field.name] || '';
            if (!value.trim()) {
                errors[`supportArtists_${eventId}`][`artist_${index}_${field.name}`] = `${field.label} is required for support artist ${index + 1} for ${event.title}.`;
              isValid = false;
            } else if (field.name === 'contactNo') {
              // Validate phone number format (exactly 10 digits)
              const phoneRegex = /^\d{10}$/;
              if (!phoneRegex.test(value.trim())) {
                  errors[`supportArtists_${eventId}`][`artist_${index}_${field.name}`] = 'Mobile number must be exactly 10 digits.';
                isValid = false;
              }
            } else if (field.name === 'email') {
              // Validate email format
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(value.trim())) {
                  errors[`supportArtists_${eventId}`][`artist_${index}_${field.name}`] = 'Please enter a valid email address.';
                isValid = false;
              }
            }
          }
        });
      });
    }

    // Validate flagship visitor pass details
      if (benefits.flagshipVisitorPassQuantity > 0) {
        errors[`flagshipVisitorPasses_${eventId}`] = {};
        benefits.flagshipVisitorPassDetails.forEach((visitor, index) => {
        VISITOR_PASS_FIELDS.forEach(field => {
          if (field.required) {
            const value = visitor[field.name] || '';
            if (!value.trim()) {
                errors[`flagshipVisitorPasses_${eventId}`][`flagship_visitor_${index}_${field.name}`] = `${field.label} is required for flagship visitor ${index + 1} for ${event.title}.`;
              isValid = false;
            } else if (field.name === 'contactNo') {
              // Validate phone number format (exactly 10 digits)
              const phoneRegex = /^\d{10}$/;
              if (!phoneRegex.test(value.trim())) {
                  errors[`flagshipVisitorPasses_${eventId}`][`flagship_visitor_${index}_${field.name}`] = 'Mobile number must be exactly 10 digits.';
                isValid = false;
              }
            } else if (field.name === 'collegeMailId') {
              // Validate email format
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(value.trim())) {
                  errors[`flagshipVisitorPasses_${eventId}`][`flagship_visitor_${index}_${field.name}`] = 'Please enter a valid email address.';
                isValid = false;
              }
            }
          }
        });
      });
    }

    // Validate flagship solo visitor pass details
      if (benefits.flagshipSoloVisitorPassQuantity > 0) {
        errors[`flagshipSoloVisitorPasses_${eventId}`] = {};
        benefits.flagshipSoloVisitorPassDetails.forEach((visitor, index) => {
        VISITOR_PASS_FIELDS.forEach(field => {
          if (field.required) {
            const value = visitor[field.name] || '';
            if (!value.trim()) {
                errors[`flagshipSoloVisitorPasses_${eventId}`][`flagship_solo_visitor_${index}_${field.name}`] = `${field.label} is required for flagship solo visitor ${index + 1} for ${event.title}.`;
              isValid = false;
            } else if (field.name === 'contactNo') {
              // Validate phone number format (exactly 10 digits)
              const phoneRegex = /^\d{10}$/;
              if (!phoneRegex.test(value.trim())) {
                  errors[`flagshipSoloVisitorPasses_${eventId}`][`flagship_solo_visitor_${index}_${field.name}`] = 'Mobile number must be exactly 10 digits.';
                isValid = false;
              }
            } else if (field.name === 'collegeMailId') {
              // Validate email format
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(value.trim())) {
                  errors[`flagshipSoloVisitorPasses_${eventId}`][`flagship_solo_visitor_${index}_${field.name}`] = 'Please enter a valid email address.';
                isValid = false;
              }
            }
          }
        });
      });
    }
    });

    fieldGroups.forEach(group => {
      errors[group.signature] = {};
      group.fields.forEach(field => {
        if (field.required) {
          if (field.type === 'file') {
            const file = filesBySignature[group.signature]?.[field.name];
            if (!file) {
              errors[group.signature][field.name] = `${field.label} is required.`;
              isValid = false;
            }
          } else {
            const value = formDataBySignature[group.signature]?.[field.name] || '';
            if (!value.trim()) {
              errors[group.signature][field.name] = `${field.label} is required.`;
              isValid = false;
            } else if (field.name === 'contactNo') {
              // Validate phone number format (exactly 10 digits)
              const phoneRegex = /^\d{10}$/;
              if (!phoneRegex.test(value.trim())) {
                errors[group.signature][field.name] = 'Mobile number must be exactly 10 digits.';
                isValid = false;
              }
            }
          }
        }
      });

      // Extra validation for team groups
      const isTeamGroup = group.fields.some(f => f.name === 'teamName');
      if (isTeamGroup) {
        const members = teamMembersBySignature[group.signature] || [];
        let requiredAdditionalMembers = -1; // -1 means not applicable or not determined
        let totalSize = 0;

        const hasNumMembersField = group.fields.some(f => f.name === 'numMembers');
        
        if (hasNumMembersField) {
          totalSize = parseInt((formDataBySignature[group.signature]?.['numMembers'] || '0'), 10) || 0;
          if (totalSize > 0) {
            requiredAdditionalMembers = Math.max(0, totalSize - 1);
          }
        } else {
          // For fixed-size teams, get size from team config
          const event = group.events[0];
          if (event) {
            const teamConfig = getTeamSizeConfig(event.title);
            if (teamConfig) {
              // Check if this event has flagship benefits that can reduce team size requirement
              const eventBenefits = flagshipBenefitsByEvent[event.id];
              let flagshipMembersCount = 0;
              
              if (eventBenefits) {
                // Count support artists and flagship visitors as potential team members
                flagshipMembersCount += eventBenefits.supportArtistQuantity || 0;
                flagshipMembersCount += eventBenefits.flagshipVisitorPassQuantity || 0;
                flagshipMembersCount += eventBenefits.flagshipSoloVisitorPassQuantity || 0;
              }
              
              // Adjust minimum required members by subtracting flagship benefits
              // but ensure we still need at least 1 actual team member (besides leader)
              const adjustedMinSize = Math.max(2, teamConfig.min - flagshipMembersCount); // 2 = leader + 1 member minimum
              totalSize = adjustedMinSize;
              requiredAdditionalMembers = Math.max(0, adjustedMinSize - 1);
              
              console.log(`🎯 Team validation for ${event.title}:`, {
                originalMin: teamConfig.min,
                flagshipMembersCount,
                adjustedMinSize,
                requiredAdditionalMembers,
                actualMembers: members.length
              });
            } else if (event.teamSize) {
              // Fallback to event.teamSize if team config not found
              const match = event.teamSize.match(/\d+/);
              if (match) {
                totalSize = parseInt(match[0], 10);
                requiredAdditionalMembers = Math.max(0, totalSize - 1);
              }
            }
          }
        }

        if (requiredAdditionalMembers !== -1 && members.length !== requiredAdditionalMembers) {
          const totalDisplay = totalSize > 0 ? ` (for a total of ${totalSize})` : '';
          errors[group.signature]['teamMembers'] = `Please add details for ${requiredAdditionalMembers} more team member(s)${totalDisplay}. You have added ${members.length}.`;
          isValid = false;
        }

        members.forEach((m, idx) => {
          SOLO_FIELDS.forEach(field => {
            if (!field.required) return;
            if (field.type === 'file') {
              const filePresent = !!(memberFilesBySignature[group.signature]?.[idx]);
              if (!filePresent) {
                errors[group.signature][`member_${idx}_${field.name}`] = `${field.label} is required.`;
                isValid = false;
              }
            } else {
              if (!m[field.name]?.trim()) {
                errors[group.signature][`member_${idx}_${field.name}`] = `${field.label} is required.`;
                isValid = false;
              } else if (field.name === 'contactNo') {
                // Validate phone number format (exactly 10 digits)
                const phoneRegex = /^\d{10}$/;
                if (!phoneRegex.test(m[field.name].trim())) {
                  errors[group.signature][`member_${idx}_${field.name}`] = 'Mobile number must be exactly 10 digits.';
                  isValid = false;
                }
              }
            }
          });
        });
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const goNext = () => {
    if (step === 'select') {
      if (selectedEventIds.length === 0 && visitorPassDays === 0) return;
      setStep('forms');
      scrollToTop();
      return;
    }
    if (step === 'forms') {
      const isValid = validateForms();
      if (!isValid) return;
      setStep('review');
      scrollToTop();
      return;
    }
    if (step === 'review') {
      setStep('payment');
      scrollToTop();
      return;
    }
  };

  const goBack = () => {
    if (step === 'select') {
      router.back();
      return;
    }
    if (step === 'forms') { setStep('select'); scrollToTop(); return; }
    if (step === 'review') { setStep('forms'); scrollToTop(); return; }
    if (step === 'payment') { setStep('review'); scrollToTop(); return; }
  };

  // Helper function to load Cashfree SDK
  const loadCashfreeSdk = async () => {
    if (cashfreeLoadedRef.current) return;
    
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      script.onload = () => {
        cashfreeLoadedRef.current = true;
        resolve();
      };
      script.onerror = () => {
        console.log('Cashfree SDK load error, continuing anyway');
        resolve();
      };
      document.head.appendChild(script);
    });
  };

  // Immediate field change handler (no debounce) to keep typing responsive
  const handleFieldChange = (signature: string, fieldName: string, value: string) => {
    let nextValue = value;
    if (fieldName === 'referralCode' && typeof nextValue === 'string') {
      nextValue = nextValue.toUpperCase().replace(/[^A-Z0-9]/g, '');
    }
    setFormDataBySignature(prev => ({
      ...prev,
      [signature]: {
        ...prev[signature],
        [fieldName]: nextValue
      }
    }));

    if (fieldName === 'numMembers') {
      const totalMembers = Math.max(0, Math.min(50, parseInt(nextValue || '0', 10) || 0));
      const additionalMembers = Math.max(0, totalMembers - 1);
      setTeamMembersBySignature(prev => {
        const existing = prev[signature] || [];
        const next = existing.slice(0, additionalMembers);
        while (next.length < additionalMembers) {
          next.push(SOLO_FIELDS.reduce((acc, f) => ({ ...acc, [f.name]: '' }), {}));
        }
        return { ...prev, [signature]: next };
      });
    }
  };

  // Handle file uploads
  const handleFileChange = async (signature: string, fieldName: string, file: File | null) => {
    if (file) {
      try {
        const compressed = await compressImage(file, 500);
        setFilesBySignature(prev => ({
          ...prev,
          [signature]: {
            ...prev[signature],
            [fieldName]: compressed
          }
        }));
      } catch {
        setFilesBySignature(prev => ({
          ...prev,
          [signature]: {
            ...prev[signature],
            [fieldName]: file
          }
        }));
      }
      // Also store the filename in form data for display purposes
      setFormDataBySignature(prev => ({
        ...prev,
        [signature]: {
          ...prev[signature],
          [fieldName]: file.name
        }
      }));
    } else {
      setFilesBySignature(prev => {
        const updated = { ...prev };
        if (updated[signature]) {
          delete updated[signature][fieldName];
        }
        return updated;
      });
      setFormDataBySignature(prev => ({
        ...prev,
        [signature]: {
          ...prev[signature],
          [fieldName]: ''
        }
      }));
    }
  };

  // Handle team member image uploads
  const handleMemberFileChange = (signature: string, memberIndex: number, file: File | null) => {
    if (file) {
      setMemberFilesBySignature(prev => ({
        ...prev,
        [signature]: {
          ...(prev[signature] || {}),
          [memberIndex]: file
        }
      }));
    } else {
      setMemberFilesBySignature(prev => {
        const updated = { ...(prev || {}) } as Record<string, Record<number, File>>;
        if (updated[signature]) {
          const group = { ...updated[signature] };
          delete group[memberIndex];
          updated[signature] = group;
        }
        return updated;
      });
    }
  };

  // Helper function to check if two time ranges overlap
  const isTimeOverlapping = (start1: string, end1: string, start2: string, end2: string) => {
    const timeToMinutes = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const start1Min = timeToMinutes(start1);
    const end1Min = timeToMinutes(end1);
    const start2Min = timeToMinutes(start2);
    const end2Min = timeToMinutes(end2);

    // Check if the time ranges overlap
    return start1Min < end2Min && start2Min < end1Min;
  };

  // Check if an event has time conflicts with selected events (disabled temporarily)
  const hasTimeConflict = (_eventId: number) => {
    // Time conflict checks are intentionally disabled for now
    return false;
  };

  // Get conflict message for an event
  const getConflictMessage = (_eventId: number) => {
    // Time conflict messaging disabled
    return '';
  };

  // Start payment initialization with loading state
  const startPaymentInitialization = async () => {
    setPaymentInitializationState({
      isLoading: true,
      error: null,
      retryCount: paymentInitializationState.retryCount + 1
    });

    // If initialization takes too long, surface a helpful fallback
    const initTimeoutId = window.setTimeout(() => {
      setPaymentInitializationState(prev => ({
        ...prev,
        isLoading: false,
        error: 'This is taking longer than expected. You can retry, or use the fallback payment link below.'
      }));
    }, 15000);

    try {
      await adaptivePaymentInit();
      setPaymentInitializationState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error('❌ Payment initialization error:', error);
      setPaymentInitializationState(prev => ({ ...prev, isLoading: false }));
    } finally {
      window.clearTimeout(initTimeoutId);
    }
  };


  // Request timeout wrapper
  const fetchWithTimeout = async (url: string, options: RequestInit, timeout: number = 15000): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      window.clearTimeout(timeoutId);
      return response;
    } catch (error: any) {
      window.clearTimeout(timeoutId);
      if (error?.name === 'AbortError') {
        throw new Error('Request timeout - please check your internet connection');
      }
      throw error;
    }
  };

  // Improved retry with exponential backoff
  const retryFetch = async (
    url: string,
    options: RequestInit,
    maxRetries: number = 2,
    timeout: number = 15000
  ): Promise<Response> => {
    let lastError: Error | null = null;
    for (let i = 0; i <= maxRetries; i++) {
      try {
        const response = await fetchWithTimeout(url, options, timeout);
        if (response.ok || (response.status >= 400 && response.status < 500)) {
          return response;
        }
        if (i < maxRetries) {
          const backoffDelay = Math.min(1000 * Math.pow(2, i), 5000);
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
          continue;
        }
        return response;
      } catch (error) {
        lastError = error as Error;
        console.log(`🔄 Retry attempt ${i + 1}/${maxRetries + 1} failed:`, error);
        if (i < maxRetries) {
          const backoffDelay = Math.min(1000 * Math.pow(2, i), 5000);
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
        }
      }
    }
    throw lastError || new Error('Request failed after retries');
  };

  // Image compression before upload
  const compressImage = async (file: File, maxSizeKB: number = 500): Promise<File> => {
    return new Promise((resolve, reject) => {
      if (file.size <= maxSizeKB * 1024) {
        resolve(file);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDimension = 1200;
          if (width > height && width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          let quality = 0.7;
          const toBlobAtQuality = (q: number) => new Promise<Blob | null>(res => canvas.toBlob(b => res(b), 'image/jpeg', q));
          toBlobAtQuality(quality).then(async (blob) => {
            if (!blob) { resolve(file); return; }
            let compressedBlob = blob;
            while (compressedBlob.size > maxSizeKB * 1024 && quality > 0.3) {
              quality -= 0.1;
              const next = await toBlobAtQuality(quality);
              if (!next) break;
              compressedBlob = next;
            }
            resolve(new File([compressedBlob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
          });
        };
        img.onerror = () => reject(new Error('Image load failed'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('File read failed'));
      reader.readAsDataURL(file);
    });
  };

  // Debounced promo code validation
  let promoValidationTimeout: number;
  const debouncedPromoValidation = (
    code: string,
    email: string,
    amount: number,
    callback: (result: any) => void
  ) => {
    window.clearTimeout(promoValidationTimeout);
    promoValidationTimeout = window.setTimeout(async () => {
      try {
        const response = await retryFetch(
          createApiUrl('/admin/promo-codes/validate'),
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ code, userEmail: email, orderAmount: amount })
          },
          1,
          10000
        );
        const data = await response.json();
        callback(data);
      } catch (e) {
        console.error('Promo validation failed:', e);
        callback({ success: false, message: 'Validation failed' });
      }
    }, 800);
  };

  // Connection quality check
  const checkConnectionQuality = async (): Promise<'good' | 'poor' | 'offline'> => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) return 'offline';
    try {
      const start = Date.now();
      await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors', cache: 'no-store' });
      const duration = Date.now() - start;
      return duration < 1000 ? 'good' : 'poor';
    } catch {
      return 'offline';
    }
  };

  // Connection quality indicator state and polling
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'poor' | 'offline'>('good');
  useEffect(() => {
    let active = true;
    const poll = async () => {
      const q = await checkConnectionQuality();
      if (active) setConnectionQuality(q);
    };
    poll();
    const id = window.setInterval(() => {
      if (['forms', 'review', 'payment'].includes(step)) poll();
    }, 30000);
    return () => { active = false; window.clearInterval(id); };
  }, [step]);

  // Upload files in background (non-blocking)
  const uploadFilesInBackground = async (userId: string) => {
    try {
      const formData = new FormData();
      formData.append('userId', userId);
      for (const [signature, files] of Object.entries(filesBySignature)) {
        for (const [fieldName, file] of Object.entries(files as Record<string, File>)) {
          try {
            const compressed = await compressImage(file);
            formData.append(`files_${signature}_${fieldName}`, compressed);
          } catch (e) {
            console.error('File compression failed:', e);
            formData.append(`files_${signature}_${fieldName}`, file);
          }
        }
      }
      await retryFetch(
        createApiUrl('/api/upload-documents'),
        { method: 'POST', credentials: 'include', body: formData },
        3,
        30000
      );
    } catch (error) {
      console.error('Background file upload failed:', error);
    }
  };

  // Optimized flow: minimal registration, immediate order, background uploads
  const proceedToPaymentOptimized = async () => {
    try {
      // Derive identity
      let derivedName: string | undefined;
      let derivedEmail: string | undefined;
      for (const group of fieldGroups) {
        const data = formDataBySignature[group.signature] || {};
        if (!derivedName && data['name']) derivedName = String(data['name']);
        if (!derivedEmail && data['collegeMailId']) derivedEmail = String(data['collegeMailId']);
      }
      if (!derivedEmail && visitorPassDetails['collegeMailId']) {
        derivedEmail = String(visitorPassDetails['collegeMailId']);
        if (!derivedName) derivedName = String(visitorPassDetails['name'] || 'Participant');
      }
      if (!derivedName) derivedName = 'Participant';
      if (!derivedEmail) derivedEmail = 'participant@example.com';

      const flat = formDataBySignature[fieldGroups[0]?.signature || ''] || {};
      const generatedPassword = Math.random().toString(36).slice(-10) + 'A1!';

      // Step 1: Register minimally
      const basicData = {
        name: derivedName,
        email: derivedEmail,
        password: generatedPassword,
        contactNo: flat['contactNo'],
        gender: flat['gender'],
        age: flat['age'],
        universityName: flat['universityName'],
        address: flat['address'],
        referralCode: flat['referralCode']
      } as Record<string, any>;

      const registrationResponse = await retryFetch(
        createApiUrl('/register'),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(basicData)
        },
        2,
        15000
      );
      if (!registrationResponse.ok) throw new Error('Registration failed');
      const regData = await registrationResponse.json();
      const userId = regData.userId || regData.id || regData.data?.userId;

      // Step 2: Create payment order immediately
      const orderData = {
        userId,
        amount: finalPrice.toString(),
        customerName: derivedName,
        customerEmail: derivedEmail,
        customerPhone: flat['contactNo'] || '9999999999',
        items: selectedEvents.map(e => ({ id: e.id, title: e.title, price: e.price, itemName: e.title, type: 'event', quantity: 1 })),
        visitorPassDays,
        promoCode: appliedPromo?.code || null,
        appliedDiscount: appliedPromo?.discountAmount || 0
      };
      const orderResponse = await retryFetch(
        createApiUrl('/api/payments/create-order'),
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        },
        2,
        15000
      );
      if (!orderResponse.ok) throw new Error('Payment order creation failed');
      const orderResponseData = await orderResponse.json();

      // Step 3: Upload files in background (non-blocking)
      if (userId) {
        uploadFilesInBackground(userId);
      } else {
        console.warn('No userId returned, skipping file upload');
      }

      // Proceed to payment
      setPaymentSession({
        paymentSessionId: orderResponseData.data.payment_session_id,
        orderId: orderResponseData.data.order_id,
        amount: orderResponseData.data.amount,
        mode: 'production'
      });
      setStep('payment');
    } catch (error) {
      console.error('Payment initialization failed:', error);
      throw error;
    }
  };

  const adaptivePaymentInit = async () => {
    const quality = await checkConnectionQuality();
    if (quality === 'offline') {
      alert('No internet connection. Please check your connection and try again.');
      return;
    }
    if (quality === 'poor') {
      const proceed = confirm('Your internet connection seems slow. This may take longer than usual. Do you want to continue or use the alternative payment form?');
      if (!proceed) {
        window.open('https://c8.cashfree.com/third-party-url', '_blank');
        return;
      }
    }
    await proceedToPaymentOptimized();
  };

  // Removed old blocking proceedToPayment in favor of proceedToPaymentOptimized

  // Initialize Cashfree SDK - always production mode
  let cashfree: any;
  const initializeSDK = async () => {
    cashfree = await load({
      mode: "production"
    });
    console.log('✅ Cashfree SDK initialized');
  };

  // Initialize SDK when payment session is available
  useEffect(() => {
    if (step === 'payment' && !cashfreeLoadedRef.current) {
      loadCashfreeSdk();
    }
    if (paymentSession) {
      initializeSDK();
    }
  }, [step, paymentSession]);

  // Clean payment function following user's preferred structure
  const doPayment = async () => {
    if (!paymentSession) {
      alert('No payment session available. Please try again.');
      return;
    }

    setIsProcessingPayment(true);
    
    // Clear any previous errors
    setPaymentInitializationState(prev => ({ ...prev, error: null }));
    
    console.log('🚀 Starting payment with session ID:', paymentSession.paymentSessionId);
    
    const checkoutOptions = {
      paymentSessionId: paymentSession.paymentSessionId,
      redirectTarget: "_self" as const,
    };
    
    console.log('💳 Launching Cashfree checkout with options:', checkoutOptions);
    await cashfree.checkout(checkoutOptions);
    
    setIsProcessingPayment(false);
  };

  // Initialize Cashfree payment
  const initializeCashfreePayment = async () => {
    if (!paymentSession) {
      alert('No payment session available. Please try again.');
      return;
    }

    setIsProcessingPayment(true);
    try {
      console.log('🔗 Initializing Cashfree payment...');
      console.log('Payment Session:', paymentSession);
      
      // Always use production mode
      const cashfree = await load({ 
        mode: "production"
      });
      
      const checkoutOptions = {
        paymentSessionId: paymentSession.paymentSessionId,
        redirectTarget: '_self' as const
      };
      
      console.log('� Launching Cashfree checkout with options:', checkoutOptions);
      await cashfree.checkout(checkoutOptions);
      
    } catch (error) {
      console.error('❌ Cashfree payment failed:', error);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Group events by category
  const eventsByCategory = useMemo(() => {
    // Preserve original order reference
    const originalIndex = new Map<number, number>();
    EVENT_CATALOG.forEach((e, i) => originalIndex.set(e.id, i));

    const flagship: EventCatalogItem[] = [];
    const nonFlagship: EventCatalogItem[] = [];
    EVENT_CATALOG.forEach(event => {
      if (event.category === 'Flagship') {
        flagship.push(event);
      } else {
        nonFlagship.push(event);
      }
    });
    // Custom flagship ordering: group events first, then solo events
    const flagshipOrderTitles = [
      'RAMPWALK - PANACHE',
      'DANCE BATTLE',
      'BANDJAM',
      'STEP UP',
      'ECHOES OF NOOR',
      'VERSEVAAD'
    ];
    const flagshipOrderIndex = new Map<string, number>(
      flagshipOrderTitles.map((t, i) => [t, i])
    );
    flagship.sort((a, b) => {
      const ia = flagshipOrderIndex.has(a.title) ? flagshipOrderIndex.get(a.title)! : Number.MAX_SAFE_INTEGER;
      const ib = flagshipOrderIndex.has(b.title) ? flagshipOrderIndex.get(b.title)! : Number.MAX_SAFE_INTEGER;
      if (ia !== ib) return ia - ib;
      return a.id - b.id;
    });

    // Group non-flagship: Esports together, Arts together, others keep relative order
    const esportsTitles = new Set<string>([
      'VALORANT TOURNAMENT',
      'FREE FIRE TOURNAMENT',
      'BGMI TOURNAMENT'
    ]);
    const artsTitles = new Set<string>([
      'ART RELAY',
      'CLAY MODELLING'
    ]);
    const groupRank = (title: string): number => {
      if (esportsTitles.has(title)) return 0; // esports block first
      if (artsTitles.has(title)) return 1;    // arts block next
      return 2;                               // others after
    };
    nonFlagship.sort((a, b) => {
      const ga = groupRank(a.title);
      const gb = groupRank(b.title);
      if (ga !== gb) return ga - gb;
      // keep original relative order within group
      return (originalIndex.get(a.id) ?? 0) - (originalIndex.get(b.id) ?? 0);
    });
    const categories = new Map<string, EventCatalogItem[]>();
    categories.set('Flagship', flagship);
    categories.set('Non-flagship', nonFlagship);
    return categories;
  }, []);

  return (
    <div className="min-h-screen text-white">
      {/* Simple background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-black via-neutral-950 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(147,51,234,0.08),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.06),transparent_70%)]"></div>
        {/* Aurora overlay to match site's dark neon vibe */}
        <div className="aurora">
          <div className="aurora-blob aurora-1"></div>
          <div className="aurora-blob aurora-2"></div>
          <div className="aurora-blob aurora-3"></div>
        </div>
        {/* Subtle dark overlay for extra contrast */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-[150px] pb-4 sm:pb-8">
        {/* Mobile hamburger */}
        <button
          aria-label="Open menu"
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden fixed top-3 right-3 z-50 p-2.5 rounded-xl bg-black/20 backdrop-blur-sm border border-white/20 active:scale-95 transition"
        >
          <span className="block h-0.5 bg-white rounded-full w-6 mb-1" />
          <span className="block h-0.5 bg-white/90 rounded-full w-5 mb-1" />
          <span className="block h-0.5 bg-white/80 rounded-full w-3" />
        </button>

        {/* Back button beneath hamburger */}
        <button
          onClick={() => router.back()}
          className="lg:hidden fixed top-12 right-3 z-50 px-3 py-1.5 text-white text-sm bg-black/20 backdrop-blur-sm border border-white/20 rounded-lg active:scale-95 transition"
          aria-label="Go back"
        >
          <span className="mr-1">&lt;</span> Back
        </button>
        
        {/* Header - Mobile Optimized */}
        <div className="mb-4 sm:mb-6 text-center">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold title-chroma title-glow-animation">
              Event Registration
            </h1>
          </div>

        {/* Early Bird Promo Code Banner - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative mb-4 sm:mb-6 overflow-hidden"
        >
          <div className="relative bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-rose-900/30 backdrop-blur-sm border border-purple-400/30 rounded-lg sm:rounded-2xl p-3 sm:p-6 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-rose-500/10 animate-pulse"></div>
              <div className="absolute top-2 left-2 w-2 h-2 sm:w-4 sm:h-4 bg-purple-400/30 rounded-full animate-bounce"></div>
              <div className="absolute top-4 right-4 w-1 h-1 sm:w-2 sm:h-2 bg-pink-400/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute bottom-4 left-4 sm:left-8 w-1 h-1 sm:w-3 sm:h-3 bg-rose-400/30 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
            </div>
            
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex-shrink-0">
                  <Star className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-rose-300 bg-clip-text text-transparent">
                    🎉 Early Bird
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80">
                    Get 25% off on all events
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <div className="bg-black/40 border border-purple-400/50 rounded-lg px-3 py-2 backdrop-blur-sm text-center flex-1 sm:flex-none">
                  <span className="text-purple-300 font-mono text-sm sm:text-lg font-bold tracking-wider">
                    SPECIALOFFER
                  </span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('SPECIALOFFER');
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 3000);
                  }}
                  className="px-4 py-2.5 sm:py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg sm:rounded-xl text-white font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/25 text-sm sm:text-base touch-manipulation w-full sm:w-auto"
                >
                  Copy Code
            </button>
          </div>
        </div>
            
            {/* Subtle glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-rose-500/20 rounded-lg sm:rounded-2xl blur-sm -z-10"></div>
          </div>
        </motion.div>

        <Stepper currentStep={step} />

        {/* Rest of your steps remain as before, but card classes adjusted */}
        {/* Example: */}
        <main>
          {/* Global payment help banner */}
          {(step === 'review' || step === 'payment') && (
            <div className="mb-6 rounded-xl border border-pink-400/40 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-cyan-600/20 p-4 sm:p-5 shadow-[0_0_28px_rgba(147,51,234,0.35)]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-sm text-pink-100">
                  <div className="font-semibold text-pink-200">Payment taking too long or showing an error?</div>
                  <div className="opacity-90">Use our secure Cashfree form to complete your payment instantly.</div>
                </div>
                <a
                  href={CASHFREE_FALLBACK_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 via-fuchsia-500 to-cyan-400 hover:from-pink-600 hover:via-fuchsia-600 hover:to-cyan-500 text-white font-semibold shadow-[0_0_20px_rgba(236,72,153,0.35)] transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-pink-400/70"
                >
                  Pay via Cashfree Form
                </a>
              </div>
            </div>
          )}
          <AnimatePresence mode="wait">
            {step === 'select' && (
        <motion.div
                key="select" 
                initial={reducedMotion ? false : { opacity: 0, x: 30 }} 
                animate={reducedMotion ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }} 
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: reducedMotion ? 0.15 : 0.25 }}
              >
                <div className="grid lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  <div className="lg:col-span-3">
                    <div className="bg-yellow-500/15 border border-yellow-400/40 rounded-lg p-4 mb-6 shadow-[0_0_20px_rgba(250,204,21,0.2)] hidden">
                      <p className="text-sm text-yellow-200">
                        <strong>Notice:</strong> Event registration is currently disabled. You can browse events but checkout is not available yet.
                      </p>
                    </div>
                    {selectedEventIds.length > 0 && (
                      <div className="bg-green-500/15 border border-green-400/40 rounded-lg p-4 mb-6 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                        <p className="text-sm text-green-200">
                          <strong>✓ Cart Loaded:</strong> {selectedEventIds.length} event{selectedEventIds.length !== 1 ? 's' : ''} from your cart {selectedEventIds.length === 1 ? 'has' : 'have'} been automatically selected.
                        </p>
                      </div>
                    )}
                    <h2 className="text-xl font-semibold mb-6 title-chroma">Choose Your Events</h2>
                    
                    

                     {/* Flagship Event Benefits - Separate for each event */}
                     {selectedEvents.map(event => {
                       const isGroupEvent = isFlagshipGroupEvent(event.title);
                       const isSoloEvent = isFlagshipSoloEvent(event.title);
                       const benefits = flagshipBenefitsByEvent[event.id] || {
                         supportArtistQuantity: 0,
                         supportArtistDetails: [],
                         flagshipVisitorPassQuantity: 0,
                         flagshipVisitorPassDetails: [],
                         flagshipSoloVisitorPassQuantity: 0,
                         flagshipSoloVisitorPassDetails: []
                       };

                       if (!isGroupEvent && !isSoloEvent) return null;

                       return (
                         <div key={event.id} className="mb-8">
                        <h3 className="text-base sm:text-lg font-medium text-white mb-3 sm:mb-4">
                             <span className={`bg-gradient-to-r ${isGroupEvent ? 'from-purple-300 via-pink-400 to-rose-400' : 'from-blue-300 via-indigo-400 to-purple-400'} bg-clip-text text-transparent`}>
                               Flagship Benefits - {event.title}
                             </span>
                        </h3>
                           <div className={`glass rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 shadow-[0_0_22px_rgba(${isGroupEvent ? '168,85,247' : '59,130,246'},0.18)]`}>
                             {isGroupEvent && (
                               <>
                          <div className="mb-4 sm:mb-6">
                            <h4 className="font-semibold text-purple-200 mb-2 text-sm sm:text-base">Support Artists</h4>
                            <p className="text-xs sm:text-sm text-white/70 mb-3">
                              You will get a form 5 days before the event where you can claim up to 3 support artists (makeup, stylist, manager) for your team performance.
                            </p>
                          </div>
                          
                          <div className="mb-4 sm:mb-6">
                            <h4 className="font-semibold text-purple-200 mb-2 text-sm sm:text-base">Free Visitor Passes</h4>
                            <p className="text-xs sm:text-sm text-white/70 mb-3">
                              You will get a form 5 days before the event where you can claim up to 3 free visitor passes for your day event.
                            </p>
                          </div>

                          <div className="text-xs text-white/60 space-y-1">
                            <p>• Green room access (time-bound as per slot)</p>
                            <p>• Snacks (tea/coffee) for team + support artists</p>
                            <p>• Support artists must wear provided wristbands/badges</p>
                          </div>
                               </>
                             )}

                             {isSoloEvent && (
                               <>
                          <div className="mb-4 sm:mb-6">
                            <h4 className="font-semibold text-blue-200 mb-2 text-sm sm:text-base">Free Visitor Passes</h4>
                            <p className="text-xs sm:text-sm text-white/70 mb-3">
                              You will get a form 5 days before the event where you can claim up to 2 free visitor passes for your day event.
                            </p>
                          </div>

                          <div className="text-xs text-white/60 space-y-1">
                            <p>• Snacks (tea/coffee) during reporting/performance window</p>
                            <p>• 2 complimentary visitor passes included</p>
                          </div>
                               </>
                             )}
                        </div>
                      </div>
                       );
                     })}

                    {Array.from(eventsByCategory.entries()).map(([category, events]) => {
                      const displayCategory = category;
                      const isFlagship = category === 'Flagship';
                      return (
                      <div key={category} className="mb-6 sm:mb-8">
                        <h3 className={`text-xl sm:text-2xl font-extrabold text-white mb-3 sm:mb-4`}>
                          <span className={`bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-transparent`}>
                            {displayCategory}
                          </span>
                        </h3>
                        <div className="space-y-2 sm:space-y-3">
                          {events.map(event => {
                            const isSelected = selectedEventIds.includes(event.id);
                        const hasConflict = hasTimeConflict(event.id);
                        const conflictMessage = getConflictMessage(event.id);
                        const isDisabled = hasConflict && !isSelected;
                        
                        return (
                          <motion.div
                            key={event.id}
                                onMouseDown={() => !isDisabled && handleToggleEvent(event.id)}
                                whileHover={!isDisabled && reducedMotion ? undefined : { scale: 1.01 }}
                                className={`relative p-4 sm:p-5 rounded-lg sm:rounded-xl transition-colors duration-150 border overflow-hidden touch-manipulation ${
                              isSelected
                                    ? 'glass border-fuchsia-400/40 shadow-[0_0_18px_rgba(217,70,239,0.35)] cursor-pointer'
                                : isDisabled
                                    ? 'glass border-white/10 cursor-pointer opacity-100'
                                    : 'glass border-white/10 hover:border-cyan-400/40 hover:shadow-[0_0_16px_rgba(34,211,238,0.28)] cursor-pointer'
                                }`}
                              >
                                {/* subtle animated shine */}
                                {!reducedMotion && (
                                  <div className="pointer-events-none absolute -inset-1 opacity-0 hover:opacity-100 transition-opacity duration-500">
                                    <div className="absolute -top-8 -left-10 h-20 w-36 rotate-12 bg-gradient-to-r from-white/10 to-transparent blur-xl"></div>
                            </div>
                                )}
                                <div className="flex justify-between items-start sm:items-center gap-2">
                            <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-base sm:text-lg truncate">{event.title}</h4>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                                      <p className="text-sm sm:text-base text-cyan-300">{event.price}</p>
                                      <div className="flex items-center gap-1 sm:gap-2">
                                      <button
                                        onClick={(e) => { e.stopPropagation(); e.preventDefault(); const ed = eventDataById.get(event.id); if (ed) setInfoEvent(ed); }} // prettier-ignore
                                          className="text-[11px] sm:text-xs px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 cursor-pointer touch-manipulation"
                                        aria-label={`View info for ${event.title}`}
                                      >
                                        Info
                                      </button>
                                        {event.teamSize && <span className="text-[11px] sm:text-xs text-white/60">👥 {event.teamSize}</span>}
                                      </div>
                                </div>
                                    {/* Date/time intentionally hidden on checkout page */}
                                    <div className="flex items-center gap-2 text-xs text-white/70"></div>
                              {isDisabled && conflictMessage && (
                                      <div className="mt-2 text-xs text-red-400 flex items-center gap-1">
                                        <span>⚠️</span>
                                        <span>{conflictMessage}</span>
                                </div>
                              )}
                            </div>
                                  {isSelected && (
                                    <div className="relative">
                                      <span className="absolute -inset-2 rounded-full bg-fuchsia-500/30 blur-md"></span>
                                      <Check className="relative w-5 h-5 text-fuchsia-300" />
                          </div>
                                  )}
                              </div>
                        </motion.div>
                        );
                      })}
                    </div>
                      </div>
                    );
                    })}
                    {/* Visitor Pass Section - Moved outside the loop */}
                    <div className="mb-6 sm:mb-8">
                      <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-3 sm:mb-4">
                        <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-transparent">Visitor Pass</span>
                      </h3>
                      <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 shadow-[0_0_22px_rgba(255,193,7,0.18)]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-yellow-200 mb-2">Visitor Pass</h4>
                            <p className="text-xs sm:text-sm text-white/70 mb-3">
                              Required for non-participant entry to Sabrang venues. Select number of days for your visitor pass.
                            </p>
                            <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-white/60">
                              <span>Price: ₹69 per day</span>
                              <span>•</span>
                              <span>Non-transferable</span>
                              <span>•</span>
                              <span>Non-refundable</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-center sm:justify-end gap-3">
                            <button
                              onClick={() => setVisitorPassDays(Math.max(0, visitorPassDays - 1))}
                              disabled={visitorPassDays === 0}
                              className="w-10 h-10 sm:w-8 sm:h-8 rounded-full bg-white/10 border border-white/20 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center touch-manipulation"
                            >
                              -
                            </button>
                            <span className="text-lg sm:text-lg font-semibold min-w-[2.5rem] sm:min-w-[2rem] text-center">{visitorPassDays}</span>
                            <button
                              onClick={() => setVisitorPassDays(Math.min(3, visitorPassDays + 1))}
                              disabled={visitorPassDays >= 3}
                              className="w-10 h-10 sm:w-8 sm:h-8 rounded-full bg-white/10 border border-white/20 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center touch-manipulation"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        {visitorPassDays > 0 && (
                          <div className="mt-4 pt-4 border-t border-white/10">
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">Visitor Pass ({visitorPassDays} day{visitorPassDays > 1 ? 's' : ''})</span>
                              <span className="text-yellow-400 font-medium">₹{visitorPassDays * 69}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="lg:sticky lg:top-8">
                    <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 shadow-[0_0_24px_rgba(59,130,246,0.18)]">
                      <div className="pointer-events-none absolute -top-10 right-0 h-24 w-24 rounded-full bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-400/20 blur-2xl"></div>
                      <h3 className="font-semibold text-cyan-200 mb-4 sm:mb-6 text-sm sm:text-base">Selected Items</h3>
                      <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                        {visitorPassDays > 0 && (
                          <li className="flex justify-between items-start">
                            <div className="flex-1 pr-2 sm:pr-4">
                              <div className="font-medium text-white text-xs sm:text-sm">Visitor Pass ({visitorPassDays} day{visitorPassDays > 1 ? 's' : ''})</div>
                              <div className="text-[10px] sm:text-xs text-white/70 mt-1">Non-participant entry</div>
                            </div>
                            <span className="text-yellow-400 font-semibold text-right text-xs sm:text-sm">₹{visitorPassDays * 69}</span>
                          </li>
                        )}
                        {Object.entries(flagshipBenefitsByEvent).map(([eventId, benefits]) => {
                          const event = selectedEvents.find(e => e.id === parseInt(eventId, 10));
                          if (!event) return null;
                          
                          return (
                            <React.Fragment key={eventId}>
                              {benefits.supportArtistQuantity > 0 && (
                                <li className="flex justify-between items-start">
                                  <div className="flex-1 pr-4">
                                    <div className="font-medium text-white">Support Artists for {event.title} ({benefits.supportArtistQuantity})</div>
                                    <div className="text-xs text-white/70 mt-1">Flagship group benefit</div>
                                  </div>
                                  <span className="text-green-400 font-semibold text-right">Free</span>
                                </li>
                              )}
                              {benefits.flagshipVisitorPassQuantity > 0 && (
                                <li className="flex justify-between items-start">
                                  <div className="flex-1 pr-4">
                                    <div className="font-medium text-white">Flagship Visitor Passes for {event.title} ({benefits.flagshipVisitorPassQuantity})</div>
                                    <div className="text-xs text-white/70 mt-1">Complimentary with flagship registration</div>
                                  </div>
                                  <span className="text-green-400 font-semibold text-right">Free</span>
                                </li>
                              )}
                              {benefits.flagshipSoloVisitorPassQuantity > 0 && (
                                <li className="flex justify-between items-start">
                                  <div className="flex-1 pr-4">
                                    <div className="font-medium text-white">Flagship Solo Visitor Passes for {event.title} ({benefits.flagshipSoloVisitorPassQuantity})</div>
                                    <div className="text-xs text-white/70 mt-1">Complimentary with flagship solo registration</div>
                                  </div>
                                  <span className="text-green-400 font-semibold text-right">Free</span>
                                </li>
                              )}
                            </React.Fragment>
                          );
                        })}
                        {selectedEvents.map(ev => (
                          <li key={ev.id} className="flex justify-between items-start">
                            <div className="flex-1 pr-4">
                              <div className="font-medium text-white">{ev.title}</div>
                              <div className="text-xs text-white/70 mt-1">
                                {ev.title.includes('PANACHE') && 'Team (Group)'}
                                {ev.title.includes('BANDJAM') && 'Team (Group)'}
                                {ev.title.includes('DANCE BATTLE') && 'Team (Group)'}
                                {ev.title.includes('STEP UP') && 'Solo'}
                                {ev.title.includes('ECHOES OF NOOR') && 'Solo/Duo'}
                                {ev.title.includes('VERSEVAAD') && 'Solo/Duo'}
                                {!ev.title.includes('PANACHE') && !ev.title.includes('BANDJAM') && !ev.title.includes('DANCE BATTLE') && !ev.title.includes('STEP UP') && !ev.title.includes('ECHOES OF NOOR') && !ev.title.includes('VERSEVAAD') && ''}
                              </div>
                            </div>
                            <span className="text-green-400 font-semibold text-right">{ev.price}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t border-white/20 mt-6 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-white">Total</span>
                          <span className="text-lg font-bold text-white">₹{formatPrice(finalPrice)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          goNext();
                        }}
                        disabled={selectedEventIds.length === 0 && visitorPassDays === 0}
                        className={`relative w-full mt-6 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-white font-semibold transition-all duration-300 ${
                          (selectedEventIds.length === 0 && visitorPassDays === 0)
                            ? 'bg-gray-600 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 hover:scale-105 cursor-pointer shadow-lg'
                        }`}
                      >
                        <>Continue <ArrowRight className="w-4 h-4" /></>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            {step === 'forms' && (
              <motion.div
                key="forms"
                initial={reducedMotion ? false : { opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: reducedMotion ? 0.15 : 0.25 }}
              >
                <div className="grid lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  <div className="lg:col-span-3">
                    {/* Important Email Notice - Mobile Optimized */}
                    <div className="bg-red-500/15 border border-red-400/40 rounded-lg p-3 mb-4 sm:mb-6 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0">
                          <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                            <span className="text-red-400 text-xs font-bold">!</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-red-200 font-semibold mb-2 text-sm">⚠️ Important: Email Verification Required</h3>
                          <p className="text-xs text-red-100 leading-relaxed">
                            <strong>Make sure you enter the correct email address!</strong> You will receive all OTPs, tokens, and important updates on the email you provide. 
                            <span className="block mt-1 text-red-200 font-medium text-xs">
                              If you enter a wrong email, your registration will Not be refundable.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 title-chroma text-center sm:text-left">Your Details</h2>
                    {fieldGroups.length === 0 && (
                      <p className="text-xs sm:text-sm text-gray-400">No events selected. Go back and pick at least one event.</p>
                    )}
                    <div className="space-y-6 sm:space-y-8">
                      {/* Visitor Pass Details Section - Mobile Optimized */}
                      {visitorPassDays > 0 && (
                        <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 shadow-[0_0_22px_rgba(255,193,7,0.18)]">
                          <div className="mb-3 sm:mb-4 text-center sm:text-left">
                            <h3 className="font-semibold text-yellow-200 text-sm sm:text-base">Visitor Pass Details ({visitorPassDays} day{visitorPassDays > 1 ? 's' : ''})</h3>
                            <p className="text-[10px] sm:text-xs text-gray-400">Fill details for your visitor pass. This pass will be valid for {visitorPassDays} day{visitorPassDays > 1 ? 's' : ''}.</p>
                          </div>
                          <div className="glass rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10">
                                <div className="flex justify-between items-center mb-3 sm:mb-4">
                              <h4 className="text-xs sm:text-sm font-medium text-white/90">Visitor Pass</h4>
                              <div className="text-[10px] sm:text-xs text-yellow-400 font-medium">₹{visitorPassDays * 69}</div>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                  {VISITOR_PASS_FIELDS.map(field => {
                                const error = (formErrors['visitorPasses'] || {})[`visitor_${field.name}`];
                                const value = visitorPassDetails[field.name] || '';
                                    const inputType = field.type === 'phone' ? 'tel' : (field.type === 'number' ? 'number' : (field.type === 'email' ? 'email' : 'text'));
                                    return (
                                      <div key={field.name} className="flex flex-col">
                                        <label className="text-[10px] sm:text-xs text-white/70 mb-1 text-left">
                                          {field.label}{field.required && <span className="text-pink-400">*</span>}
                                        </label>
                                        {field.type === 'select' ? (
                                          <select
                                            required={!!field.required}
                                            className={`bg-black/40 border ${error ? 'border-pink-500' : 'border-white/20'} rounded-lg px-3 h-12 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-base sm:text-sm touch-manipulation`}
                                            value={value}
                                            onChange={e => {
                                          setVisitorPassDetails(prev => ({ ...prev, [field.name]: e.target.value }));
                                            }}
                                          >
                                            <option value="">Select</option>
                                            {(field.options || []).map(opt => (
                                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                          </select>
                                        ) : field.type === 'file' ? (
                                          <div className="relative">
                                            <div className="text-[10px] sm:text-xs text-white/60 mb-1">Max file size 500 KB</div>
                                            <input
                                              type="file"
                                              accept={field.accept || '*'}
                                              required={!!field.required}
                                              className={`block max-w-full overflow-hidden bg-black/40 border ${error ? 'border-pink-500' : 'border-white/20'} rounded-lg sm:rounded-xl px-3 py-2.5 sm:py-2 w-full text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 file:mr-2 sm:file:mr-4 file:py-2 file:px-3 sm:file:px-3 file:rounded-lg file:border-0 file:text-base sm:file:text-sm file:font-medium file:bg-purple-500 file:text-white hover:file:bg-purple-600 file:cursor-pointer cursor-pointer touch-manipulation`}
                                              onChange={e => {
                                                const file = e.target.files?.[0] || null;
                                                if (file && file.size > 500 * 1024) {
                                                  alert('File too large. Maximum 500 KB allowed.');
                                                  e.currentTarget.value = '';
                                                  return;
                                                }
                                                setVisitorPassDetails(prev => ({ ...prev, [field.name]: file?.name || '' }));
                                              }}
                                            />
                                          </div>
                                        ) : (
                                          <input
                                            type={inputType}
                                            inputMode={field.type === 'phone' ? 'tel' : undefined}
                                            required={!!field.required}
                                            className={`bg-black/40 border ${error ? 'border-pink-500' : 'border-white/20'} rounded-lg px-3 h-12 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-white/40 text-base sm:text-sm touch-manipulation`}
                                            placeholder={field.placeholder || ''}
                                            value={value}
                                            onChange={e => {
                                          setVisitorPassDetails(prev => ({ ...prev, [field.name]: e.target.value }));
                                            }}
                                          />
                                        )}
                                        {error && <span className="text-[10px] sm:text-xs text-pink-400 mt-1">{error}</span>}
                                      </div>
                                    );
                                  })}
                                </div>
                          </div>
                        </div>
                      )}

                      {/* Flagship Benefits Forms */}
                      {Object.entries(flagshipBenefitsByEvent).map(([eventId, benefits]) => {
                        const event = selectedEvents.find(e => e.id === parseInt(eventId, 10));
                        if (!event) return null;
                        
                        return (
                          <React.Fragment key={eventId}>
                            {/* Support Artists Forms */}
                            {benefits.supportArtistQuantity > 0 && (
                              <div className="glass rounded-2xl p-6 border border-white/10 shadow-[0_0_22px_rgba(168,85,247,0.18)]">
                                <div className="mb-4">
                                  <h3 className="font-semibold text-purple-200">Support Artists for {event.title}</h3>
                                  <p className="text-xs text-gray-400">Fill details for {benefits.supportArtistQuantity} support artist{benefits.supportArtistQuantity > 1 ? 's' : ''} (makeup, stylist, manager, etc.)</p>
                                </div>
                                <div className="space-y-4">
                                  {benefits.supportArtistDetails.map((artist, index) => (
                                    <div key={index} className="glass rounded-xl p-4 border border-white/10">
                                      <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-sm font-medium text-white/90">Support Artist {index + 1}</h4>
                                        <div className="text-xs text-purple-400 font-medium">Free</div>
                                      </div>
                                      <div className="grid md:grid-cols-2 gap-4">
                                        {SUPPORT_ARTIST_FIELDS.map(field => {
                                          const error = (formErrors[`supportArtists_${eventId}`] || {})[`artist_${index}_${field.name}`];
                                          const value = artist[field.name] || '';
                                          const inputType = field.type === 'phone' ? 'tel' : (field.type === 'number' ? 'number' : (field.type === 'email' ? 'email' : 'text'));
                                          return (
                                            <div key={field.name} className="flex flex-col">
                                              <label className="text-xs text-white/70 mb-1">
                                                {field.label}{field.required && <span className="text-pink-400">*</span>}
                                              </label>
                                              {field.type === 'select' ? (
                                                <select
                                                  required={!!field.required}
                                                  className={`bg-black/40 border ${error ? 'border-pink-500' : 'border-white/20'} rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm`}
                                                  value={value}
                                                  onChange={e => {
                                                    setFlagshipBenefitsByEvent(prev => ({
                                                      ...prev,
                                                      [eventId]: {
                                                        ...prev[parseInt(eventId, 10)],
                                                        supportArtistDetails: prev[parseInt(eventId, 10)].supportArtistDetails.map((detail: Record<string, string>, idx: number) => 
                                                          idx === index ? { ...detail, [field.name]: e.target.value } : detail
                                                        )
                                                      }
                                                    }));
                                                  }}
                                                >
                                                  <option value="">Select</option>
                                                  {(field.options || []).map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                  ))}
                                                </select>
                                              ) : field.type === 'file' ? (
                                                <input
                                                  type="file"
                                                  accept={field.accept || '*'}
                                                  required={!!field.required}
                                                  className={`bg-black/40 border ${error ? 'border-pink-500' : 'border-white/20'} rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-500 file:text-white hover:file:bg-purple-600 file:cursor-pointer cursor-pointer`}
                                                  onChange={e => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                      setFlagshipBenefitsByEvent(prev => ({
                                                        ...prev,
                                                        [eventId]: {
                                                          ...prev[parseInt(eventId, 10)],
                                                          supportArtistDetails: prev[parseInt(eventId, 10)].supportArtistDetails.map((detail: Record<string, string>, idx: number) => 
                                                            idx === index ? { ...detail, [field.name]: file } : detail
                                                          )
                                                        }
                                                      }));
                                                    }
                                                  }}
                                                />
                                              ) : (
                                                <input
                                                  type={inputType}
                                                  inputMode={field.type === 'phone' ? 'tel' : undefined}
                                                  required={!!field.required}
                                                  className={`bg-black/40 border ${error ? 'border-pink-500' : 'border-white/20'} rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-white/40 text-sm`}
                                                  placeholder={field.placeholder || ''}
                                                  value={value}
                                                  onChange={e => {
                                                    setFlagshipBenefitsByEvent(prev => ({
                                                      ...prev,
                                                      [eventId]: {
                                                        ...prev[parseInt(eventId, 10)],
                                                        supportArtistDetails: prev[parseInt(eventId, 10)].supportArtistDetails.map((detail: Record<string, string>, idx: number) => 
                                                          idx === index ? { ...detail, [field.name]: e.target.value } : detail
                                                        )
                                                      }
                                                    }));
                                                  }}
                                                />
                                              )}
                                              {error && <span className="text-xs text-pink-400 mt-1">{error}</span>}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Flagship Visitor Passes Forms */}
                            {benefits.flagshipVisitorPassQuantity > 0 && (
                              <div className="glass rounded-2xl p-6 border border-white/10 shadow-[0_0_22px_rgba(59,130,246,0.18)]">
                                <div className="mb-4">
                                  <h3 className="font-semibold text-blue-200">Flagship Visitor Passes for {event.title}</h3>
                                  <p className="text-xs text-gray-400">Fill details for {benefits.flagshipVisitorPassQuantity} complimentary visitor pass{benefits.flagshipVisitorPassQuantity > 1 ? 'es' : ''}</p>
                                </div>
                                <div className="space-y-4">
                                  {benefits.flagshipVisitorPassDetails.map((visitor, index) => (
                                    <div key={index} className="glass rounded-xl p-4 border border-white/10">
                                      <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-sm font-medium text-white/90">Visitor Pass {index + 1}</h4>
                                        <div className="text-xs text-green-400 font-medium">Free</div>
                                      </div>
                                      <div className="grid md:grid-cols-2 gap-4">
                                        {VISITOR_PASS_FIELDS.map(field => {
                                          const error = (formErrors[`flagshipVisitorPasses_${eventId}`] || {})[`flagship_visitor_${index}_${field.name}`];
                                          const value = visitor[field.name] || '';
                                          const inputType = field.type === 'phone' ? 'tel' : (field.type === 'number' ? 'number' : (field.type === 'email' ? 'email' : 'text'));
                                          return (
                                            <div key={field.name} className="flex flex-col">
                                              <label className="text-xs text-white/70 mb-1">
                                                {field.label}{field.required && <span className="text-pink-400">*</span>}
                                              </label>
                                              {field.type === 'select' ? (
                                                <select
                                                  required={!!field.required}
                                                  className={`bg-black/40 border ${error ? 'border-pink-500' : 'border-white/20'} rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm`}
                                                  value={value}
                                                  onChange={e => {
                                                    setFlagshipBenefitsByEvent(prev => ({
                                                      ...prev,
                                                      [eventId]: {
                                                        ...prev[parseInt(eventId, 10)],
                                                        flagshipVisitorPassDetails: prev[parseInt(eventId, 10)].flagshipVisitorPassDetails.map((detail: Record<string, string>, idx: number) => 
                                                          idx === index ? { ...detail, [field.name]: e.target.value } : detail
                                                        )
                                                      }
                                                    }));
                                                  }}
                                                >
                                                  <option value="">Select</option>
                                                  {(field.options || []).map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                  ))}
                                                </select>
                                              ) : field.type === 'file' ? (
                                                <div className="relative">
                                                  <div className="text-xs text-white/60 mb-1">Max file size 500 KB</div>
                                                  <input
                                                    type="file"
                                                    accept={field.accept || '*'}
                                                    required={!!field.required}
                                                    className={`block max-w-full overflow-hidden bg-black/40 border ${error ? 'border-pink-500' : 'border-white/20'} rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 file:mr-2 sm:file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-base sm:file:text-sm file:font-medium file:bg-purple-500 file:text-white hover:file:bg-purple-600 file:cursor-pointer cursor-pointer`}
                                                    onChange={e => {
                                                      const file = e.target.files?.[0] || null;
                                                      if (file && file.size > 500 * 1024) {
                                                        alert('File too large. Maximum 500 KB allowed.');
                                                        e.currentTarget.value = '';
                                                        return;
                                                      }
                                                      setFlagshipBenefitsByEvent(prev => ({
                                                        ...prev,
                                                        [eventId]: {
                                                          ...prev[parseInt(eventId, 10)],
                                                          flagshipVisitorPassDetails: prev[parseInt(eventId, 10)].flagshipVisitorPassDetails.map((detail: Record<string, string>, idx: number) => 
                                                            idx === index ? { ...detail, [field.name]: file?.name || '' } : detail
                                                          )
                                                        }
                                                      }));
                                                    }}
                                                  />
                                                </div>
                                              ) : (
                                                <input
                                                  type={inputType}
                                                  inputMode={field.type === 'phone' ? 'tel' : undefined}
                                                  required={!!field.required}
                                                  className={`bg-black/40 border ${error ? 'border-pink-500' : 'border-white/20'} rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-white/40 text-sm`}
                                                  placeholder={field.placeholder || ''}
                                                  value={value}
                                                  onChange={e => {
                                                    setFlagshipBenefitsByEvent(prev => ({
                                                      ...prev,
                                                      [eventId]: {
                                                        ...prev[parseInt(eventId, 10)],
                                                        flagshipVisitorPassDetails: prev[parseInt(eventId, 10)].flagshipVisitorPassDetails.map((detail: Record<string, string>, idx: number) => 
                                                          idx === index ? { ...detail, [field.name]: e.target.value } : detail
                                                        )
                                                      }
                                                    }));
                                                  }}
                                                />
                                              )}
                                              {error && <span className="text-xs text-pink-400 mt-1">{error}</span>}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Flagship Solo Visitor Passes Forms */}
                            {benefits.flagshipSoloVisitorPassQuantity > 0 && (
                              <div className="glass rounded-2xl p-6 border border-white/10 shadow-[0_0_22px_rgba(34,197,94,0.18)]">
                                <div className="mb-4">
                                  <h3 className="font-semibold text-green-200">Flagship Solo Visitor Passes for {event.title}</h3>
                                  <p className="text-xs text-gray-400">Fill details for {benefits.flagshipSoloVisitorPassQuantity} complimentary solo visitor pass{benefits.flagshipSoloVisitorPassQuantity > 1 ? 'es' : ''}</p>
                                </div>
                                <div className="space-y-4">
                                  {benefits.flagshipSoloVisitorPassDetails.map((visitor, index) => (
                                    <div key={index} className="glass rounded-xl p-4 border border-white/10">
                                      <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-sm font-medium text-white/90">Solo Visitor Pass {index + 1}</h4>
                                        <div className="text-xs text-green-400 font-medium">Free</div>
                                      </div>
                                      <div className="grid md:grid-cols-2 gap-4">
                                        {VISITOR_PASS_FIELDS.map(field => {
                                          const error = (formErrors[`flagshipSoloVisitorPasses_${eventId}`] || {})[`flagship_solo_visitor_${index}_${field.name}`];
                                          const value = visitor[field.name] || '';
                                          const inputType = field.type === 'phone' ? 'tel' : (field.type === 'number' ? 'number' : (field.type === 'email' ? 'email' : 'text'));
                                          return (
                                            <div key={field.name} className="flex flex-col">
                                              <label className="text-xs text-white/70 mb-1">
                                                {field.label}{field.required && <span className="text-pink-400">*</span>}
                                              </label>
                                              {field.type === 'select' ? (
                                                <select
                                                  required={!!field.required}
                                                  className={`bg-black/40 border ${error ? 'border-pink-500' : 'border-white/20'} rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm`}
                                                  value={value}
                                                  onChange={e => {
                                                    setFlagshipBenefitsByEvent(prev => ({
                                                      ...prev,
                                                      [eventId]: {
                                                        ...prev[parseInt(eventId, 10)],
                                                        flagshipSoloVisitorPassDetails: prev[parseInt(eventId, 10)].flagshipSoloVisitorPassDetails.map((detail: Record<string, string>, idx: number) => 
                                                          idx === index ? { ...detail, [field.name]: e.target.value } : detail
                                                        )
                                                      }
                                                    }));
                                                  }}
                                                >
                                                  <option value="">Select</option>
                                                  {(field.options || []).map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                  ))}
                                                </select>
                                              ) : field.type === 'file' ? (
                                                <div className="relative">
                                                  <div className="text-xs text-white/60 mb-1">Max file size 500 KB</div>
                                                  <input
                                                    type="file"
                                                    accept={field.accept || '*'}
                                                    required={!!field.required}
                                                    className={`block max-w-full overflow-hidden bg-black/40 border ${error ? 'border-pink-500' : 'border-white/20'} rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 file:mr-2 sm:file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-base sm:file:text-sm file:font-medium file:bg-purple-500 file:text-white hover:file:bg-purple-600 file:cursor-pointer cursor-pointer`}
                                                    onChange={e => {
                                                      const file = e.target.files?.[0] || null;
                                                      if (file && file.size > 500 * 1024) {
                                                        alert('File too large. Maximum 500 KB allowed.');
                                                        e.currentTarget.value = '';
                                                        return;
                                                      }
                                                      setFlagshipBenefitsByEvent(prev => ({
                                                        ...prev,
                                                        [eventId]: {
                                                          ...prev[parseInt(eventId, 10)],
                                                          flagshipSoloVisitorPassDetails: prev[parseInt(eventId, 10)].flagshipSoloVisitorPassDetails.map((detail: Record<string, string>, idx: number) => 
                                                            idx === index ? { ...detail, [field.name]: file?.name || '' } : detail
                                                          )
                                                        }
                                                      }));
                                                    }}
                                                  />
                                                </div>
                                              ) : (
                                                <input
                                                  type={inputType}
                                                  inputMode={field.type === 'phone' ? 'tel' : undefined}
                                                  required={!!field.required}
                                                  className={`bg-black/40 border ${error ? 'border-pink-500' : 'border-white/20'} rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-white/40 text-sm`}
                                                  placeholder={field.placeholder || ''}
                                                  value={value}
                                                  onChange={e => {
                                                    setFlagshipBenefitsByEvent(prev => ({
                                                      ...prev,
                                                      [eventId]: {
                                                        ...prev[parseInt(eventId, 10)],
                                                        flagshipSoloVisitorPassDetails: prev[parseInt(eventId, 10)].flagshipSoloVisitorPassDetails.map((detail: Record<string, string>, idx: number) => 
                                                          idx === index ? { ...detail, [field.name]: e.target.value } : detail
                                                        )
                                                      }
                                                    }));
                                                  }}
                                                />
                                              )}
                                              {error && <span className="text-xs text-pink-400 mt-1">{error}</span>}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}

                      {fieldGroups.map(group => (
                        <div key={group.signature} className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 shadow-[0_0_22px_rgba(236,72,153,0.18)]">
                          <div className="mb-4 text-center sm:text-left">
                            <h3 className="font-semibold text-fuchsia-200 text-sm sm:text-base">
                              {group.events.length > 1 
                                ? `For: ${group.events.map(e => e.title).join(', ')}` 
                                : `For: ${group.events[0].title}`
                              }
                            </h3>
                            <p className="text-xs text-gray-400">
                              {group.events.length > 1 
                                ? `Fill these details once for all selected solo events.` 
                                : `Fill these details for this specific event.`
                              }
                            </p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            {group.fields.map((field, idx) => {
                              const value = (formDataBySignature[group.signature] || {})[field.name] || '';
                              const error = (formErrors[group.signature] || {})[field.name];
                              const inputType = field.type === 'phone' ? 'tel' : (field.type === 'number' ? 'number' : (field.type === 'email' ? 'email' : 'text'));
                              const inputId = `g-${group.events.map(e => e.id).join('-')}-f-${idx}-${field.name}`;
                              const errorId = `${inputId}-error`;
                          return (
                                <div key={field.name} className="flex flex-col">
                                  <label htmlFor={inputId} className="text-xs sm:text-sm text-white/80 mb-1 text-left">
                                    {field.label}{field.required ? <span className="text-pink-400"> *</span> : null}
                                  </label>
                                  {field.type === 'select' ? (
                                    <select
                                      id={inputId}
                                      required={!!field.required}
                                      aria-describedby={error ? errorId : undefined}
                                      className={`bg-black/40 border ${error ? 'border-pink-500' : 'border-white/20'} rounded-lg px-3 h-12 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-base sm:text-sm touch-manipulation`}
                                      value={value}
                                      onChange={e => handleFieldChange(group.signature, field.name, e.target.value)}
                                    >
                                      <option value="">Select</option>
                                      {(field.options || []).map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                      ))}
                                    </select>
                                  ) : field.type === 'file' ? (
                                    <div className="relative">
                                      <div className="text-xs text-white/60 mb-1">Max file size 500 KB</div>
                                      <input
                                        id={inputId}
                                        type="file"
                                        accept={field.accept || '*'}
                                        required={!!field.required}
                                        aria-describedby={error ? errorId : undefined}
                                        className={`bg-black/40 border ${error ? 'border-pink-500' : 'border-white/20'} rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-500 file:text-white hover:file:bg-purple-600 file:cursor-pointer cursor-pointer`}
                                        onChange={e => {
                                          const file = e.target.files?.[0] || null;
                                          if (file && file.size > 500 * 1024) {
                                            alert('File too large. Maximum 500 KB allowed.');
                                            e.currentTarget.value = '';
                                            handleFileChange(group.signature, field.name, null);
                                            return;
                                          }
                                          handleFileChange(group.signature, field.name, file);
                                        }}
                                      />
                                    </div>
                                  ) : (
                                    <input
                                      id={inputId}
                                      type={inputType}
                                      inputMode={field.type === 'phone' ? 'tel' : undefined}
                                      required={!!field.required}
                                      aria-describedby={error ? errorId : undefined}
                                      className={`bg-black/40 border ${error ? 'border-pink-500' : 'border-white/20'} rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-white/40 text-sm touch-manipulation`}
                                      placeholder={field.placeholder || ''}
                                      value={value}
                                      onChange={e => handleFieldChange(group.signature, field.name, e.target.value)}
                                    />
                                  )}
                                  {error && <span id={errorId} className="text-xs text-pink-400 mt-1">{error}</span>}
                            </div>
                          );
                        })}
                      </div>
                      {(() => {
                        const isTeamGroup = group.fields.some(f => f.name === 'numMembers' || f.name === 'teamName' || f.name === 'captainName');
                        if (!isTeamGroup) return null;
                        
                        // Additional check: only show team member forms for events that actually support multiple members
                        const event = group.events[0];
                        const teamConfig = event ? getTeamSizeConfig(event.title) : null;
                        const supportsMultipleMembers = teamConfig && teamConfig.max > 1;
                        
                        if (!supportsMultipleMembers) return null;
                        
                        const members = teamMembersBySignature[group.signature] || [];
                        const groupErrors = formErrors[group.signature] || {};
                        return (
                          <div className="mt-6">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-cyan-200">Team Members</h4>
                              <div className="flex gap-2">
                                {(() => {
                                  const event = group.events[0];
                                  const teamConfig = event ? getTeamSizeConfig(event.title) : null;
                                  const currentMemberCount = members.length;
                                  const currentTotalSize = currentMemberCount + 1; // +1 for leader
                                  const maxAllowed = teamConfig ? teamConfig.max : Infinity;
                                  const canAdd = currentTotalSize < maxAllowed;
                                  
                                  return (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (canAdd) {
                                          setTeamMembersBySignature(prev => ({
                                            ...prev,
                                            [group.signature]: [...(prev[group.signature] || []), SOLO_FIELDS.reduce((acc, f) => ({ ...acc, [f.name]: '' }), {})]
                                          }));
                                        }
                                      }}
                                      disabled={!canAdd}
                                      className={`px-3 py-1.5 rounded-lg text-sm ${
                                        canAdd 
                                          ? 'bg-white/10 hover:bg-white/15 cursor-pointer' 
                                          : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                                      }`}
                                      title={canAdd ? 'Add team member' : `Cannot add - maximum ${maxAllowed} members allowed`}
                                    >
                                      Add team member
                                    </button>
                                  );
                                })()}
                                {members.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setTeamMembersBySignature(prev => ({
                                        ...prev,
                                        [group.signature]: []
                                      }));
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 cursor-pointer text-sm"
                                  >
                                    Clear all
                                  </button>
                                )}
                              </div>
                            </div>
                            {(() => {
                              const event = group.events[0];
                              const teamConfig = event ? getTeamSizeConfig(event.title) : null;
                              
                              if (teamConfig) {
                                return (
                                  <div className="text-xs text-white/60 space-y-1">
                                    <p>Team size: {teamConfig.min}{teamConfig.min !== teamConfig.max ? ` - ${teamConfig.max}` : ''} members</p>
                                    <p>Current: {members.length + 1} members (including team leader)</p>
                                    {members.length === 0 && teamConfig.min > 1 && (
                                      <p>⚠️ You need to add {teamConfig.min - 1} more team member(s) to meet minimum requirements.</p>
                                    )}
                                  </div>
                                );
                              }
                              
                              if (members.length === 0) {
                                return <p className="text-xs text-white/60">Click "Add team member" to enter details for each member.</p>;
                              }
                              
                              return null;
                            })()}
                            {groupErrors['teamMembers'] && (
                              <div className="text-xs text-pink-400 mb-2">{groupErrors['teamMembers']}</div>
                            )}
                            <div className="space-y-3">
                              {members.map((m, idx) => (
                                <div key={idx} className="glass rounded-xl p-4 border border-white/10">
                                  <div className="flex justify-between items-center mb-3">
                                    <h5 className="text-sm font-medium text-white/90">Member {idx + 1}</h5>
                                    {(() => {
                                      const event = group.events[0];
                                      const teamConfig = event ? getTeamSizeConfig(event.title) : null;
                                      const currentMemberCount = members.length;
                                      const minRequired = teamConfig ? teamConfig.min - 1 : 0; // -1 because leader is in main form
                                      const canRemove = currentMemberCount > minRequired;
                                      
                                      return (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (canRemove) {
                                              setTeamMembersBySignature(prev => {
                                                const arr = [...(prev[group.signature] || [])];
                                                arr.splice(idx, 1);
                                                return { ...prev, [group.signature]: arr };
                                              });
                                            }
                                          }}
                                          disabled={!canRemove}
                                          className={`px-2 py-1 rounded-md text-xs ${
                                            canRemove 
                                              ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 cursor-pointer' 
                                              : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                                          }`}
                                          title={canRemove ? 'Remove member' : `Cannot remove - minimum ${teamConfig?.min || 1} members required`}
                                        >
                                          Remove
                                        </button>
                                      );
                                    })()}
                                  </div>
                                  <div className="grid md:grid-cols-2 gap-3">
                                    {SOLO_FIELDS.map(field => {
                                      const error = groupErrors[`member_${idx}_${field.name}`];
                                      const value = m[field.name] || '';
                                      const inputType = field.type === 'phone' ? 'tel' : (field.type === 'number' ? 'number' : (field.type === 'email' ? 'email' : 'text'));
                                      return (
                                        <div key={field.name} className="flex flex-col">
                                          <label className="text-xs text-white/70 mb-1">{field.label}{field.required && <span className="text-pink-400">*</span>}</label>
                                          {field.type === 'select' ? (
                                            <select
                                              required={!!field.required}
                                              className={`bg-black/40 border ${error ? 'border-pink-500' : 'border-white/20'} rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm`}
                                              value={value}
                                              onChange={e => {
                                                const v = e.target.value;
                                                setTeamMembersBySignature(prev => {
                                                  const arr = [...(prev[group.signature] || [])];
                                                  arr[idx] = { ...arr[idx], [field.name]: v };
                                                  return { ...prev, [group.signature]: arr };
                                                });
                                              }}
                                            >
                                              <option value="">Select</option>
                                              {(field.options || []).map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                                            </select>
                                          ) : field.type === 'file' ? (
                                            <>
                                              <input
                                                type="file"
                                                accept={field.accept || 'image/*'}
                                                required={!!field.required}
                                                className={`block max-w-full overflow-hidden bg-black/40 border ${error ? 'border-pink-500' : 'border-white/20'} rounded-xl px-3 py-2 w-full text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 file:mr-2 sm:file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-base sm:file:text-sm file:font-medium file:bg-purple-500 file:text-white hover:file:bg-purple-600 file:cursor-pointer cursor-pointer`}
                                                onChange={e => {
                                                  const file = e.target.files?.[0] || null;
                                                  handleMemberFileChange(group.signature, idx, file);
                                                  // also store filename for display if needed
                                                  const filename = file?.name || '';
                                                  setTeamMembersBySignature(prev => {
                                                    const arr = [...(prev[group.signature] || [])];
                                                    arr[idx] = { ...arr[idx], [field.name]: filename };
                                                    return { ...prev, [group.signature]: arr };
                                                  });
                                                }}
                                              />
                                              {value && (
                                                <span className="text-xs text-green-400 mt-1">Selected: {value}</span>
                                              )}
                                            </>
                                          ) : (
                                            <input
                                              type={inputType}
                                              className={`bg-black/40 border ${error ? 'border-pink-500' : 'border-white/20'} rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-white/40 text-sm`}
                                              placeholder={field.placeholder || ''}
                                              value={value}
                                              onChange={e => {
                                                const v = e.target.value;
                                                setTeamMembersBySignature(prev => {
                                                  const arr = [...(prev[group.signature] || [])];
                                                  arr[idx] = { ...arr[idx], [field.name]: v };
                                                  return { ...prev, [group.signature]: arr };
                                                });
                                              }}
                                            />
                                          )}
                                          {error && <span className="text-xs text-pink-400 mt-1">{error}</span>}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                        </div>
                      ))}


                    </div>
                    <ActionRow
                      connectionQuality={connectionQuality}
                      onSave={() => {
                        try {
                          const toSave = {
                            selectedEventIds,
                            visitorPassDays,
                            visitorPassDetails,
                            formDataBySignature,
                            teamMembersBySignature,
                            flagshipBenefitsByEvent,
                            promoInput,
                            appliedPromo,
                          };
                          localStorage.setItem('sabrang_checkout_draft_v1', JSON.stringify(toSave));
                          alert('Progress saved locally.');
                        } catch {}
                      }}
                      onFallback={() => window.open(CASHFREE_FALLBACK_FORM_URL, '_blank')}
                      onBack={goBack}
                      onNext={goNext}
                    />
                  </div>
                  <div>
                    <div className="glass rounded-2xl p-6 border border-white/10 shadow-[0_0_24px_rgba(59,130,246,0.18)]">
                      <div className="pointer-events-none absolute -top-10 right-0 h-24 w-24 rounded-full bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-400/20 blur-2xl"></div>
                      <h3 className="font-semibold text-cyan-200 mb-4 sm:mb-6 text-sm sm:text-base">Selected Items</h3>
                      <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                        {visitorPassDays > 0 && (
                          <li className="flex justify-between items-start">
                            <div className="flex-1 pr-2 sm:pr-4">
                              <div className="font-medium text-white text-xs sm:text-sm">Visitor Pass ({visitorPassDays} day{visitorPassDays > 1 ? 's' : ''})</div>
                              <div className="text-[10px] sm:text-xs text-white/70 mt-1">Non-participant entry</div>
                            </div>
                            <span className="text-yellow-400 font-semibold text-right text-xs sm:text-sm">₹{visitorPassDays * 69}</span>
                          </li>
                        )}
                        {Object.entries(flagshipBenefitsByEvent).map(([eventId, benefits]) => {
                          const event = selectedEvents.find(e => e.id === parseInt(eventId, 10));
                          if (!event) return null;
                          
                          return (
                            <React.Fragment key={eventId}>
                              {benefits.supportArtistQuantity > 0 && (
                                <li className="flex justify-between items-start">
                                  <div className="flex-1 pr-4">
                                    <div className="font-medium text-white">Support Artists for {event.title} ({benefits.supportArtistQuantity})</div>
                                    <div className="text-xs text-white/70 mt-1">Flagship group benefit</div>
                                  </div>
                                  <span className="text-green-400 font-semibold text-right">Free</span>
                                </li>
                              )}
                              {benefits.flagshipVisitorPassQuantity > 0 && (
                                <li className="flex justify-between items-start">
                                  <div className="flex-1 pr-4">
                                    <div className="font-medium text-white">Flagship Visitor Passes for {event.title} ({benefits.flagshipVisitorPassQuantity})</div>
                                    <div className="text-xs text-white/70 mt-1">Complimentary with flagship registration</div>
                                  </div>
                                  <span className="text-green-400 font-semibold text-right">Free</span>
                                </li>
                              )}
                              {benefits.flagshipSoloVisitorPassQuantity > 0 && (
                                <li className="flex justify-between items-start">
                                  <div className="flex-1 pr-4">
                                    <div className="font-medium text-white">Flagship Solo Visitor Passes for {event.title} ({benefits.flagshipSoloVisitorPassQuantity})</div>
                                    <div className="text-xs text-white/70 mt-1">Complimentary with flagship solo registration</div>
                                  </div>
                                  <span className="text-green-400 font-semibold text-right">Free</span>
                                </li>
                              )}
                            </React.Fragment>
                          );
                        })}
                        {selectedEvents.map(ev => (
                          <li key={ev.id} className="flex justify-between items-start">
                            <div className="flex-1 pr-4">
                              <div className="font-medium text-white">{ev.title}</div>
                              <div className="text-xs text-white/70 mt-1">
                                {ev.title.includes('PANACHE') && 'Team (Group)'}
                                {ev.title.includes('BANDJAM') && 'Team (Group)'}
                                {ev.title.includes('DANCE BATTLE') && 'Team (Group)'}
                                {ev.title.includes('STEP UP') && 'Solo'}
                                {ev.title.includes('ECHOES OF NOOR') && 'Solo/Duo'}
                                {ev.title.includes('VERSEVAAD') && 'Solo/Duo'}
                                {!ev.title.includes('PANACHE') && !ev.title.includes('BANDJAM') && !ev.title.includes('DANCE BATTLE') && !ev.title.includes('STEP UP') && !ev.title.includes('ECHOES OF NOOR') && !ev.title.includes('VERSEVAAD') && ''}
                              </div>
                            </div>
                            <span className="text-green-400 font-semibold text-right">{ev.price}</span>
                          </li>
                        ))}
                      </ul>
                      {/* Promo code input */}
                      <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
                        <h4 className="text-sm font-medium text-white/90 mb-3">Promo Code</h4>
                        <div className="flex gap-2 items-start flex-wrap md:flex-nowrap">
                          <input
                            type="text"
                            className="min-w-0 flex-1 w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-white/40 text-sm"
                            placeholder="Enter promo code"
                            value={promoInput}
                            onChange={e => setPromoInput(e.target.value.toUpperCase())}
                          />
                          {appliedPromo ? (
                            <button
                              type="button"
                              className="shrink-0 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-sm font-medium whitespace-nowrap"
                              onClick={() => { setAppliedPromo(null); setPromoStatus({ loading: false, error: null }); }}
                            >
                              Remove
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="shrink-0 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-medium whitespace-nowrap"
                              onClick={tryApplyPromo}
                              disabled={promoStatus.loading}
                            >
                              {promoStatus.loading ? 'Applying...' : 'Apply'}
                            </button>
                          )}
                        </div>
                        {promoStatus.error && <div className="text-xs text-pink-400 mt-2">{promoStatus.error}</div>}
                        {appliedPromo && (
                          <div className="text-xs text-green-400 mt-2">Applied {appliedPromo.code}: -₹{formatPrice(appliedPromo.discountAmount)}</div>
                        )}
                      </div>

                      <div className="border-t border-white/20 mt-6 pt-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white/80">Subtotal</span>
                          <span className="text-white/80 font-medium">₹{formatPrice(totalPrice)}</span>
                        </div>
                        {appliedPromo && (
                          <div className="flex justify-between items-center text-green-400">
                            <span>Discount ({appliedPromo.code})</span>
                            <span className="font-medium">-₹{formatPrice(appliedPromo.discountAmount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center pt-2 border-t border-white/10">
                          <span className="text-lg font-bold text-white">Total</span>
                          <span className="text-lg font-bold text-white">₹{formatPrice(finalPrice)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            {step === 'review' && (
              <motion.div
                key="review"
                initial={reducedMotion ? false : { opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: reducedMotion ? 0.15 : 0.25 }}
              >
                <div className="grid lg:grid-cols-4 gap-8">
                  <div className="lg:col-span-3">
                    <h2 className="text-xl font-semibold mb-6 title-chroma">Review</h2>
                    <div className="space-y-8">
                      <div className="glass rounded-2xl p-6 border border-white/10">
                        <h3 className="font-semibold text-cyan-200 mb-6">Selected Items</h3>
                        <ul className="space-y-3 text-sm">
                          {visitorPassDays > 0 && (
                            <li className="flex justify-between items-start">
                              <div className="flex-1 pr-4">
                                <div className="font-medium text-white">Visitor Pass ({visitorPassDays} day{visitorPassDays > 1 ? 's' : ''})</div>
                                <div className="text-xs text-white/70 mt-1">Non-participant entry</div>
                              </div>
                              <span className="text-yellow-400 font-semibold text-right">₹{visitorPassDays * 69}</span>
                            </li>
                          )}
                          {selectedEvents.map(ev => (
                            <li key={ev.id} className="flex justify-between items-start">
                              <div className="flex-1 pr-4">
                                <div className="font-medium text-white">{ev.title}</div>
                                <div className="text-xs text-white/70 mt-1">
                                  {ev.title.includes('PANACHE') && 'Team (Group)'}
                                  {ev.title.includes('BANDJAM') && 'Team (Group)'}
                                  {ev.title.includes('DANCE BATTLE') && 'Team (Group)'}
                                  {ev.title.includes('STEP UP') && 'Solo'}
                                  {ev.title.includes('ECHOES OF NOOR') && 'Solo/Duo'}
                                  {ev.title.includes('VERSEVAAD') && 'Solo/Duo'}
                                  {!ev.title.includes('PANACHE') && !ev.title.includes('BANDJAM') && !ev.title.includes('DANCE BATTLE') && !ev.title.includes('STEP UP') && !ev.title.includes('ECHOES OF NOOR') && !ev.title.includes('VERSEVAAD') && ''}
                                </div>
                              </div>
                              <span className="text-green-400 font-semibold text-right">{ev.price}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Visitor Pass Details Review */}
                      {visitorPassDays > 0 && (
                        <div className="glass rounded-2xl p-6 border border-white/10">
                          <h3 className="font-semibold text-yellow-200 mb-3">Visitor Pass Details</h3>
                          <div className="glass rounded-xl p-4 border border-white/10">
                            <h4 className="text-sm font-medium text-white/90 mb-2">Visitor Pass ({visitorPassDays} day{visitorPassDays > 1 ? 's' : ''})</h4>
                                <div className="grid md:grid-cols-2 gap-3 text-sm">
                                  {VISITOR_PASS_FIELDS.map(field => (
                                    <div key={field.name} className="flex justify-between gap-4">
                                      <span className="text-white/70">{field.label}</span>
                                  <span className="text-white/90 break-words">{visitorPassDetails[field.name] || '-'}</span>
                                    </div>
                                  ))}
                                </div>
                          </div>
                        </div>
                      )}
                      {fieldGroups.map(group => (
                        <div key={group.signature} className="glass rounded-2xl p-6 border border-white/10">
                          <h3 className="font-semibold text-fuchsia-200">
                            Details for: {group.events.length > 1 
                              ? group.events.map(e => e.title).join(', ') 
                              : group.events[0].title
                            }
                          </h3>
                          <div className="mt-3 grid md:grid-cols-2 gap-3 text-sm">
                            {group.fields.map(f => (
                              <div key={f.name} className="flex justify-between gap-4">
                                <span className="text-white/70">{f.label}</span>
                                <span className="text-white/90 break-words">{formDataBySignature[group.signature]?.[f.name] || '-'}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 mt-8">
                      <button onClick={goBack} className="px-5 py-2 rounded-full bg-white/10 border border-white/10 hover:bg-white/15 transition cursor-pointer">Back</button>
                      <div className="space-y-3">
                        <button 
                          onClick={startPaymentInitialization} 
                          disabled={paymentInitializationState.isLoading}
                          className={`px-5 py-2 rounded-full transition cursor-pointer ${
                            paymentInitializationState.isLoading 
                              ? 'bg-gray-600 cursor-not-allowed' 
                              : 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 hover:shadow-lg'
                          }`}
                        >
                          {paymentInitializationState.isLoading 
                            ? 'Processing...' 
                            : paymentInitializationState.retryCount > 0 
                              ? 'Retry Payment Setup' 
                              : 'Proceed to Payment'
                          }
                        </button>
                        
                        {/* Error message with retry instructions */}
                        {paymentInitializationState.error && (
                          <div className="glass rounded-lg p-4 border border-red-500/30 bg-red-500/10">
                            <div className="text-red-300 text-sm font-medium mb-2">
                              ⚠️ Payment Setup Failed
                            </div>
                            <div className="text-red-200 text-xs mb-3">
                              {paymentInitializationState.error}
                            </div>
                            <div className="text-orange-200 text-xs bg-orange-500/10 border border-orange-500/20 rounded p-2">
                              💡 <strong>Having trouble?</strong> This is likely a network connectivity issue, not a problem with our system. 
                              Please check your internet connection and click the "Retry Payment Setup" button above. 
                              The issue is usually temporary and resolves after 1-2 retries.
                            </div>
                            <a
                              href={CASHFREE_FALLBACK_FORM_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-3 inline-flex items-center gap-2 text-xs px-3 py-2 rounded-md bg-white/10 hover:bg-white/15 border border-white/15 text-white/90"
                            >
                              Or pay with Cashfree form
                            </a>
                          </div>
                        )}
                        
                        {/* Loading state message */}
                        {paymentInitializationState.isLoading && (
                          <div className="glass rounded-lg p-4 border border-blue-500/30 bg-blue-500/10">
                            <div className="text-blue-200 text-sm">
                              🔄 Initializing secure payment session...
                            </div>
                            <div className="text-blue-300 text-xs mt-1">
                              We're setting up your payment securely. This usually takes 3-5 seconds.
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                      </div>
                  <div>
                    <div className="glass rounded-2xl p-6 border border-white/10 shadow-[0_0_24px_rgba(59,130,246,0.18)] relative overflow-hidden">
                      <div className="pointer-events-none absolute -top-10 right-0 h-24 w-24 rounded-full bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-400/20 blur-2xl"></div>
                      <h3 className="font-semibold text-cyan-200">Total</h3>
                      <div className="mt-4 text-3xl font-bold">₹{formatPrice(finalPrice)}</div>
                  </div>
                    </div>
                  </div>
              </motion.div>
            )}
            {step === 'payment' && (
              <motion.div
                key="payment"
                initial={reducedMotion ? false : { opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: reducedMotion ? 0.15 : 0.25 }}
              >
                <div className="grid lg:grid-cols-4 gap-8">
                  <div className="lg:col-span-3">
                    <h2 className="text-xl font-semibold mb-6 title-chroma">Complete Payment</h2>
                    
                    {!paymentSession ? (
                      <div className="glass rounded-2xl p-6 border border-white/10">
                        <div className="text-center">
                          <div className="text-white/60 mb-4">Initializing payment...</div>
                          <div className="text-sm text-white/40">Please wait while we prepare your payment session.</div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Payment Interface */}
                        <div className="glass rounded-2xl p-6 border border-white/10">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-cyan-200">Secure Payment</h3>
                            <div className="text-2xl font-bold text-green-400">
                              ₹{paymentSession.amount}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="text-sm text-white/80 mb-4">
                              Click below to proceed to secure payment. You can pay using Credit/Debit Cards or UPI (GPay, PhonePe, Paytm, etc.)
                            </div>

                            {/* Screenshot Warning */}
                            <div className="rounded-xl border border-orange-400/50 bg-orange-500/10 p-4 flex items-start gap-3">
                              <div className="mt-1 flex-shrink-0">
                                <Camera className="w-5 h-5 text-orange-300" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-orange-200">Important: Keep a Record</h4>
                                <p className="text-sm text-orange-100/90 mt-1">
                                  After your payment is successful, please take a screenshot of the confirmation page for your records.
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={doPayment}
                              disabled={isProcessingPayment}
                              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 text-lg"
                            >
                              {isProcessingPayment ? (
                                <>
                                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <CreditCard className="w-6 h-6" />
                                  Pay ₹{paymentSession.amount} Securely
                                </>
                              )}
                            </button>
                            
                            {/* Payment error message */}
                            {paymentInitializationState.error && step === 'payment' && (
                              <div className="mt-4 glass rounded-lg p-4 border border-red-500/30 bg-red-500/10">
                                <div className="text-red-300 text-sm font-medium mb-2">
                                  ⚠️ Payment Error
                                </div>
                                <div className="text-red-200 text-xs mb-3">
                                  {paymentInitializationState.error}
                                </div>
                                <div className="text-orange-200 text-xs bg-orange-500/10 border border-orange-500/20 rounded p-2">
                                  💡 <strong>Network Issue?</strong> This is likely a temporary connectivity problem. 
                                  Please check your internet connection and click the "Pay" button above to retry. 
                                  If the problem persists, try refreshing the page or switching networks.
                                </div>
                              <a
                                href={CASHFREE_FALLBACK_FORM_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center gap-2 text-xs px-3 py-2 rounded-md bg-white/10 hover:bg-white/15 border border-white/15 text-white/90"
                              >
                                Or pay via Cashfree form
                              </a>
                              </div>
                            )}
                          </div>

                          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                            <div className="flex flex-col items-center p-3 rounded-lg bg-white/5">
                              <CreditCard className="w-8 h-8 text-blue-400 mb-2" />
                              <span className="text-xs text-white/70">Cards</span>
                            </div>
                            <div className="flex flex-col items-center p-3 rounded-lg bg-white/5">
                              <div className="w-8 h-8 rounded bg-gradient-to-r from-green-400 to-blue-500 mb-2"></div>
                              <span className="text-xs text-white/70">UPI</span>
                            </div>
                            <div className="flex flex-col items-center p-3 rounded-lg bg-white/5">
                              <div className="w-8 h-8 rounded bg-gradient-to-r from-orange-400 to-red-500 mb-2"></div>
                              <span className="text-xs text-white/70">Wallets</span>
                            </div>
                          </div>

                          <div className="mt-4 rounded-xl border border-green-400/50 bg-green-500/10 p-4">
                            <p className="text-sm text-green-200 font-medium">🔒 Secure Payment</p>
                            <p className="text-sm text-green-100 mt-1">
                              Your payment is processed securely by Cashfree Payments. Your card/bank details are encrypted and never stored on our servers.
                            </p>
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="glass rounded-2xl p-6 border border-white/10">
                          <h3 className="font-semibold text-cyan-200 mb-4">Order Summary</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">Order ID:</span>
                              <span className="text-white/90 font-mono">{paymentSession.orderId}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">Amount:</span>
                              <span className="text-white/90">₹{paymentSession.amount}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">Payment Mode:</span>
                              <span className="text-white/90">{paymentSession.mode}</span>
                            </div>
                          </div>
                          <div className="mt-4">
                            <a
                              href={CASHFREE_FALLBACK_FORM_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-md bg-white/10 hover:bg-white/15 border border-white/15 text-white/90"
                            >
                              Having issues? Pay via Cashfree form
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="flex items-center gap-3 mt-8">
                      <button onClick={goBack} className="px-5 py-2 rounded-full bg-white/10 border border-white/10 hover:bg-white/15 transition cursor-pointer">Back</button>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div>
                    <div className="glass rounded-2xl p-6 border border-white/10 shadow-[0_0_24px_rgba(59,130,246,0.18)] relative overflow-hidden">
                      <div className="pointer-events-none absolute -top-10 right-0 h-24 w-24 rounded-full bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-400/20 blur-2xl"></div>
                      <h3 className="font-semibold text-cyan-200">Total</h3>
                      <div className="mt-4 text-3xl font-bold">₹{formatPrice(finalPrice)}</div>
                      
                      {paymentSession && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <div className="text-sm text-white/60">Secure payment powered by</div>
                          <div className="text-sm font-semibold text-cyan-300 mt-1">Cashfree Payments</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      {/* Info Modal */}
      {/* Payment Status Modal */}
      <AnimatePresence>
        {(isVerifying || paymentVerificationStatus) && (
          <motion.div
            key="payment-status-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => {
              setPaymentVerificationStatus(null);
              router.replace('/checkout', { scroll: false });
            }} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md text-center"
            >
              <div className="glass rounded-2xl p-8 border border-white/10 shadow-[0_0_30px_rgba(147,51,234,0.2)]">
                {isVerifying ? (
                  <>
                    <Loader className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-3">Verifying Payment</h1>
                    <p className="text-white/80">Please wait while we confirm your transaction. This may take a few moments.</p>
                  </>
                ) : paymentVerificationStatus?.success ? (
                  <>
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-3">Payment Successful!</h1>
                    <p className="text-white/80 mb-8">
                      Your registration is complete. Thank you for joining Sabrang'25!
                      <br />
                      Your transaction ID is <strong className="font-mono text-green-300">{paymentVerificationStatus.transactionId}</strong>.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button
                        onClick={() => router.push('/ticket')}
                        className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 text-lg shadow-lg hover:scale-105"
                      >
                        <Ticket className="w-6 h-6" />
                        View My Tickets
                      </button>
                      <button
                        onClick={() => router.push('/')}
                        className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Home className="w-5 h-5" />
                        Go to Homepage
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-3">Payment Failed</h1>
                    <p className="text-white/80 mb-8">
                      Unfortunately, we couldn't process your payment.
                      <br />
                      <strong>Reason:</strong> {paymentVerificationStatus?.reason || 'Unknown error.'}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button
                        onClick={() => { setPaymentVerificationStatus(null); router.replace('/checkout', { scroll: false }); setStep('review'); }}
                        className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 text-lg shadow-lg hover:scale-105"
                      >
                        Try Again
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {infoEvent && (
          <motion.div
            key="info-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/60" onClick={() => setInfoEvent(null)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
              role="dialog"
              aria-modal="true"
              className="relative w-full max-w-2xl bg-neutral-900/95 border border-white/10 rounded-2xl text-white shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-[4/3] md:aspect-auto md:h-full bg-black/40">
                  {infoEvent.image ? (
                    <img src={infoEvent.image} alt={infoEvent.title} className="absolute inset-0 w-full h-full object-cover" />
                  ) : null}
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <h2 className="text-xl font-bold">{infoEvent.title}</h2>
                  </div>
                  {infoEvent.description ? (
                    <p className="text-sm text-neutral-300">{infoEvent.description}</p>
                  ) : null}
                  <div className="text-sm text-neutral-200">Price: {EVENT_CATALOG.find(e => e.id === infoEvent.id)?.price || '—'}</div>
                  <div className="pt-2 flex flex-wrap gap-2">
                    <button onClick={() => { setInfoEvent(null); router.push(`/Events/${infoEvent.id}/rules`); }} className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 cursor-pointer">View Rules</button>
                    <button onClick={() => setInfoEvent(null)} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 cursor-pointer">Close</button>
            </div>
          </div>
        </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md overflow-hidden">
          <div className="absolute top-4 right-4">
            <button
              aria-label="Close menu"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 transition"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="pt-20 px-6 h-full overflow-y-auto">
            <div className="grid grid-cols-1 gap-3 pb-8">
              {[{ title: 'Home', href: '/?skipLoading=true', icon: <Home className="w-5 h-5" /> },
                { title: 'About', href: '/About', icon: <Info className="w-5 h-5" /> },
                { title: 'Events', href: '/Events', icon: <Calendar className="w-5 h-5" /> },
                { title: 'Highlights', href: '/Gallery', icon: <Star className="w-5 h-5" /> },
                { title: 'Schedule', href: '/schedule', icon: <Clock className="w-5 h-5" /> },
                { title: 'Team', href: '/Team', icon: <Users className="w-5 h-5" /> },
                { title: 'FAQ', href: '/FAQ', icon: <HelpCircle className="w-5 h-5" /> },
                { title: 'Why Sponsor Us', href: '/why-sponsor-us', icon: <Handshake className="w-5 h-5" /> },
                { title: 'Contact', href: '/Contact', icon: <Mail className="w-5 h-5" /> }].map((item) => (
                <button
                  key={item.title}
                  onClick={() => { setMobileMenuOpen(false); router.push(item.href); }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/10 border border-white/20 text-white text-base hover:bg-white/15 active:scale-[0.99] transition text-left"
                >
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/15 border border-white/20">
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

	      {/* Support: Report issues form */}
	      <div className="mt-8 w-full flex justify-center">
	        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 w-full max-w-md">
	          <div className="flex items-start gap-3">
	            <div className="mt-0.5">
	              <HelpCircle className="w-5 h-5 text-purple-300" />
	            </div>
	            <div className="text-white">
	              <div className="font-semibold">Facing issues during checkout?</div>
	              <p className="text-sm text-white/70 mt-1">If you encounter any error or problem in the process, please let us know using this form.</p>
	              <a
	                href="https://forms.gle/eth5B3JoQATdy9aRA"
	                target="_blank"
	                rel="noopener noreferrer"
	                className="inline-flex items-center gap-2 mt-3 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm border border-white/10"
	              >
	                Report an issue
	                <ArrowRight className="w-4 h-4" />
	              </a>
	            </div>
	          </div>
	        </div>
	      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-lg border border-green-400/30 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-200" />
                <span className="font-medium">Promo code copied to clipboard!</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Loading component for Suspense fallback
function CheckoutLoading() {
  return (
    <div className="min-h-screen text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
        <p className="text-white/70">Loading checkout...</p>
      </div>
    </div>
  );
}

// Main export with Suspense wrapper
export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutPageContent />
    </Suspense>
  );
}

