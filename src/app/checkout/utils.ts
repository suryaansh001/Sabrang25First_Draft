// Utility functions for checkout
import { EventCatalogItem } from '../../lib/eventCatalog';
import { 
  SOLO_FIELDS, 
  TEAM_ESPORTS_FIELDS, 
  SQUAD_ESPORTS_FIELDS, 
  TEAM_FIELDS,
  TEAM_SIZE_CONFIG 
} from './constants';
import { FieldSet, TeamSizeConfig } from './types';

export function parsePrice(priceStr: string): number {
  if (!priceStr || priceStr.toLowerCase() === 'free') return 0;
  const match = priceStr.match(/₹([\d,]+)/);
  if (!match) return 0;
  const numeric = match[1].replace(/,/g, '');
  return parseInt(numeric, 10) || 0;
}

export function formatPrice(price: number): string {
  return price.toFixed(2);
}

export function getDefaultFieldsForEvent(ev: EventCatalogItem): FieldSet {
  if (ev.title.includes('VALORANT')) return TEAM_ESPORTS_FIELDS;
  if (ev.title.includes('BGMI') || ev.title.includes('FREE FIRE')) return SQUAD_ESPORTS_FIELDS;
  if (ev.title.includes('RAMPWALK') || ev.title.includes('DANCE') || ev.title.includes('BANDJAM') || ev.title.includes('BAND JAM')) return TEAM_FIELDS;
  return SOLO_FIELDS;
}

export function getEventFields(ev: EventCatalogItem): FieldSet {
  return getDefaultFieldsForEvent(ev);
}

export function getTeamSizeConfig(eventTitle: string): TeamSizeConfig | null {
  return TEAM_SIZE_CONFIG[eventTitle] || null;
}

export function isTeamEvent(eventTitle: string): boolean {
  const config = getTeamSizeConfig(eventTitle);
  return config ? config.max > 1 : false;
}

export function isFlagshipGroupEvent(eventTitle: string): boolean {
  const flagshipGroupEvents = ['RAMPWALK - PANACHE', 'DANCE BATTLE', 'BANDJAM'];
  return flagshipGroupEvents.includes(eventTitle);
}

export function isFlagshipSoloEvent(eventTitle: string): boolean {
  const flagshipSoloEvents = ['STEP UP', 'ECHOES OF NOOR', 'VERSEVAAD'];
  return flagshipSoloEvents.includes(eventTitle);
}

// Storage utilities with error handling
export function saveToStorage(key: string, data: any): void {
  try {
    sessionStorage.setItem(`checkout_${key}`, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save to storage:', error);
  }
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const saved = sessionStorage.getItem(`checkout_${key}`);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.warn('Failed to load from storage:', error);
    return defaultValue;
  }
}

export function clearStorage(): void {
  try {
    const keys = Object.keys(sessionStorage).filter(key => key.startsWith('checkout_'));
    keys.forEach(key => sessionStorage.removeItem(key));
  } catch (error) {
    console.warn('Failed to clear storage:', error);
  }
}

// Validation utilities
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone.trim());
}
