type CsvRow = Record<string, string | number | undefined | null>;

export function toCsv(rows: CsvRow[], columns: { key: string; header: string }[]): string {
  const escape = (value: string) => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const header = columns.map((c) => escape(c.header)).join(',');
  const lines = rows.map((row) =>
    columns
      .map((c) => {
        const val = row[c.key];
        return escape(val == null ? '' : String(val));
      })
      .join(','),
  );
  return [header, ...lines].join('\n');
}
