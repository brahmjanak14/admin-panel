/**
 * Integrations entrypoint.
 * Importing this module registers all outbound integrations (Google Sheets, …).
 *
 * Usage from domain services:
 *   import { notifyLeadCreated } from '../../shared/integrations';
 *   await notifyLeadCreated(lead);
 */

import './googleSheets';

export { notifyLeadCreated, registerIntegration } from './base';
export type { LeadIntegration } from './base';
export { isGoogleSheetsEnabled } from './googleSheets';
