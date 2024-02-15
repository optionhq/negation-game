import axios from "axios";
import { Signer } from "neynar-next/server";
import { ROOT_CAST_ID } from "../config";

export default async function publish(
	text: string,
	signer: Signer,
	parentId?: string | null,
	embeds?: { url: string }[],
) {
	try {
		const castResponse = await axios.post("/api/cast", {
			text: text,
			parent: parentId ? parentId : ROOT_CAST_ID,
			signerUuid: signer.signer_uuid,
			embeds: embeds,
		});
		return castResponse;
	} catch (error) {
		console.error(error);
	}
}
