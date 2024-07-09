import { usePointContext } from "../../contexts/PointContext";

export default function LoadingNegations() {
	const { childrenLoading } = usePointContext();

	return (
		<>
			{childrenLoading && (
				<div className="flex w-full items-center justify-center border p-4">
					Loading...
				</div>
			)}
		</>
	);
}
