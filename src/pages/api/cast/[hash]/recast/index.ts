import { NextApiResponse, NextApiRequest } from "next";
import neynarClient from "../../../../../lib/neynar";
import Joi from "joi";

const schema = Joi.object({
	signerUuid: Joi.string().required(),
});

export async function POST(request: NextApiRequest, response: NextApiResponse) {
	const { error, value } = schema.validate(request.body);
	if (error) return response.status(400).send(error.details[0].message);

	const hash = request.query.hash as string;
	// Call the appropriate function from neynarClient
	return response.status(201).json({});
}

export async function DELETE(
	request: NextApiRequest,
	response: NextApiResponse,
) {
	const { error, value } = schema.validate(request.body);
	if (error) return response.status(400).send(error.details[0].message);

	const hash = request.query.hash as string;
	// Call the appropriate function from neynarClient
	return response.status(204).json({});
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
