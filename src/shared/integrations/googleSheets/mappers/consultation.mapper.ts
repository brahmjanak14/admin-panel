import type { Lead } from '../../../../modules/leads/schema/leads.schema';
import type { ConsultationSheetRow } from '../types';

function meta(lead: Lead, key: string): string {
  return lead.metadata?.[key] ?? '';
}

export function mapConsultationLead(lead: Lead): ConsultationSheetRow {
  return {
    submittedAt: lead.createdAt,
    fullName: lead.name,
    email: lead.email,
    phone: lead.phone ?? '',
    preferredDate: meta(lead, 'preferredDate'),
    destination: lead.country ?? '',
    service: lead.service ?? '',
    message: lead.message ?? '',
  };
}
