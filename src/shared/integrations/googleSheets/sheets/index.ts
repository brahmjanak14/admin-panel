import type { Lead } from '../../../../modules/leads/leads.types';
import type { SheetDefinition } from '../types';
import { contactSheet } from './contact.sheet';
import { consultationSheet } from './consultation.sheet';

/**
 * Register every form → sheet mapping here.
 * To add newsletter/career later: create a sheet file and push it into this list.
 */
const sheetDefinitions: SheetDefinition[] = [contactSheet, consultationSheet];

export function getSheetDefinition(leadType: Lead['type']): SheetDefinition | undefined {
  return sheetDefinitions.find((sheet) => sheet.leadType === leadType);
}

export function getSupportedLeadTypes(): Lead['type'][] {
  return sheetDefinitions.map((sheet) => sheet.leadType);
}
