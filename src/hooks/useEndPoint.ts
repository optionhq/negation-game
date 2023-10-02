import axios from 'axios';
import { PointsTree } from '@/types/PointsTree';

async function fetchCastByUrl(url: string): Promise<any> {
  const options = {
    method: 'GET',
    url: 'https://api.neynar.com/v2/farcaster/cast',
    params: {type: 'url', identifier: url},
    headers: {accept: 'application/json', api_key: process.env.NEYNAR_API_KEY}
  };

  const response = await axios.request(options);
  return response.data.cast;
}

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
  return cast.embeds && cast.embeds.find((embed: any) => embed.url && urlCheck.some(urlRegex => urlRegex.test(embed.url)))?.url || null;
}

export async function getEndPoint(endPointUrl: string) {
  if (!endPointUrl) return null;
  
  try {
    const endCast = await fetchCastByUrl(endPointUrl);
    const point: PointsTree = {
      title: endCast.text,
      id: endCast.hash,
      points: endCast.reactions.likes.length, // using likes as the proxy for points for now
      replyCount: endCast.replies.count,
    }
    return point;
  } catch (error) {
    console.error('Error fetching endpoint:', error);
    return { title: 'Error fetching endpoint', id: 'error', points: 0, replyCount: 0 };
  }
}