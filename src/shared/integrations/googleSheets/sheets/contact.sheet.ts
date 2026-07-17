import { env } from '../../../../config/env';
import { mapContactLead } from '../mappers/contact.mapper';
import type { SheetDefinition } from '../types';

/** Contact Us form → "Contact" spreadsheet tab */
export const contactSheet: SheetDefinition = {
  leadType: 'contact',
  getSheetName: () => env.GOOGLE_SHEETS_CONTACT_TAB,
  headers: ['Timestamp', 'Full name', 'Email', 'Phone', 'Subject', 'Message'],
  toValues: (lead) => {
    const row = mapContactLead(lead);
    return [row.submittedAt, row.fullName, row.email, row.phone, row.subject, row.message];
  },
};
