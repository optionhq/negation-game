import neynarClient from '@/lib/neynar'
import { Cast } from 'neynar-next/server'
import { NextApiResponse } from 'next'
import { NextApiRequest } from 'next'
import Joi from 'joi'

const getSchema = Joi.object({
  type: Joi.string().valid('url', 'hash').required(),
  identifier: Joi.string().required(),
})

async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { error, value } = getSchema.validate(req.query)
  if (error) return res.status(400).json({ error: error.details[0].message })

  const cast = await neynarClient.getCast(value.type, value.identifier)
  return res.status(200).json(cast.cast as Cast)
}

const postSchema = Joi.object({
  signerUuid: Joi.string().required(),
  text: Joi.string().required(),
  parent: Joi.string().optional(),
  embeds: Joi.array().items(Joi.object({
    url: Joi.string().required()
  })).optional()
});

async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { error, value } = postSchema.validate(req.body)
  if (error) return res.status(400).json({ error: error.details[0].message })

  const result = await neynarClient.postCast(value.signerUuid, value.text, { parent: value.parent, embeds: value.embeds });

  return res.status(201).json(result)
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return GET(req, res)
    case 'POST':
      return POST(req, res)
    default:
      res.status(405).end()
      break
  }
}