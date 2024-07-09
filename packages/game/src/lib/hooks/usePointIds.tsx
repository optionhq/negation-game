import { useQueryState } from "nuqs";
import { useMemo } from "react";

export const usePointIds = () => {
	const [ids, setIds] = useQueryState("ids", {
		shallow: true,
		history: "replace",
	});
	const rootPointId = useMemo(() => {
		const allPoints = ids?.split(",");
		return allPoints ? allPoints[allPoints?.length - 1] : undefined;
	}, [ids]);
	const focusedElementId = useMemo(() => ids?.split(",")[0], [ids]);
	const pointIds = useMemo(() => ids?.split(",") ?? [], [ids]);
	const historicalPointIds = useMemo(
		() => (pointIds.length > 1 ? pointIds.slice(1) : undefined),
		[pointIds],
	);

	return {
		ids,
		setIds,
		rootPointId,
		focusedElementId,
		historicalPointIds,
		pointIds,
	};
};
