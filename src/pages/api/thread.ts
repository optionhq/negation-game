import { NextApiRequest, NextApiResponse } from 'next';
import { fetchThread } from '@/hooks/useThread';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Invalid thread id' });
  }

  const threadData = await fetchThread(id);
  res.status(200).json(threadData);
}