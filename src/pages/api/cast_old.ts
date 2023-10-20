// pages/api/cast.ts
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

/**
* Handler function for the /api/cast route.
* 
* GET request:
* Retrieves information about a cast by passing in a web URL or cast hash.
* Query parameters:
* - type: Either "url" or "hash".
* - identifier: 'https://warpcast.com/username/0xhash' or '0xhash' depending on the type.
* 
* POST request:
* Posts a cast or cast reply. Works with mentions and embeds.
* Body parameters:
* - signer_uuid: UUID of the signer. The signer_uuid must be approved in order to post a cast.
* - text: Text of the cast.
* - parent: (Optional) Hash of a cast or a URL.
* 
* @param req The Next.js API request object.
* @param res The Next.js API response object.
*/
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const response = await axios.post(
        'https://api.neynar.com/v2/farcaster/cast',
        req.body,
        {
          headers: {
            api_key: process.env.NEYNAR_API_KEY,
          },
        },
      );
      res.status(200).json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'GET') {
    try {
      const response = await axios.get('https://api.neynar.com/v2/farcaster/cast', {
        params: req.query,
        headers: {
          accept: 'application/json',
          api_key: process.env.NEYNAR_API_KEY
        }
      });
      res.status(200).json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}