import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';


export async function fetchThread(id: string) {
  try {
    const response = await axios.get('https://api.neynar.com/v1/farcaster/all-casts-in-thread', {
      params: {
        api_key: process.env.NEYNAR_API_KEY,
        // Hash of the first cast in thread
        threadHash: id,
      },
      headers: {accept: 'text/plain'}
    });

    if (response.status !== 200) {
      console.error(`Error fetching thread: ${response.statusText}`);
      return;
    }
    
    return response.data.result.casts;
  } catch (error) {
    console.error('Error in fetchThread:', error);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Invalid thread id' });
  }

  const threadData = await fetchThread(id);
  res.status(200).json(threadData);
}