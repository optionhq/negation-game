// pages/api/signer.ts
import axios from 'axios';
import { mnemonicToAccount } from 'viem/accounts';
import { NextApiRequest, NextApiResponse } from 'next';

const FARCASTER_DEVELOPER_FID = process.env.FARCASTER_DEVELOPER_FID;
const FARCASTER_DEVELOPER_MNEMONIC = process.env.FARCASTER_DEVELOPER_MNEMONIC;

if (!FARCASTER_DEVELOPER_MNEMONIC) {
  throw new Error('FARCASTER_DEVELOPER_MNEMONIC is not defined');
}
if (!FARCASTER_DEVELOPER_FID) {
  throw new Error('FARCASTER_DEVELOPER_FID is not defined');
}



// Function to generate signature
const generate_signature = async function (public_key: string) {
  const SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN = {
    name: 'Farcaster SignedKeyRequestValidator',
    version: '1',
    chainId: 10,
    verifyingContract: '0x00000000fc700472606ed4fa22623acf62c60553' as `0x${string}`,
  };

  const SIGNED_KEY_REQUEST_TYPE = [
    { name: 'requestFid', type: 'uint256' },
    { name: 'key', type: 'bytes' },
    { name: 'deadline', type: 'uint256' },
  ];

  const account = mnemonicToAccount(FARCASTER_DEVELOPER_MNEMONIC);
  const deadline = Math.floor(Date.now() / 1000) + 86400;
  const signature = await account.signTypedData({
    domain: SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN,
    types: {
      SignedKeyRequest: SIGNED_KEY_REQUEST_TYPE,
    },
    primaryType: 'SignedKeyRequest',
    message: {
      requestFid: BigInt(FARCASTER_DEVELOPER_FID),
      key: public_key,
      deadline: BigInt(deadline),
    },
  });

  return { deadline, signature };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const createSignerResponse = await axios.post(
        'https://api.neynar.com/v2/farcaster/signer',
        {},
        {
          headers: {
            api_key: process.env.NEYNAR_API_KEY,
          },
        },
      );

      const { deadline, signature } = await generate_signature(
        createSignerResponse.data.public_key,
      );

      const signedKeyResponse = await axios.post(
        'https://api.neynar.com/v2/farcaster/signer/signed_key',
        {
          signer_uuid: createSignerResponse.data.signer_uuid,
          app_fid: FARCASTER_DEVELOPER_FID,
          deadline,
          signature,
        },
        {
          headers: {
            api_key: process.env.NEYNAR_API_KEY,
          },
        },
      );

      res.status(200).json(signedKeyResponse.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'GET') {
    try {
      const response = await axios.get(
        `https://api.neynar.com/v2/farcaster/signer?signer_uuid=${req.query.signer_uuid}`,
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
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}