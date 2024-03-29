import Joi from "joi";
import { NextApiRequest, NextApiResponse } from "next";
import neynarClient from "../../../../../lib/neynar";

const schema = Joi.object({
	signerUuid: Joi.string().required(),
});

export async function POST(request: NextApiRequest, response: NextApiResponse) {
	const { error, value } = schema.validate(request.body);
	if (error) return response.status(400).send(error.details[0].message);

	const hash = request.query.hash as string;
	await neynarClient.likeCast(value.signerUuid, hash as `0x${string}`);

	return response.status(204).end();
}

export async function DELETE(
	request: NextApiRequest,
	response: NextApiResponse,
) {
	const { error, value } = schema.validate(request.body);
	if (error) return response.status(400).send(error.details[0].message);

	const hash = request.query.hash as string;
	await neynarClient.unlikeCast(value.signerUuid, hash as `0x${string}`);

	return response.status(204).end();
}

export default async function handler(
	request: NextApiRequest,
	response: NextApiResponse,
) {
	switch (request.method) {
		case "POST":
			await POST(request, response);
			break;
		case "DELETE":
			await DELETE(request, response);
			break;
		default:
			response.status(405).end(); // Method Not Allowed
			break;
	}
}
