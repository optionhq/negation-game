import { NextApiResponse, NextApiRequest } from 'next'
import neynarClient from '@/lib/neynar'
import Joi from 'joi'

const schema = Joi.object({
  signerUuid: Joi.string().required(),
  hash: Joi.string().required(),
});

export async function POST(request: NextApiRequest, response: NextApiResponse) {
  const { error, value } = schema.validate(request.query);
  if (error) return response.status(400).send(error.details[0].message);

  await neynarClient.likeCast(value.signerUuid, value.hash);
  return response.status(201).json({});
}

export async function DELETE(request: NextApiRequest, response: NextApiResponse) {
  const { error, value } = schema.validate(request.query);
  if (error) return response.status(400).send(error.details[0].message);

  await neynarClient.unlikeCast(value.signerUuid, value.hash);
  return response.status(204).json({});
}