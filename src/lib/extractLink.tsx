export function extractLink(text: string): { text: string; link: string | null } {
  if (!text) return { text: "", link: null };
  // Regular expression to match links starting with "https://warpcast.com/"
  const linkRegex = /.*warpcast\.com\/[^/]+\/0x[a-fA-F0-9]+$/;

  // Search for the link in the text
  const match = text.match(linkRegex);

  if (match && match.length > 0) {
    // Extract the link
    const link = match[0];

    // Check if the link is at the end of the text
    if (text.endsWith(link)) {
      // Extract the text before the link
      const extractedText = text.substring(0, text.length - link.length);
      return {
        text: extractedText.trim(),
        link: link,
      };
    }
  }

  // If no matching link is found at the end of the text, return link as null
  return {
    text: text,
    link: null,
  };
}
