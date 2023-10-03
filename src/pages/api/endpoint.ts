// pages/api/endpoint.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getEndPoint } from '@/hooks/useEndPoints';

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