// Checkout constants and field configurations
import { FieldSet, TeamSizeConfig, Step } from './types';

export const REGISTRATION_OPEN = true;

export const SOLO_FIELDS: FieldSet = [
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

export const VISITOR_PASS_FIELDS: FieldSet = [
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

export const SUPPORT_ARTIST_FIELDS: FieldSet = [
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

export const TEAM_ESPORTS_FIELDS: FieldSet = [
  { name: 'teamName', label: 'Team Name', type: 'text', required: true },
  { name: 'leaderDiscord', label: 'Leader Discord ID', type: 'text', required: true },
  { name: 'leaderRiotId', label: 'Leader In-Game ID', type: 'text', required: true },
  ...SOLO_FIELDS
];

export const TEAM_FIELDS: FieldSet = [
  { name: 'teamName', label: 'Team Name', type: 'text', required: true },
  ...SOLO_FIELDS
];

export const SQUAD_ESPORTS_FIELDS: FieldSet = [
  { name: 'teamName', label: 'Squad Name', type: 'text', required: true },
  { name: 'leaderIgn', label: 'Leader In-Game Name', type: 'text', required: true },
  { name: 'leaderUid', label: 'Leader UID', type: 'text', required: true },
  ...SOLO_FIELDS
];

export const TEAM_SIZE_CONFIG: Record<string, TeamSizeConfig> = {
  'RAMPWALK - PANACHE': { min: 7, max: 18 },
  'DANCE BATTLE': { min: 10, max: 25 },
  'ECHOES OF NOOR': { min: 1, max: 2 },
  'VERSEVAAD': { min: 1, max: 2 },
  'BANDJAM': { min: 3, max: 8 },
  'VALORANT TOURNAMENT': { min: 5, max: 5 },
  'FREE FIRE TOURNAMENT': { min: 4, max: 4 },
  'BGMI TOURNAMENT': { min: 4, max: 5 }
};

export const STEPS: { id: Step; name: string }[] = [
  { id: 'select', name: 'Select Events' },
  { id: 'forms', name: 'Your Details' },
  { id: 'review', name: 'Review' },
  { id: 'payment', name: 'Payment' },
];
