export type LeadType = 'contact' | 'consultation' | 'newsletter' | 'career';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';

export interface Lead {
  id: string;
  type: LeadType;
  status: LeadStatus;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source?: string;
  country?: string;
  service?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, string>;
}

export interface CreateLeadInput {
  type: LeadType;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source?: string;
  country?: string;
  service?: string;
  /** Contact Us form field */
  subject?: string;
  /** Book Consultation form field */
  preferredDate?: string;
  metadata?: Record<string, string>;
}
