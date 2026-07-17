import type { Lead } from '../../../modules/leads/schema/leads.schema';
import type { LeadIntegration } from '../base';
import { isGoogleSheetsEnabled } from './client';
import { googleSheetsRepository } from './repository';
import { getSheetDefinition, getSupportedLeadTypes } from './sheets';

export const googleSheetsIntegration: LeadIntegration = {
  name: 'google-sheets',

  isEnabled: isGoogleSheetsEnabled,

  supports(lead: Lead): boolean {
    return getSupportedLeadTypes().includes(lead.type);
  },

  async sync(lead: Lead): Promise<void> {
    const sheet = getSheetDefinition(lead.type);
    if (!sheet) return;

    const sheetName = sheet.getSheetName();
    await googleSheetsRepository.ensureHeaderRow(sheetName, sheet.headers);
    await googleSheetsRepository.appendRow(sheetName, sheet.toValues(lead));
  },
};
