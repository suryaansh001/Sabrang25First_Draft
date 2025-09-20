'use client';

import React, { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, CreditCard, ArrowRight, X, Home, Info, Calendar, Star, Clock, Users, HelpCircle, Handshake, Mail } from 'lucide-react';
import createApiUrl from '../../lib/api';
import { events as EVENTS_DATA } from '../Events/[id]/rules/events.data';
import { EventCatalogItem, EVENT_CATALOG as ORIGINAL_EVENT_CATALOG } from '../../lib/eventCatalog';
import {load} from '@cashfreepayments/cashfree-js';


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
  { name: 'address', label: 'Address', type: 'text', required: true, placeholder: 'Enter visitor full address' },
];

const SUPPORT_ARTIST_FIELDS: FieldSet = [
  { name: 'name', label: 'Support Artist Name', type: 'text', required: true, placeholder: 'Enter support artist full name' },
  { name: 'role', label: 'Role/Profession', type: 'text', required: true, placeholder: 'e.g., Makeup Artist, Stylist, Manager' },
  { name: 'contactNo', label: 'Mobile Number', type: 'phone', required: true, placeholder: '10-digit number' },
  { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'artist@example.com' },
  { name: 'idNumber', label: 'ID Number', type: 'text', required: true, placeholder: 'Government ID or Passport number' },
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
  if (ev.title.includes('RAMPWALK') || ev.title.includes('DANCE') || ev.title.includes('DUMB SHOW') || ev.title.includes('COURTROOM')) return TEAM_FIELDS;
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
  'DANCE BATTLE': { min: 6, max: 12 },
  'ECHOES OF NOOR': { min: 1, max: 2 },
  'VERSEVAAD': { min: 1, max: 2 },
  'BANDJAM': { min: 4, max: 8 },
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

const Stepper = React.memo(({ currentStep }: { currentStep: Step }) => {
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
});

function CheckoutPageContent() {
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [showComingSoon, setShowComingSoon] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const cashfreeLoadedRef = useRef<boolean>(false);

  const [step, setStep] = useState<Step>('select');
  const [reducedMotion, setReducedMotion] = useState<boolean>(true);
  const [selectedEventIds, setSelectedEventIds] = useState<number[]>([]);
  const [visitorPassQuantity, setVisitorPassQuantity] = useState<number>(0);
  const [visitorPassDetails, setVisitorPassDetails] = useState<Array<Record<string, string>>>([]);
  const [supportArtistQuantity, setSupportArtistQuantity] = useState<number>(0);
  const [supportArtistDetails, setSupportArtistDetails] = useState<Array<Record<string, string>>>([]);
  const [flagshipVisitorPassQuantity, setFlagshipVisitorPassQuantity] = useState<number>(0);
  const [flagshipVisitorPassDetails, setFlagshipVisitorPassDetails] = useState<Array<Record<string, string>>>([]);
  const [flagshipSoloVisitorPassQuantity, setFlagshipSoloVisitorPassQuantity] = useState<number>(0);
  const [flagshipSoloVisitorPassDetails, setFlagshipSoloVisitorPassDetails] = useState<Array<Record<string, string>>>([]);
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

  // Initialize arrays when quantities change
  useEffect(() => {
    if (supportArtistQuantity > supportArtistDetails.length) {
      const newDetails = [...supportArtistDetails];
      while (newDetails.length < supportArtistQuantity) {
        newDetails.push({});
      }
      setSupportArtistDetails(newDetails);
    } else if (supportArtistQuantity < supportArtistDetails.length) {
      setSupportArtistDetails(supportArtistDetails.slice(0, supportArtistQuantity));
    }
  }, [supportArtistQuantity]);

  useEffect(() => {
    if (flagshipVisitorPassQuantity > flagshipVisitorPassDetails.length) {
      const newDetails = [...flagshipVisitorPassDetails];
      while (newDetails.length < flagshipVisitorPassQuantity) {
        newDetails.push({});
      }
      setFlagshipVisitorPassDetails(newDetails);
    } else if (flagshipVisitorPassQuantity < flagshipVisitorPassDetails.length) {
      setFlagshipVisitorPassDetails(flagshipVisitorPassDetails.slice(0, flagshipVisitorPassQuantity));
    }
  }, [flagshipVisitorPassQuantity]);

  useEffect(() => {
    if (flagshipSoloVisitorPassQuantity > flagshipSoloVisitorPassDetails.length) {
      const newDetails = [...flagshipSoloVisitorPassDetails];
      while (newDetails.length < flagshipSoloVisitorPassQuantity) {
        newDetails.push({});
      }
      setFlagshipSoloVisitorPassDetails(newDetails);
    } else if (flagshipSoloVisitorPassQuantity < flagshipSoloVisitorPassDetails.length) {
      setFlagshipSoloVisitorPassDetails(flagshipSoloVisitorPassDetails.slice(0, flagshipSoloVisitorPassQuantity));
    }
  }, [flagshipSoloVisitorPassQuantity]);

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

  // Sync selected events to localStorage cart
  useEffect(() => {
    try {
      localStorage.setItem('sabrang_cart', JSON.stringify(selectedEventIds));
    } catch {}
  }, [selectedEventIds]);

  const selectedEvents = useMemo(() => EVENT_CATALOG.filter(e => selectedEventIds.includes(e.id)), [selectedEventIds]);

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

  // Auto-create visitor pass details when quantity changes
  useEffect(() => {
    setVisitorPassDetails(prev => {
      const newDetails = Array.from({ length: visitorPassQuantity }, (_, index) => {
        // Keep existing data if available, otherwise create new empty form
        return prev[index] || VISITOR_PASS_FIELDS.reduce((acc, f) => ({ ...acc, [f.name]: '' }), {});
      });
      return newDetails;
    });
  }, [visitorPassQuantity]);

  const totalPrice = useMemo(() => {
    const eventTotal = selectedEvents.reduce((total, event) => total + parsePrice(event.price), 0);
    const visitorPassTotal = visitorPassQuantity * 69; // ₹69 per visitor pass
    return eventTotal + visitorPassTotal;
  }, [selectedEvents, visitorPassQuantity]);

  const finalPrice = useMemo(() => {
    const discount = appliedPromo?.discountAmount || 0;
    return Math.max(0, totalPrice - discount);
  }, [totalPrice, appliedPromo]);

  const getDerivedEmail = () => {
    // Search across all groups for collegeMailId
    for (const group of fieldGroups) {
      const data = formDataBySignature[group.signature] || {};
      if (data['collegeMailId']) return String(data['collegeMailId']);
      if (data['email']) return String(data['email']);
    }
    return '';
  };

  const tryApplyPromo = async () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    setPromoStatus({ loading: true, error: null });
    try {
      const userEmail = getDerivedEmail();
      const response = await fetch(createApiUrl('/admin/promo-codes/validate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code, userEmail, orderAmount: totalPrice })
      });
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
    if (visitorPassQuantity > 0) {
      errors['visitorPasses'] = {};
      visitorPassDetails.forEach((visitor, index) => {
        VISITOR_PASS_FIELDS.forEach(field => {
          if (field.required) {
            const value = visitor[field.name] || '';
            if (!value.trim()) {
              errors['visitorPasses'][`visitor_${index}_${field.name}`] = `${field.label} is required for visitor ${index + 1}.`;
              isValid = false;
            } else if (field.name === 'contactNo') {
              // Validate phone number format (exactly 10 digits)
              const phoneRegex = /^\d{10}$/;
              if (!phoneRegex.test(value.trim())) {
                errors['visitorPasses'][`visitor_${index}_${field.name}`] = 'Mobile number must be exactly 10 digits.';
                isValid = false;
              }
            }
          }
        });
      });
    }

    // Validate support artist details
    if (supportArtistQuantity > 0) {
      errors['supportArtists'] = {};
      supportArtistDetails.forEach((artist, index) => {
        SUPPORT_ARTIST_FIELDS.forEach(field => {
          if (field.required) {
            const value = artist[field.name] || '';
            if (!value.trim()) {
              errors['supportArtists'][`artist_${index}_${field.name}`] = `${field.label} is required for support artist ${index + 1}.`;
              isValid = false;
            } else if (field.name === 'contactNo') {
              // Validate phone number format (exactly 10 digits)
              const phoneRegex = /^\d{10}$/;
              if (!phoneRegex.test(value.trim())) {
                errors['supportArtists'][`artist_${index}_${field.name}`] = 'Mobile number must be exactly 10 digits.';
                isValid = false;
              }
            } else if (field.name === 'email') {
              // Validate email format
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(value.trim())) {
                errors['supportArtists'][`artist_${index}_${field.name}`] = 'Please enter a valid email address.';
                isValid = false;
              }
            }
          }
        });
      });
    }

    // Validate flagship visitor pass details
    if (flagshipVisitorPassQuantity > 0) {
      errors['flagshipVisitorPasses'] = {};
      flagshipVisitorPassDetails.forEach((visitor, index) => {
        VISITOR_PASS_FIELDS.forEach(field => {
          if (field.required) {
            const value = visitor[field.name] || '';
            if (!value.trim()) {
              errors['flagshipVisitorPasses'][`flagship_visitor_${index}_${field.name}`] = `${field.label} is required for flagship visitor ${index + 1}.`;
              isValid = false;
            } else if (field.name === 'contactNo') {
              // Validate phone number format (exactly 10 digits)
              const phoneRegex = /^\d{10}$/;
              if (!phoneRegex.test(value.trim())) {
                errors['flagshipVisitorPasses'][`flagship_visitor_${index}_${field.name}`] = 'Mobile number must be exactly 10 digits.';
                isValid = false;
              }
            }
          }
        });
      });
    }

    // Validate flagship solo visitor pass details
    if (flagshipSoloVisitorPassQuantity > 0) {
      errors['flagshipSoloVisitorPasses'] = {};
      flagshipSoloVisitorPassDetails.forEach((visitor, index) => {
        VISITOR_PASS_FIELDS.forEach(field => {
          if (field.required) {
            const value = visitor[field.name] || '';
            if (!value.trim()) {
              errors['flagshipSoloVisitorPasses'][`flagship_solo_visitor_${index}_${field.name}`] = `${field.label} is required for flagship solo visitor ${index + 1}.`;
              isValid = false;
            } else if (field.name === 'contactNo') {
              // Validate phone number format (exactly 10 digits)
              const phoneRegex = /^\d{10}$/;
              if (!phoneRegex.test(value.trim())) {
                errors['flagshipSoloVisitorPasses'][`flagship_solo_visitor_${index}_${field.name}`] = 'Mobile number must be exactly 10 digits.';
                isValid = false;
              }
            }
          }
        });
      });
    }

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
          // For fixed-size teams, get size from first event in group
          const event = group.events[0];
          if (event && event.teamSize) {
            const match = event.teamSize.match(/\d+/);
            if (match) {
              totalSize = parseInt(match[0], 10);
              requiredAdditionalMembers = Math.max(0, totalSize - 1);
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
      if (selectedEventIds.length === 0 && visitorPassQuantity === 0) return;
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
      script.onerror = () => reject(new Error('Failed to load Cashfree SDK'));
      document.head.appendChild(script);
    });
  };

  // Handle field changes
  const handleFieldChange = (signature: string, fieldName: string, value: string) => {
    setFormDataBySignature(prev => ({
      ...prev,
      [signature]: {
        ...prev[signature],
        [fieldName]: value
      }
    }));

    // If team size changes, auto-size team members array to match
    if (fieldName === 'numMembers') {
      const totalMembers = Math.max(0, Math.min(50, parseInt(value || '0', 10) || 0));
      const additionalMembers = Math.max(0, totalMembers - 1); // Leader is in main form
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
  const handleFileChange = (signature: string, fieldName: string, file: File | null) => {
    if (file) {
      setFilesBySignature(prev => ({
        ...prev,
        [signature]: {
          ...prev[signature],
          [fieldName]: file
        }
      }));
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

  const proceedToPayment = async () => {
    console.log('🚀 proceedToPayment function called');
    try {
      // First, register the user on backend using existing /register with image upload
      // Map fields: name -> 'name', collegeMailId -> 'email', and attach a 'profileImage'
      const registrationForm = new FormData();
      // Derive name and email from collected forms (pick from the first group that has them)
      let derivedName: string | undefined;
      let derivedEmail: string | undefined;
      let attachedImage: File | undefined;

      for (const group of fieldGroups) {
        const data = formDataBySignature[group.signature] || {};
        if (!derivedName && data['name']) derivedName = data['name'];
        if (!derivedEmail && data['collegeMailId']) derivedEmail = data['collegeMailId'];
        const files = filesBySignature[group.signature] || {};
        // Prefer an institution card image if present, else take the first file in the group
        if (!attachedImage) {
          if (files['universityCardImage']) attachedImage = files['universityCardImage'];
          else {
            const firstFile = Object.values(files)[0];
            if (firstFile) attachedImage = firstFile;
          }
        }
      }

      // Fallbacks to avoid empty fields
      if (!derivedName) derivedName = 'Participant';
      if (!derivedEmail) throw new Error('Email is required for registration');

      // Generate a strong random password since checkout flow does not collect one
      const generatedPassword = Math.random().toString(36).slice(-10) + 'A1!';

      registrationForm.append('name', derivedName);
      registrationForm.append('email', derivedEmail);
      registrationForm.append('password', generatedPassword);
      // Also send flat fields if available
      const flat = formDataBySignature[fieldGroups[0]?.signature || ''] || {};
      if (flat['contactNo']) registrationForm.append('contactNo', flat['contactNo']);
      if (flat['gender']) registrationForm.append('gender', flat['gender']);
      if (flat['age']) registrationForm.append('age', flat['age']);
      if (flat['universityName']) registrationForm.append('universityName', flat['universityName']);
      if (flat['address']) registrationForm.append('address', flat['address']);
      // Send complex payloads for backend to persist
      registrationForm.append('formsBySignature', JSON.stringify(formDataBySignature));
      registrationForm.append('teamMembersBySignature', JSON.stringify(teamMembersBySignature));
      registrationForm.append('items', JSON.stringify(selectedEvents.map(e => ({ id: e.id, title: e.title, price: e.price }))));
      registrationForm.append('visitorPassQuantity', visitorPassQuantity.toString());
      registrationForm.append('visitorPassDetails', JSON.stringify(visitorPassDetails));
      if (attachedImage) {
        registrationForm.append('profileImage', attachedImage);
      }

      // Append team member images with deterministic keys: memberImage__<signature>__<index>
      Object.entries(memberFilesBySignature).forEach(([signature, idxMap]) => {
        Object.entries(idxMap).forEach(([idxStr, file]) => {
          const idx = Number(idxStr);
          const encodedSig = encodeURIComponent(signature);
          registrationForm.append(`memberImage__${encodedSig}__${idx}`, file);
        });
      });

      const registrationResponse = await fetch(createApiUrl('/register'), {
        method: 'POST',
        credentials: 'include',
        body: registrationForm
      });

      if (!registrationResponse.ok) {
        const errText = await registrationResponse.text().catch(() => '');
        throw new Error(errText || 'Registration failed');
      }

      // Create payment order using the new simple backend endpoint
      const orderData = {
        amount: finalPrice.toString(),
        customerName: derivedName,
        customerEmail: derivedEmail,
        customerPhone: flat['contactNo'] || '9999999999'
      };

      console.log('🚀 Creating payment order with data:', orderData);
      const response = await fetch(createApiUrl('/api/payments/create-order'), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(errText || 'Failed to create order');
      }

      const data = await response.json();
      console.log('✅ Payment order created:', data);

      if (!data.success) {
        throw new Error(data.message || 'Failed to create payment order');
      }

      // Store payment session data for the payment component
      setPaymentSession({
        paymentSessionId: data.data.payment_session_id,
        orderId: data.data.order_id,
        amount: data.data.amount,
        mode: 'production' // Always use production mode
      });

      // Move to payment step
      setStep('payment');

    } catch (error) {
      console.error('❌ Payment initialization failed:', error);
      alert(`Payment initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Initialize Cashfree SDK - always production mode
  let cashfree: any;
  const initializeSDK = async () => {
    try {
      cashfree = await load({
        mode: "production"
      });
      console.log('✅ Cashfree SDK initialized in production mode');
    } catch (error) {
      console.error('❌ Failed to initialize Cashfree SDK:', error);
    }
  };

  // Initialize SDK when payment session is available
  useEffect(() => {
    if (paymentSession) {
      initializeSDK();
    }
  }, [paymentSession]);

  // Clean payment function following user's preferred structure
  const doPayment = async () => {
    if (!paymentSession || !cashfree) {
      alert('Payment session not ready. Please try again.');
      return;
    }

    setIsProcessingPayment(true);
    try {
      console.log('🚀 Starting payment with session ID:', paymentSession.paymentSessionId);
      
      const checkoutOptions = {
        paymentSessionId: paymentSession.paymentSessionId,
        redirectTarget: "_self" as const,
      };
      
      console.log('💳 Launching Cashfree checkout with options:', checkoutOptions);
      await cashfree.checkout(checkoutOptions);
      
    } catch (error) {
      console.error('❌ Payment failed:', error);
      alert(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessingPayment(false);
    }
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
      alert(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessingPayment(false);
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

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Mobile hamburger */}
        <button
          aria-label="Open menu"
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden fixed top-4 right-4 z-50 p-3 rounded-xl active:scale-95 transition"
        >
          <span className="block h-0.5 bg-white rounded-full w-8 mb-1" />
          <span className="block h-0.5 bg-white/90 rounded-full w-6 mb-1" />
          <span className="block h-0.5 bg-white/80 rounded-full w-4" />
        </button>

        {/* Back button beneath hamburger */}
        <button
          onClick={() => router.back()}
          className="lg:hidden fixed top-16 right-4 z-50 px-2 py-1 text-white text-base active:scale-95 transition"
          aria-label="Go back"
        >
          <span className="mr-1">&lt;</span> Back
        </button>
      {/* Header */}
        <div className="grid grid-cols-3 items-center mb-8">
          <div className="justify-self-start"></div>
          <div className="justify-self-center text-center">
            <h1 className="text-2xl font-bold title-chroma title-glow-animation">
              Event Registration
            </h1>
          </div>
          <div className="justify-self-end opacity-0 pointer-events-none">
            <button className="flex items-center gap-2">
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
          </div>
        </div>

        <Stepper currentStep={step} />

        {/* Rest of your steps remain as before, but card classes adjusted */}
        {/* Example: */}
        <main>
          <AnimatePresence mode="wait">
            {step === 'select' && (
        <motion.div
                key="select" 
                initial={reducedMotion ? false : { opacity: 0, x: 30 }} 
                animate={reducedMotion ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }} 
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: reducedMotion ? 0.15 : 0.25 }}
              >
                <div className="grid lg:grid-cols-4 gap-8">
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
                    
                    {/* Visitor Pass Section */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-white mb-4">
                        <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-transparent">Visitor Passes</span>
                      </h3>
                      <div className="glass rounded-2xl p-6 border border-white/10 shadow-[0_0_22px_rgba(255,193,7,0.18)]">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-yellow-200 mb-2">Visitor Pass</h4>
                            <p className="text-sm text-white/70 mb-3">
                              Required for non-participant entry to Sabrang venues. Valid for the dates and venues printed on the pass.
                            </p>
                            <div className="flex items-center gap-2 text-sm text-white/60">
                              <span>Price: ₹69 per pass</span>
                              <span>•</span>
                              <span>Non-transferable</span>
                              <span>•</span>
                              <span>Non-refundable</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setVisitorPassQuantity(Math.max(0, visitorPassQuantity - 1))}
                              disabled={visitorPassQuantity === 0}
                              className="w-8 h-8 rounded-full bg-white/10 border border-white/20 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="text-lg font-semibold min-w-[2rem] text-center">{visitorPassQuantity}</span>
                            <button
                              onClick={() => setVisitorPassQuantity(visitorPassQuantity + 1)}
                              className="w-8 h-8 rounded-full bg-white/10 border border-white/20 hover:bg-white/15 flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        {visitorPassQuantity > 0 && (
                          <div className="mt-4 pt-4 border-t border-white/10">
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">Visitor Passes ({visitorPassQuantity})</span>
                              <span className="text-yellow-400 font-medium">₹{visitorPassQuantity * 69}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Flagship Group Event Benefits Section */}
                    {selectedEvents.some(event => isFlagshipGroupEvent(event.title)) && (
                      <div className="mb-8">
                        <h3 className="text-lg font-medium text-white mb-4">
                          <span className="bg-gradient-to-r from-purple-300 via-pink-400 to-rose-400 bg-clip-text text-transparent">Flagship Group Benefits</span>
                        </h3>
                        <div className="glass rounded-2xl p-6 border border-white/10 shadow-[0_0_22px_rgba(168,85,247,0.18)]">
                          <div className="mb-6">
                            <h4 className="font-semibold text-purple-200 mb-2">Support Artists</h4>
                            <p className="text-sm text-white/70 mb-3">
                              Bring up to 3 support artists (makeup, stylist, manager) for your team performance.
                            </p>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => setSupportArtistQuantity(Math.max(0, supportArtistQuantity - 1))}
                                disabled={supportArtistQuantity === 0}
                                className="w-8 h-8 rounded-full bg-white/10 border border-white/20 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="text-lg font-semibold min-w-[2rem] text-center">{supportArtistQuantity}</span>
                              <button
                                onClick={() => setSupportArtistQuantity(Math.min(3, supportArtistQuantity + 1))}
                                disabled={supportArtistQuantity >= 3}
                                className="w-8 h-8 rounded-full bg-white/10 border border-white/20 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                              >
                                +
                              </button>
                              <span className="text-xs text-white/60">(Max 3)</span>
                            </div>
                          </div>
                          
                          <div className="mb-6">
                            <h4 className="font-semibold text-purple-200 mb-2">Free Visitor Passes</h4>
                            <p className="text-sm text-white/70 mb-3">
                              3 complimentary visitor passes (worth ₹69 each) included with your flagship group registration.
                            </p>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => setFlagshipVisitorPassQuantity(Math.max(0, flagshipVisitorPassQuantity - 1))}
                                disabled={flagshipVisitorPassQuantity === 0}
                                className="w-8 h-8 rounded-full bg-white/10 border border-white/20 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="text-lg font-semibold min-w-[2rem] text-center">{flagshipVisitorPassQuantity}</span>
                              <button
                                onClick={() => setFlagshipVisitorPassQuantity(Math.min(3, flagshipVisitorPassQuantity + 1))}
                                disabled={flagshipVisitorPassQuantity >= 3}
                                className="w-8 h-8 rounded-full bg-white/10 border border-white/20 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                              >
                                +
                              </button>
                              <span className="text-xs text-white/60">(Max 3)</span>
                            </div>
                          </div>

                          <div className="text-xs text-white/60 space-y-1">
                            <p>• Green room access (time-bound as per slot)</p>
                            <p>• Snacks (tea/coffee) for team + support artists</p>
                            <p>• Support artists must wear provided wristbands/badges</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Flagship Solo Event Benefits Section */}
                    {selectedEvents.some(event => isFlagshipSoloEvent(event.title)) && (
                      <div className="mb-8">
                        <h3 className="text-lg font-medium text-white mb-4">
                          <span className="bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Flagship Solo Benefits</span>
                        </h3>
                        <div className="glass rounded-2xl p-6 border border-white/10 shadow-[0_0_22px_rgba(59,130,246,0.18)]">
                          <div className="mb-6">
                            <h4 className="font-semibold text-blue-200 mb-2">Free Visitor Passes</h4>
                            <p className="text-sm text-white/70 mb-3">
                              2 complimentary visitor passes (worth ₹69 each) included with your flagship solo registration.
                            </p>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => setFlagshipSoloVisitorPassQuantity(Math.max(0, flagshipSoloVisitorPassQuantity - 1))}
                                disabled={flagshipSoloVisitorPassQuantity === 0}
                                className="w-8 h-8 rounded-full bg-white/10 border border-white/20 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="text-lg font-semibold min-w-[2rem] text-center">{flagshipSoloVisitorPassQuantity}</span>
                              <button
                                onClick={() => setFlagshipSoloVisitorPassQuantity(Math.min(2, flagshipSoloVisitorPassQuantity + 1))}
                                disabled={flagshipSoloVisitorPassQuantity >= 2}
                                className="w-8 h-8 rounded-full bg-white/10 border border-white/20 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                              >
                                +
                              </button>
                              <span className="text-xs text-white/60">(Max 2)</span>
                            </div>
                          </div>

                          <div className="text-xs text-white/60 space-y-1">
                            <p>• Snacks (tea/coffee) during reporting/performance window</p>
                            <p>• 2 complimentary visitor passes included</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {Array.from(eventsByCategory.entries()).map(([category, events]) => (
                      <div key={category} className="mb-8">
                        <h3 className="text-lg font-medium text-white mb-4"><span className="bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-emerald-300 bg-clip-text text-transparent">{category}</span></h3>
                        <div className="space-y-3">
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
                                className={`relative p-4 rounded-xl transition-colors duration-150 border overflow-hidden ${
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
                                <div className="flex justify-between items-center">
                            <div className="flex-1">
                                    <h4 className="font-semibold">{event.title}</h4>
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="text-sm text-cyan-300">{event.price}</p>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); e.preventDefault(); const ed = eventDataById.get(event.id); if (ed) setInfoEvent(ed); }} // prettier-ignore
                                        className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 cursor-pointer"
                                        aria-label={`View info for ${event.title}`}
                                      >
                                        Info
                                      </button>
                                      {event.teamSize && <span className="text-[11px] text-white/60">👥 {event.teamSize}</span>}
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
                    ))}
                  </div>
                  <div>
                    <div className="glass rounded-2xl p-6 border border-white/10 shadow-[0_0_24px_rgba(59,130,246,0.18)] static">
                      <div className="pointer-events-none absolute -top-10 right-0 h-24 w-24 rounded-full bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-400/20 blur-2xl"></div>
                      <h3 className="font-semibold text-cyan-200">Selected Items</h3>
                      <ul className="mt-4 space-y-2 text-sm">
                        {visitorPassQuantity > 0 && (
                          <li className="flex justify-between">
                            <div>
                              <div className="font-medium">Visitor Passes ({visitorPassQuantity})</div>
                              <div className="text-xs text-white/70">Non-participant entry</div>
                            </div>
                            <span className="text-yellow-400 font-medium">₹{visitorPassQuantity * 69}</span>
                          </li>
                        )}
                        {flagshipVisitorPassQuantity > 0 && (
                          <li className="flex justify-between">
                            <div>
                              <div className="font-medium">Flagship Visitor Passes ({flagshipVisitorPassQuantity})</div>
                              <div className="text-xs text-white/70">Complimentary with flagship registration</div>
                            </div>
                            <span className="text-green-400 font-medium">Free</span>
                          </li>
                        )}
                        {supportArtistQuantity > 0 && (
                          <li className="flex justify-between">
                            <div>
                              <div className="font-medium">Support Artists ({supportArtistQuantity})</div>
                              <div className="text-xs text-white/70">Flagship group benefit</div>
                            </div>
                            <span className="text-green-400 font-medium">Free</span>
                          </li>
                        )}
                        {flagshipSoloVisitorPassQuantity > 0 && (
                          <li className="flex justify-between">
                            <div>
                              <div className="font-medium">Flagship Solo Visitor Passes ({flagshipSoloVisitorPassQuantity})</div>
                              <div className="text-xs text-white/70">Complimentary with flagship solo registration</div>
                            </div>
                            <span className="text-green-400 font-medium">Free</span>
                          </li>
                        )}
                        {selectedEvents.map(ev => (
                          <li key={ev.id} className="flex justify-between">
                            <div>
                              <div className="font-medium">{ev.title}</div>
                              {/* Date/time intentionally hidden on checkout page */}
                              <div className="text-xs text-white/70"></div>
                            </div>
                            <span className="text-green-400 font-medium">{ev.price}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t border-white/10 mt-4 pt-4 flex justify-between font-semibold">
                        <span>Total</span>
                        <span>₹{finalPrice}</span>
            </div>
                      <button
                        onClick={() => {
                          goNext();
                        }}
                        disabled={selectedEventIds.length === 0 && visitorPassQuantity === 0}
                        className={`relative w-full mt-6 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-white font-medium transition-all duration-300 ${
                          (selectedEventIds.length === 0 && visitorPassQuantity === 0)
                            ? 'bg-gray-600 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 hover:scale-105 cursor-pointer'
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
                <div className="grid lg:grid-cols-4 gap-8">
                  <div className="lg:col-span-3">
                    <h2 className="text-xl font-semibold mb-6 title-chroma">Your Details</h2>
                    {fieldGroups.length === 0 && (
                      <p className="text-sm text-gray-400">No events selected. Go back and pick at least one event.</p>
                    )}
                    <div className="space-y-8">
                      {/* Visitor Pass Details Section */}
                      {visitorPassQuantity > 0 && (
                        <div className="glass rounded-2xl p-6 border border-white/10 shadow-[0_0_22px_rgba(255,193,7,0.18)]">
                          <div className="mb-4">
                            <h3 className="font-semibold text-yellow-200">Visitor Pass Details ({visitorPassQuantity} passes)</h3>
                            <p className="text-xs text-gray-400">Fill details for each visitor pass. Each visitor will receive their own pass.</p>
                          </div>
                          <div className="space-y-6">
                            {visitorPassDetails.map((visitor, index) => (
                              <div key={index} className="glass rounded-xl p-4 border border-white/10">
                                <div className="flex justify-between items-center mb-4">
                                  <h4 className="text-sm font-medium text-white/90">Visitor {index + 1}</h4>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                  {VISITOR_PASS_FIELDS.map(field => {
                                    const error = (formErrors['visitorPasses'] || {})[`visitor_${index}_${field.name}`];
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
                                            className={`bg-black/40 border ${error ? 'border-pink-500' : 'border-white/20'} rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm`}
                                            value={value}
                                            onChange={e => {
                                              const newDetails = [...visitorPassDetails];
                                              newDetails[index] = { ...newDetails[index], [field.name]: e.target.value };
                                              setVisitorPassDetails(newDetails);
                                            }}
                                          >
                                            <option value="">Select</option>
                                            {(field.options || []).map(opt => (
                                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                          </select>
                                        ) : (
                                          <input
                                            type={inputType}
                                            inputMode={field.type === 'phone' ? 'tel' : undefined}
                                            required={!!field.required}
                                            className={`bg-black/40 border ${error ? 'border-pink-500' : 'border-white/20'} rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-white/40 text-sm`}
                                            placeholder={field.placeholder || ''}
                                            value={value}
                                            onChange={e => {
                                              const newDetails = [...visitorPassDetails];
                                              newDetails[index] = { ...newDetails[index], [field.name]: e.target.value };
                                              setVisitorPassDetails(newDetails);
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

                      {/* Flagship Solo Visitor Pass Details Section */}
                      {flagshipSoloVisitorPassQuantity > 0 && (
                        <div className="glass rounded-2xl p-6 border border-white/10 shadow-[0_0_22px_rgba(59,130,246,0.18)]">
                          <div className="mb-4">
                            <h3 className="font-semibold text-blue-200">Flagship Solo Visitor Pass Details ({flagshipSoloVisitorPassQuantity} passes)</h3>
                            <p className="text-xs text-gray-400">Fill details for each complimentary visitor pass. These are included with your flagship solo registration.</p>
                          </div>
                          <div className="space-y-6">
                            {flagshipSoloVisitorPassDetails.map((visitor, index) => (
                              <div key={index} className="glass rounded-xl p-4 border border-white/10">
                                <div className="flex justify-between items-center mb-4">
                                  <h4 className="text-sm font-medium text-white/90">Visitor {index + 1}</h4>
                                  <span className="text-xs text-blue-400 font-medium">Complimentary</span>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                  {VISITOR_PASS_FIELDS.map(field => {
                                    const error = (formErrors['flagshipSoloVisitorPasses'] || {})[`flagship_solo_visitor_${index}_${field.name}`];
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
                                              const newDetails = [...flagshipSoloVisitorPassDetails];
                                              newDetails[index] = { ...newDetails[index], [field.name]: e.target.value };
                                              setFlagshipSoloVisitorPassDetails(newDetails);
                                            }}
                                          >
                                            <option value="">Select</option>
                                            {(field.options || []).map(opt => (
                                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                          </select>
                                        ) : (
                                          <input
                                            type={inputType}
                                            inputMode={field.type === 'phone' ? 'tel' : undefined}
                                            required={!!field.required}
                                            className={`bg-black/40 border ${error ? 'border-pink-500' : 'border-white/20'} rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-white/40 text-sm`}
                                            placeholder={field.placeholder || ''}
                                            value={value}
                                            onChange={e => {
                                              const newDetails = [...flagshipSoloVisitorPassDetails];
                                              newDetails[index] = { ...newDetails[index], [field.name]: e.target.value };
                                              setFlagshipSoloVisitorPassDetails(newDetails);
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

                      {fieldGroups.map(group => (
                        <div key={group.signature} className="glass rounded-2xl p-6 border border-white/10 shadow-[0_0_22px_rgba(236,72,153,0.18)]">
                          <div className="mb-4">
                            <h3 className="font-semibold text-fuchsia-200">For: {group.events.map(e => e.title).join(', ')}</h3>
                            <p className="text-xs text-gray-400">Fill these details once; they'll apply to the selected events above.</p>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            {group.fields.map((field, idx) => {
                              const value = (formDataBySignature[group.signature] || {})[field.name] || '';
                              const error = (formErrors[group.signature] || {})[field.name];
                              const inputType = field.type === 'phone' ? 'tel' : (field.type === 'number' ? 'number' : (field.type === 'email' ? 'email' : 'text'));
                              const inputId = `g-${group.events.map(e => e.id).join('-')}-f-${idx}-${field.name}`;
                              const errorId = `${inputId}-error`;
                          return (
                                <div key={field.name} className="flex flex-col">
                                  <label htmlFor={inputId} className="text-sm text-white/80 mb-1">
                                    {field.label}{field.required ? <span className="text-pink-400"> *</span> : null}
                                  </label>
                                  {field.type === 'select' ? (
                                    <select
                                      id={inputId}
                                      required={!!field.required}
                                      aria-describedby={error ? errorId : undefined}
                                      className={`bg-black/40 border ${error ? 'border-pink-500' : 'border-white/20'} rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400`}
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
                                      <div className="text-xs text-white/60 mb-1">Max file size 10 MB</div>
                                      <input
                                        id={inputId}
                                        type="file"
                                        accept={field.accept || '*'}
                                        required={!!field.required}
                                        aria-describedby={error ? errorId : undefined}
                                        className={`bg-black/40 border ${error ? 'border-pink-500' : 'border-white/20'} rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-500 file:text-white hover:file:bg-purple-600 file:cursor-pointer cursor-pointer`}
                                        onChange={e => {
                                          const file = e.target.files?.[0] || null;
                                          if (file && file.size > 10 * 1024 * 1024) {
                                            alert('File too large. Maximum 10 MB allowed.');
                                            e.currentTarget.value = '';
                                            handleFileChange(group.signature, field.name, null);
                                            return;
                                          }
                                          handleFileChange(group.signature, field.name, file);
                                        }}
                                      />
                                      {value && (
                                        <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                                          <span>✓</span>
                                          <span>Selected: {value}</span>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <input
                                      id={inputId}
                                      type={inputType}
                                      inputMode={field.type === 'phone' ? 'tel' : undefined}
                                      required={!!field.required}
                                      aria-describedby={error ? errorId : undefined}
                                      className={`bg-black/40 border ${error ? 'border-pink-500' : 'border-white/20'} rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-white/40`}
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
                                                className={`bg-black/40 border ${error ? 'border-pink-500' : 'border-white/20'} rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-500 file:text-white hover:file:bg-purple-600 file:cursor-pointer cursor-pointer`}
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

                      {/* Support Artists Details Section */}
                      {supportArtistQuantity > 0 && (
                        <div className="glass rounded-2xl p-6 border border-white/10 shadow-[0_0_22px_rgba(168,85,247,0.18)]">
                          <div className="mb-4">
                            <h3 className="font-semibold text-purple-200">Support Artist Details ({supportArtistQuantity} artists)</h3>
                            <p className="text-xs text-gray-400">Fill details for each support artist. They will receive wristbands/badges for venue access.</p>
                          </div>
                          <div className="space-y-6">
                            {supportArtistDetails.map((artist, index) => (
                              <div key={index} className="glass rounded-xl p-4 border border-white/10">
                                <div className="flex justify-between items-center mb-4">
                                  <h4 className="text-sm font-medium text-white/90">Support Artist {index + 1}</h4>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                  {SUPPORT_ARTIST_FIELDS.map(field => {
                                    const error = (formErrors['supportArtists'] || {})[`artist_${index}_${field.name}`];
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
                                              const newDetails = [...supportArtistDetails];
                                              newDetails[index] = { ...newDetails[index], [field.name]: e.target.value };
                                              setSupportArtistDetails(newDetails);
                                            }}
                                          >
                                            <option value="">Select</option>
                                            {(field.options || []).map(opt => (
                                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                          </select>
                                        ) : (
                                          <input
                                            type={inputType}
                                            inputMode={field.type === 'phone' ? 'tel' : undefined}
                                            required={!!field.required}
                                            className={`bg-black/40 border ${error ? 'border-pink-500' : 'border-white/20'} rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-white/40 text-sm`}
                                            placeholder={field.placeholder || ''}
                                            value={value}
                                            onChange={e => {
                                              const newDetails = [...supportArtistDetails];
                                              newDetails[index] = { ...newDetails[index], [field.name]: e.target.value };
                                              setSupportArtistDetails(newDetails);
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

                      {/* Flagship Visitor Pass Details Section */}
                      {flagshipVisitorPassQuantity > 0 && (
                        <div className="glass rounded-2xl p-6 border border-white/10 shadow-[0_0_22px_rgba(34,197,94,0.18)]">
                          <div className="mb-4">
                            <h3 className="font-semibold text-green-200">Flagship Visitor Pass Details ({flagshipVisitorPassQuantity} passes)</h3>
                            <p className="text-xs text-gray-400">Fill details for each complimentary visitor pass. These are included with your flagship group registration.</p>
                          </div>
                          <div className="space-y-6">
                            {flagshipVisitorPassDetails.map((visitor, index) => (
                              <div key={index} className="glass rounded-xl p-4 border border-white/10">
                                <div className="flex justify-between items-center mb-4">
                                  <h4 className="text-sm font-medium text-white/90">Visitor {index + 1}</h4>
                                  <span className="text-xs text-green-400 font-medium">Complimentary</span>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                  {VISITOR_PASS_FIELDS.map(field => {
                                    const error = (formErrors['flagshipVisitorPasses'] || {})[`flagship_visitor_${index}_${field.name}`];
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
                                              const newDetails = [...flagshipVisitorPassDetails];
                                              newDetails[index] = { ...newDetails[index], [field.name]: e.target.value };
                                              setFlagshipVisitorPassDetails(newDetails);
                                            }}
                                          >
                                            <option value="">Select</option>
                                            {(field.options || []).map(opt => (
                                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                          </select>
                                        ) : (
                                          <input
                                            type={inputType}
                                            inputMode={field.type === 'phone' ? 'tel' : undefined}
                                            required={!!field.required}
                                            className={`bg-black/40 border ${error ? 'border-pink-500' : 'border-white/20'} rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-white/40 text-sm`}
                                            placeholder={field.placeholder || ''}
                                            value={value}
                                            onChange={e => {
                                              const newDetails = [...flagshipVisitorPassDetails];
                                              newDetails[index] = { ...newDetails[index], [field.name]: e.target.value };
                                              setFlagshipVisitorPassDetails(newDetails);
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
                    </div>
                    <div className="flex items-center gap-3 mt-8">
                      <button onClick={goBack} className="px-5 py-2 rounded-full bg-white/10 border border-white/10 hover:bg-white/15 transition cursor-pointer">Back</button>
                      <button onClick={goNext} className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 transition cursor-pointer">Continue</button>
                    </div>
                  </div>
                  <div>
                    <div className="glass rounded-2xl p-6 border border-white/10 shadow-[0_0_24px_rgba(59,130,246,0.18)] static overflow-hidden">
                      <div className="pointer-events-none absolute -top-10 right-0 h-24 w-24 rounded-full bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-400/20 blur-2xl"></div>
                      <h3 className="font-semibold text-cyan-200">Selected Items</h3>
                      <ul className="mt-4 space-y-2 text-sm">
                        {visitorPassQuantity > 0 && (
                          <li className="flex justify-between">
                            <div>
                              <div className="font-medium">Visitor Passes ({visitorPassQuantity})</div>
                              <div className="text-xs text-white/70">Non-participant entry</div>
                            </div>
                            <span className="text-yellow-400 font-medium">₹{visitorPassQuantity * 69}</span>
                          </li>
                        )}
                        {selectedEvents.map(ev => (
                          <li key={ev.id} className="flex justify-between">
                            <div>
                              <div className="font-medium">{ev.title}</div>
                              {/* Date/time intentionally hidden on checkout page */}
                              <div className="text-xs text-white/70"></div>
                            </div>
                            <span className="text-green-400 font-medium">{ev.price}</span>
                          </li>
                        ))}
                      </ul>
                      {/* Promo code input */}
                      <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
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
                          <div className="text-xs text-green-400 mt-2">Applied {appliedPromo.code}: -₹{appliedPromo.discountAmount}</div>
                        )}
                      </div>

                      <div className="border-t border-white/10 mt-4 pt-4 space-y-1 font-semibold">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>₹{totalPrice}</span>
                        </div>
                        {appliedPromo && (
                          <div className="flex justify-between text-green-400">
                            <span>Discount ({appliedPromo.code})</span>
                            <span>-₹{appliedPromo.discountAmount}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-lg">
                          <span>Total</span>
                          <span>₹{finalPrice}</span>
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
                        <h3 className="font-semibold text-cyan-200 mb-3">Selected Items</h3>
                        <ul className="space-y-2 text-sm">
                          {visitorPassQuantity > 0 && (
                            <li className="flex justify-between">
                              <span>Visitor Passes ({visitorPassQuantity})</span>
                              <span>₹{visitorPassQuantity * 69}</span>
                            </li>
                          )}
                          {selectedEvents.map(ev => (
                            <li key={ev.id} className="flex justify-between">
                              <span>{ev.title}</span>
                              <span>{ev.price}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Visitor Pass Details Review */}
                      {visitorPassQuantity > 0 && (
                        <div className="glass rounded-2xl p-6 border border-white/10">
                          <h3 className="font-semibold text-yellow-200 mb-3">Visitor Pass Details</h3>
                          <div className="space-y-4">
                            {visitorPassDetails.map((visitor, index) => (
                              <div key={index} className="glass rounded-xl p-4 border border-white/10">
                                <h4 className="text-sm font-medium text-white/90 mb-2">Visitor {index + 1}</h4>
                                <div className="grid md:grid-cols-2 gap-3 text-sm">
                                  {VISITOR_PASS_FIELDS.map(field => (
                                    <div key={field.name} className="flex justify-between gap-4">
                                      <span className="text-white/70">{field.label}</span>
                                      <span className="text-white/90 break-words">{visitor[field.name] || '-'}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {fieldGroups.map(group => (
                        <div key={group.signature} className="glass rounded-2xl p-6 border border-white/10">
                          <h3 className="font-semibold text-fuchsia-200">Details for: {group.events.map(e => e.title).join(', ')}</h3>
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
                      <button onClick={proceedToPayment} className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 transition cursor-pointer">Proceed to Payment</button>
                    </div>
                      </div>
                  <div>
                    <div className="glass rounded-2xl p-6 border border-white/10 shadow-[0_0_24px_rgba(59,130,246,0.18)] relative overflow-hidden">
                      <div className="pointer-events-none absolute -top-10 right-0 h-24 w-24 rounded-full bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-400/20 blur-2xl"></div>
                      <h3 className="font-semibold text-cyan-200">Total</h3>
                      <div className="mt-4 text-3xl font-bold">₹{finalPrice}</div>
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
                      <div className="mt-4 text-3xl font-bold">₹{finalPrice}</div>
                      
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
                { title: 'Schedule', href: '/schedule/progress', icon: <Clock className="w-5 h-5" /> },
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
