"use server";

import { ROOT_CAST_ID } from "@/config";
import { Signer } from "@/types/Signer";
import { neynarApi } from "../clients/neynarApi";

export const makePoint = async (text: string, signer: Signer) =>
	await neynarApi.publishCast(signer.signer_uuid, text, {
		replyTo: ROOT_CAST_ID,
	});
