import { useSigner } from "@/contexts/SignerContext";
import useSWR from "swr";
import getNbNewNotifications from "./getNbNewNotifications";

export const useAmountNewNotifications = () => {
	const { signer } = useSigner();
	return useSWR("notifications", async () => getNbNewNotifications(signer), {
		refreshInterval: 30_000,
	});
};
