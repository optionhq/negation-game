"use server";

import { DEFAULT_CHANNELID } from "@/config";
import { Signer } from "@/types/Signer";
import { neynarApi } from "../clients/neynarApi";

export const makePoint = async (text: string, signer: Signer) =>
	await neynarApi.publishCast(signer.signer_uuid, text, {
		replyTo: DEFAULT_CHANNELID,
	});
