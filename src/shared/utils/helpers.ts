export function toJsonValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function paramString(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}
