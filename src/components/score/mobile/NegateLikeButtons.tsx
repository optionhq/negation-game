import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";
import { usePointContext } from "../../../contexts/PointContext";

export default function NegateLikeButtons({
	type,
}: {
	type: "relevance" | "conviction";
}) {
	const { handleLike, liked, handleNegate } = usePointContext();

	return (
		<div className="flex flex-row gap-2">
			<button
				className={liked?.[type] ? "text-xl text-green-500" : "text-xl"}
				onMouseDown={(e) => handleLike(e, type)}
			>
				<HiOutlineCheckCircle size={30} />
			</button>
			<button
				className="text-xl hover:text-purple-600"
				onMouseDown={(e) => handleNegate(e, type)}
			>
				<HiOutlineXCircle size={30} />
			</button>
		</div>
	);
}
