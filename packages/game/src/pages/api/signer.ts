// frontend/src/pages/api/signer.ts

import { NextApiRequest, NextApiResponse } from "next";
import neynarClient from "../../lib/neynar";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	switch (req.method) {
		case "GET": {
			const signer = await neynarClient.getSigner(
				req.query.signer_uuid as string,
			);
			res.status(200).json(signer);
			break;
		}
		case "POST": {
			const signer = await neynarClient.createSigner();
			res.status(201).json(signer);
		}
		default:
			res.status(405).end();
	}
}
