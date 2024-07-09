import neynarClient from "../../../../../lib/neynar";
import { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";

const schema = Joi.object({
	hash: Joi.string().required(),
});

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
	const { error, value } = schema.validate(req.query);
	if (error) return new Response(error.details[0].message, { status: 400 });

	const thread = await neynarClient.getCastsInThread(value.hash);
	return res.status(200).json(thread);
}
