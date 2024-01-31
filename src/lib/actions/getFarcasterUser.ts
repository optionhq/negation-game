"use server";

import { neynarApi } from "../clients/neynarApi";

export const getFarcasterUser = async (fid?: number) =>
	fid
		? await neynarApi
				.lookupUserByFid(fid)
				.then((r) => r.result.user)
				.catch(() => null)
		: null;
