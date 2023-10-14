import neynarClient from '@/lib/neynar'
import { NextResponse } from 'next/server'
import { NextApiRequest } from 'next'
import Joi from 'joi'

const getSchema = Joi.object({
  type: Joi.string().valid('url', 'hash').required(),
  identifier: Joi.string().required(),
})

export async function GET(request: NextApiRequest) {
  const { error, value } = getSchema.validate(request.query)
  if (error) return new Response(error.details[0].message, { status: 400 })

  const cast = await neynarClient.getCast(value.type, value.identifier)
  return NextResponse.json(cast)
}

const postSchema = Joi.object({
  signerUuid: Joi.string().required(),
  text: Joi.string().required(),
})

export async function POST(request: NextApiRequest) {
  const { error, value } = postSchema.validate(request.query)
  if (error) return new Response(error.details[0].message, { status: 400 })

  await neynarClient.postCast(value.signerUuid, value.text)

  return new Response(null, { status: 201 })
}

const deleteSchema = Joi.object({
  signerUuid: Joi.string().required(),
  castHash: Joi.string().required(),
})

export async function DELETE(request: NextApiRequest) {
  const { error, value } = deleteSchema.validate(request.query)
  if (error) return new Response(error.details[0].message, { status: 400 })

  await neynarClient.deleteCast(value.signerUuid, `0x${value.castHash}`)

  return new Response(null, { status: 204 })
}