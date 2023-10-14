// app/api/casts/route.ts

import { NextResponse } from 'next/server'
import { NextApiRequest } from 'next'
import neynarClient from '@/lib/neynar'
import Joi from 'joi';

const schema = Joi.object({
  channel: Joi.string().required(),
});

export async function GET(request: NextApiRequest) {
  const { error, value } = schema.validate(request.query);
  if (error) return new Response(error.details[0].message, { status: 400 });

  const feed = await neynarClient.getChannelFeed(value.channel);
  return NextResponse.json(feed);
}