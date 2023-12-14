import { NextResponse } from 'next/server'
import { NextApiRequest, NextApiResponse } from 'next'
import neynarClient from '@/lib/neynar'
import Joi from 'joi';

const schema = Joi.object({
  channel: Joi.string().required(),
  cursor: Joi.string().optional()
});

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { error, value } = schema.validate(req.query);

  if (error) return res.status(400).json({ error: error.details[0].message });

  const pagination = {
    cursor: value.cursor,
    limit: 25
  };

  const feed = await neynarClient.getChannelFeed(value.channel, pagination);
  return res.status(200).json(feed);
}