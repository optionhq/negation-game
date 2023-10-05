// these are the only URLs that can used to fetch a cast
const okUrls = [
  // warpcast.com/usr/0x...
  /.*warpcast\.com\/[^/]+\/0x[a-fA-F0-9]+$/
];

/**
 * This function extracts the URL from the first url embed in the cast, if it exists.
 * It only returns URLs from a permissible source (i.e. that can be used to fetch a cast)
 * @param {any} cast - The cast object from which to extract the URL.
 * @param {Regex[]} permissibleUrls - An array of permissible URLs.
 * @returns {string|null} - The extracted URL if it exists and is permissible, or null otherwise.
 */
export function extractEndPointUrl(cast: any, urlCheck: RegExp[] = okUrls): string | null {
  if (cast.embeds) {
    const embed = cast.embeds.find((embed: any) => {
      if (embed.url) {
        return urlCheck.some(urlRegex => urlRegex.test(embed.url));
      }
      return false;
    });
    return embed?.url || null;
  }
  return null;
}