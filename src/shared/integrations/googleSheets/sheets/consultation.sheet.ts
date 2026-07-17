import { env } from '../../../../config/env';
import { mapConsultationLead } from '../mappers/consultation.mapper';
import type { SheetDefinition } from '../types';

/** Book Consultation form → "Consultation" spreadsheet tab */
export const consultationSheet: SheetDefinition = {
  leadType: 'consultation',
  getSheetName: () => env.GOOGLE_SHEETS_CONSULTATION_TAB,
  headers: [
    'Timestamp',
    'Full name',
    'Email',
    'Phone',
    'Preferred date',
    'Destination',
    'Service',
    'Message',
  ],
  toValues: (lead) => {
    const row = mapConsultationLead(lead);
    return [
      row.submittedAt,
      row.fullName,
      row.email,
      row.phone,
      row.preferredDate,
      row.destination,
      row.service,
      row.message,
    ];
  },
};
