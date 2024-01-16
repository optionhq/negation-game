import { NextApiResponse, NextApiRequest } from 'next'
import neynarClient from '@/lib/neynar'
import Joi from 'joi'

const schema = Joi.object({
  fid: Joi.number().required(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { error, value } = schema.validate(req.query);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const { result: { notifications } } = await neynarClient.getMentionsAndReplies(value.fid);
    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch notifications' });
  }
}