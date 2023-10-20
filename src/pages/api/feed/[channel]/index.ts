import { NextResponse } from 'next/server'
import { NextApiRequest, NextApiResponse } from 'next'
import neynarClient from '@/lib/neynar'
import Joi from 'joi';

const schema = Joi.object({
  channel: Joi.string().required(),
});

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { error, value } = schema.validate(req.query);
  if (error) return new Response(error.details[0].message, { status: 400 });

  const feed = await neynarClient.getChannelFeed(value.channel);
  return res.status(200).json(feed);
}