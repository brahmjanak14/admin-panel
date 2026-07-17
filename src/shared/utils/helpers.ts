import type { Prisma } from '@prisma/client';

export function toJsonValue<T>(value: T): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export function paramString(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}
