// src/components/types.ts
export type ClientType = 'Homeowner' | 'Contractor' | 'Realtor' | 'Designer' | 'Property Manager' | 'Other';
export type LeadSource = 'Referral' | 'Google' | 'LSA' | 'Repeat' | 'Other' | '';
export type ContactRole = 'Owner' | 'Spouse' | 'GC' | 'Designer' | 'Other';
export type PhoneLabel = 'Mobile' | 'Home' | 'Work';
export type PreferredContactMethod = 'Phone Call' | 'Text/SMS' | 'Email';

export interface PhoneEntry {
  number: string;
  label: PhoneLabel;
  name: string;
}

export interface EmailEntry {
  email: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onSaveAndSchedule: () => void;
  onSaveAndQuote: () => void;
}
