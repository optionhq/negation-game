import neynarClient from '@/lib/neynar'
import { NextApiResponse } from 'next'
import { NextApiRequest } from 'next'
import Joi from 'joi'

const deleteSchema = Joi.object({
  signerUuid: Joi.string().required(),
}).unknown(true)

async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const { hash } = req.query;

  const { error, value } = deleteSchema.validate(req.body)
  if (error) return res.status(400).json({ error: error.details[0].message })

  await neynarClient.deleteCast(value.signerUuid, hash as `0x${string}`)
  res.status(204).end()
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'DELETE':
      await DELETE(req, res)
      break
    default:
      res.status(405).end()
      break
  }
}