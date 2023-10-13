// pages/api/users/[fid].ts
import { NextApiRequest, NextApiResponse } from 'next'
import neynarClient from '@/lib/neynar'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log("[fid].ts triggered!")
  console.log("query", req.query)
  const fid = parseInt(req.query.fid as string)
  if (!fid) {
    res.status(400).json({ error: 'fid is invalid' })
    return
  }

  const user = await neynarClient.getUserByFid(fid)
  console.log(user)
  res.status(200).json(user)
}