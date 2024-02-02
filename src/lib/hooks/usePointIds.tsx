import { useQueryState } from "nuqs";

export const usePointIds = () =>
	useQueryState("ids", {
		shallow: true,
		history: "replace",
	});
