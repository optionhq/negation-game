import useSWR from "swr";
import { getFarcasterUser } from "../actions/getFarcasterUser";

export const useFarcasterUser = (fid?: number) => {
	const { data: user } = useSWR(["user", fid], ([_, fid]) =>
		getFarcasterUser(fid),
	);

	return user;
};
