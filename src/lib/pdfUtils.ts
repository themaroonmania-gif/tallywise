// Shared helpers for the PDF tools.

/**
 * Parse a human page-range string like "1-3, 5, 8-10" into a sorted, de-duped
 * array of 0-based page indices, clamped to the document's page count.
 * Returns an empty array if nothing valid is found.
 */
export function parsePageRanges(input: string, totalPages: number): number[] {
  const result = new Set<number>();
  const parts = input.split(',');
  for (const raw of parts) {
    const part = raw.trim();
    if (!part) continue;
    const rangeMatch = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      let start = parseInt(rangeMatch[1], 10);
      let end = parseInt(rangeMatch[2], 10);
      if (start > end) [start, end] = [end, start];
      for (let p = start; p <= end; p++) {
        if (p >= 1 && p <= totalPages) result.add(p - 1);
      }
    } else {
      const single = parseInt(part, 10);
      if (!Number.isNaN(single) && single >= 1 && single <= totalPages) {
        result.add(single - 1);
      }
    }
  }
  return Array.from(result).sort((a, b) => a - b);
}

/** Strip a file extension for building output names. */
export function baseName(filename: string): string {
  return filename.replace(/\.[^./\\]+$/, '');
}
