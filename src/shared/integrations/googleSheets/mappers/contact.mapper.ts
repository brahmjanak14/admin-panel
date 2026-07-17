import type { Lead } from '../../../../modules/leads/leads.types';
import type { ContactSheetRow } from '../types';

function meta(lead: Lead, key: string): string {
  return lead.metadata?.[key] ?? '';
}

export function mapContactLead(lead: Lead): ContactSheetRow {
  return {
    submittedAt: lead.createdAt,
    fullName: lead.name,
    email: lead.email,
    phone: lead.phone ?? '',
    subject: meta(lead, 'subject'),
    message: lead.message ?? '',
  };
}
