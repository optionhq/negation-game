// pages/api/thread.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { fetchThread } from '@/hooks/useThread';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Invalid thread id' });
  }

  try {
    const threadData = await fetchThread(id);
    res.status(200).json(threadData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching thread data' });
  }
}