// pages/api/endpoint.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { extractEndPointUrl, getEndPoint } from '@/hooks/useEndPoint';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { cast } = req.query;
  if (!cast) {
    return res.status(400).json({ error: 'Missing cast parameter' });
  }

  try {
    const endPointUrl = extractEndPointUrl(cast);
    if (endPointUrl) {
      const endPoint = await getEndPoint(endPointUrl);
      return res.status(200).json(endPoint);
    }
  } catch (error) {
    console.error('Error fetching endpoint:', error);
    return res.status(500).json({ error: 'Error fetching endpoint' });
  }
}