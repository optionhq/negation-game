export const extractTruncatedHash = (castText: string): string | null =>
	castText.match(/(?<=.*warpcast\.com\/[^/]+\/)0x[a-fA-F0-9]+$/)?.[0] ?? null;
