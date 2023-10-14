import neynarClient from '@/lib/neynar'
import { NextApiResponse, NextApiRequest } from 'next'
import Joi from 'joi'

const getSchema = Joi.object({
  fid: Joi.number().required(),
})

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { error, value } = getSchema.validate(req.query)
  if (error) return res.status(400).send(error.details[0].message)

  const feed = await neynarClient.getFollowingFeed(value.fid)
  return res.json(feed)
}

const postSchema = Joi.object({
  signerUuid: Joi.string().required(),
  text: Joi.string().required(),
})

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { error, value } = postSchema.validate(req.query)
  if (error) return res.status(400).send(error.details[0].message)

  await neynarClient.postCast(value.signerUuid, value.text)

  return res.status(201).send(null)
}