import neynarClient from '@/lib/neynar'
import { NextApiResponse, NextApiRequest } from 'next'
import Joi from 'joi'

const schema = Joi.object({
  hash: Joi.string().required(),
});

export default async function(request: NextApiRequest, res: NextApiResponse) {
  const { error, value } = schema.validate(request.query);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const thread = await neynarClient.getCastsInThread(value.hash);
    return res.status(200).json(thread);
  } catch (error) {
    console.error('Error in GET function:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}