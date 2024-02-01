"use server";

import { NEGATION_SYMBOL } from "@/config";
import { neynarApi } from "../clients/neynarApi";
import { isNegationCast } from "../farcaster/isNegationCast";
import { isPointCast } from "../farcaster/isPointCast";

export const negate = async (
	negatingHash: string,
	negatedHash: string,
	signerUuid: string,
) => {
	const [negatingCast, negatedCast] = await Promise.all([
		(await neynarApi.lookUpCastByHashOrWarpcastUrl(negatingHash, "hash")).cast,
		(await neynarApi.lookUpCastByHashOrWarpcastUrl(negatedHash, "hash")).cast,
	]);

	console.log({ negatingCast, negatedCast });

	if (!isPointCast(negatingCast)) {
		console.error("Source is not a Point. You can only use Points to negate.");
		throw new Error(
			"Source is not a Point. You can only use Points to negate.",
		);
	}

	if (!isPointCast(negatedCast) && !isNegationCast(negatedCast)) {
		console.error(
			"Target is neither a Point or a Negation. You can only negate Points or Negations.",
		);
		throw new Error(
			"Target is neither a Point or a Negation. You can only negate Points or Negations.",
		);
	}

	const warpcastUrl = `https://warpcast.com/${negatingCast.author.username}/${negatingCast.hash}`;

	return await neynarApi.publishCast(
		signerUuid,
		`${NEGATION_SYMBOL}\n${warpcastUrl}`,
		{
			replyTo: negatedCast.hash,
			embeds: [
				{
					url: warpcastUrl,
				},
			],
		},
	);
};
