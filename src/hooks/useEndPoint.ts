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

/**
 * This function extracts the URL from the first url embed in the cast, if it exists.
 * It only returns URLs from a permissible source (i.e. can be used to fetch a cast)
 * @param {any} cast - The cast object from which to extract the URL.
 * @param {string[]} permissibleUrls - An array of permissible URLs.
 * @returns {string|null} - The extracted URL if it exists and is permissible, or null otherwise.
 */
function extractEndPointUrl(cast: any, permissibleUrls: string[] = ["warpcast.com"]): string | null {
  return cast.embeds && cast.embeds.find((embed: any) => embed.url && permissibleUrls.some(url => embed.url.includes(url)))?.url || null;
}

export async function getEndPoint(cast: any) {
  const endPointUrl = extractEndPointUrl(cast);
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
    return null; // or return a fallback value
  }
}