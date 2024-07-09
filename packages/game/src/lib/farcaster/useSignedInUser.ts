import { useSigner } from "@/contexts/SignerContext";
import { useFarcasterUser } from "./useFarcasterUser";

export const useSignedInUser = () => {
	const fid = useSigner()?.signer?.fid;
	return useFarcasterUser(fid);
};
