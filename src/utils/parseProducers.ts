export function parseProducers(producersString: string): string[] {
  if (!producersString || !producersString.trim()) {
    return [];
  }

  const normalized = producersString
    .replace(/\s*,\s*/g, ',')
    .replace(/\s+and\s+/gi, ',')
    .trim();

  return normalized
    .split(',')
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}
