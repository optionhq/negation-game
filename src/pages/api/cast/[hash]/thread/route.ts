import neynarClient from '@/lib/neynar'
import { NextResponse } from 'next/server'
import { NextApiRequest } from 'next'
import Joi from 'joi'

const schema = Joi.object({
  hash: Joi.string().required(),
});

export async function GET(request: NextApiRequest) {
  const { error, value } = schema.validate(request.query);
  if (error) return new Response(error.details[0].message, { status: 400 });

  const thread = await neynarClient.getCastsInThread(value.hash);
  return NextResponse.json(thread);
}