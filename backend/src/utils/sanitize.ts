export function sanitizeString(value: string): string {
  return value.replace(/[<>]/g, '').trim();
}

export function sanitizeOptionalString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const sanitized = sanitizeString(value);
  return sanitized.length > 0 ? sanitized : undefined;
}

export function sanitizeStringArray(value: unknown, lowercase = false): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => sanitizeString(item))
    .filter(Boolean)
    .map((item) => (lowercase ? item.toLowerCase() : item));
}
