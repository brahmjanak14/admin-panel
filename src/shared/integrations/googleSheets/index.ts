import { registerIntegration } from '../base';
import { googleSheetsIntegration } from './googleSheets.integration';

registerIntegration(googleSheetsIntegration);

export { googleSheetsIntegration } from './googleSheets.integration';
export { isGoogleSheetsEnabled } from './client';
export type { ContactSheetRow, ConsultationSheetRow, SheetDefinition } from './types';
