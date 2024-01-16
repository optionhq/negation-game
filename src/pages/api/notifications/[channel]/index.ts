import { NextResponse } from 'next/server'
import { NextApiRequest, NextApiResponse } from 'next'
import neynarClient from '../../../../lib/neynar'
import Joi from 'joi';
import { DEFAULT_CHANNELID } from '@/constants';
const schema = Joi.object({
    user: Joi.string().required(),
    channel: Joi.string().required(),
    cursor: Joi.string().optional(),
    limit: Joi.string().required()
});

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
    const { error, value } = schema.validate(req.query);
    if (!process.env.NEYNAR_API_KEY) return
    const options = {
        method: 'GET',
        headers: { accept: 'application/json', api_key: process.env.NEYNAR_API_KEY }
    };
    value.user = 2588
    // https://api.neynar.com/v2/farcaster/notifications/parent_url?fid=20586&parent_urls=negationgame&limit=15
    // https://api.neynar.com/v2/farcaster/notifications/parent_url?fid=2588&parent_urls=https%3A%2F%2Fnegationgame.com&limit=25
    // https://api.neynar.com/v2/farcaster/notifications/parent_url?fid=20586&parent_urls=https://negationgame.com&limit=15
    const url = `https://api.neynar.com/v2/farcaster/notifications/parent_url?fid=${value.user}&parent_urls=${value.channel}&limit=${value.limit}${value.cursor ? `&cursor=${value.cursor}` : ""}`
    console.log(url)
    
    const resp = fetch(url, options)
        // const resp = fetch(`https://api.neynar.com/v2/farcaster/notifications/channel?fid=${value.user}&channel_ids=${value.channel}&limit=${value.limit}`, options)
        .then(response => response.json())
        .then((resp) => {
            if (resp.notifications == null)
                res.status(400).json({ error: resp });
            else
                res.status(200).json(resp);
        })
        .catch(err => {
            console.error(err)
            res.status(500).json({ error: 'An error occurred while fetching notifications.' });
        });
}