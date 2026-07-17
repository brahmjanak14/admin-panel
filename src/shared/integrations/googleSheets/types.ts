import type { Lead } from '../../../modules/leads/leads.types';

export type SheetDefinition = {
  /** Lead type this sheet handles, e.g. "contact" | "consultation" */
  leadType: Lead['type'];
  /** Spreadsheet tab name (from env) */
  getSheetName: () => string;
  headers: string[];
  /** Map a lead into a single spreadsheet row (same order as headers). */
  toValues: (lead: Lead) => string[];
};

export type ContactSheetRow = {
  submittedAt: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export type ConsultationSheetRow = {
  submittedAt: string;
  fullName: string;
  email: string;
  phone: string;
  preferredDate: string;
  destination: string;
  service: string;
  message: string;
};
