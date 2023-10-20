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
})

async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { error, value } = postSchema.validate(req.query)
  if (error) return res.status(400).json({ error: error.details[0].message })

  await neynarClient.postCast(value.signerUuid, value.text)

  return res.status(201).json(null)
}

const deleteSchema = Joi.object({
  signerUuid: Joi.string().required(),
  castHash: Joi.string().required(),
})

async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const { error, value } = deleteSchema.validate(req.query)
  if (error) return res.status(400).json({ error: error.details[0].message })

  await neynarClient.deleteCast(value.signerUuid, `0x${value.castHash}`)

  return res.status(204).end()
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return GET(req, res)
    case 'POST':
      return POST(req, res)
    case 'DELETE':
      return DELETE(req, res)
    default:
      res.status(405).end()
      break
  }
}