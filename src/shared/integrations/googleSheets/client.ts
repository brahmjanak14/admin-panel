import { google, sheets_v4 } from 'googleapis';
import { env } from '../../../config/env';

let sheetsClient: sheets_v4.Sheets | null = null;

export function isGoogleSheetsEnabled(): boolean {
  return Boolean(
    env.GOOGLE_SHEETS_ENABLED &&
      env.GOOGLE_SHEETS_SPREADSHEET_ID &&
      env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      env.GOOGLE_PRIVATE_KEY,
  );
}

export function getSheetsClient(): sheets_v4.Sheets {
  if (sheetsClient) return sheetsClient;

  if (!isGoogleSheetsEnabled()) {
    throw new Error('Google Sheets is not configured');
  }

  const privateKey = env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n');

  const auth = new google.auth.JWT({
    email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  sheetsClient = google.sheets({ version: 'v4', auth });
  return sheetsClient;
}

export function getSpreadsheetId(): string {
  return env.GOOGLE_SHEETS_SPREADSHEET_ID!;
}
