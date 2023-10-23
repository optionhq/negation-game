// pages/api/endpoint.ts
import axios from 'axios';
import { EndPointsTree } from '@/types/PointsTree';
import type { NextApiRequest, NextApiResponse } from 'next'

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

async function getEndPoint(endPointUrl: string) {
  if (!endPointUrl) return null;
  
  try {
    const endCast = await fetchCastByUrl(endPointUrl);
    const point: EndPointsTree = {
      title: endCast.text,
      id: endCast.hash,
      points: endCast.reactions.likes.length,
      replyCount: endCast.replies.count,
    }
    return point;
  } catch (error) {
    console.error('Error fetching endpoint:', error);
    return { title: 'Error fetching endpoint', id: 'error', points: 0, replyCount: 0 };
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let { endPointUrl } = req.query;
  
  // Ensure endPointUrl is a string
  if (Array.isArray(endPointUrl)) {
    endPointUrl = endPointUrl[0];
  }

  if (!endPointUrl) {
    return res.status(400).json({ error: 'Missing endPointUrl parameter' });
  }

  try {
    const endPoint = await getEndPoint(endPointUrl);
    return res.status(200).json(endPoint);
  } catch (error) {
    console.error('Error fetching endpoint:', error);
    return res.status(500).json({ error: 'Error fetching endpoint' });
  }
}