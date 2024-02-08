import { Hash } from "viem";

export type Embed = {
	url?: string;
	cast_id?: {
		fid: number;
		hash: Hash;
	};
};
