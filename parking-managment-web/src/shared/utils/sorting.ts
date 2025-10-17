/**
 * Natural sort helper for strings containing numbers
 * Handles negative numbers, positive numbers, and mixed alphanumeric strings
 * 
 * @param a - First string to compare
 * @param b - Second string to compare
 * @returns Comparison result (-1, 0, 1)
 * 
 * @example
 * // Sorts floors correctly: ["-2", "-1", "0", "1", "2"]
 * ["1", "-2", "0", "-1", "2"].sort(naturalCompare)
 * 
 * @example
 * // Sorts mixed content: ["A1", "A2", "A10", "B1"]
 * ["A10", "A1", "B1", "A2"].sort(naturalCompare)
 */
export function naturalCompare(a: string, b: string): number {
  const chunkify = (str: string) =>
    str.match(/(-?\d+|\D+)/g)?.map(part =>
      /^-?\d+$/.test(part) ? Number(part) : part
    ) || [str];

  const aChunks = chunkify(a);
  const bChunks = chunkify(b);

  const len = Math.max(aChunks.length, bChunks.length);

  for (let i = 0; i < len; i++) {
    const aPart = aChunks[i];
    const bPart = bChunks[i];

    if (aPart === undefined) return -1;
    if (bPart === undefined) return 1;

    if (typeof aPart === "number" && typeof bPart === "number") {
      if (aPart !== bPart) return aPart - bPart;
    } else if (typeof aPart === "string" && typeof bPart === "string") {
      const cmp = aPart.localeCompare(bPart);
      if (cmp !== 0) return cmp;
    } else {
      // Numbers come before strings
      return typeof aPart === "number" ? -1 : 1;
    }
  }

  return 0;
}
