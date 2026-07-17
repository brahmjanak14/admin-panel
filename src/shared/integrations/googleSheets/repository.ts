import { getSheetsClient, getSpreadsheetId } from './client';

function columnLetter(index: number): string {
  let n = index;
  let letter = '';
  while (n > 0) {
    const rem = (n - 1) % 26;
    letter = String.fromCharCode(65 + rem) + letter;
    n = Math.floor((n - 1) / 26);
  }
  return letter;
}

export const googleSheetsRepository = {
  async ensureHeaderRow(sheetName: string, headers: string[]): Promise<void> {
    const sheets = getSheetsClient();
    const spreadsheetId = getSpreadsheetId();
    const range = `${sheetName}!A1:${columnLetter(headers.length)}1`;

    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const firstRow = existing.data.values?.[0];
    if (firstRow && firstRow.length > 0) return;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: { values: [headers] },
    });
  },

  async appendRow(sheetName: string, values: string[]): Promise<void> {
    const sheets = getSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:A`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [values] },
    });
  },
};
