import { NextApiRequest, NextApiResponse } from "next";
import neynarClient from "../../../../lib/neynar";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const fid = parseInt(req.query.fid as string);
	if (!fid) {
		res.status(400).json({ error: "fid is invalid" });
		return;
	}

	const user = await neynarClient.getUserByFid(fid);
	res.status(200).json(user);
}
