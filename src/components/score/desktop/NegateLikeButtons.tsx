import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";
import { usePointContext } from "../../../contexts/PointContext";
import Tooltip from "../../Tooltip";

export default function NegateLikeButtons({
	type,
}: {
	type: "relevance" | "conviction";
}) {
	const { handleLike, liked, handleNegate } = usePointContext();

	return (
		<div className=" hidden flex-row gap-1 group-hover/points:flex">
			<Tooltip
				text={
					liked?.[type] ?
						type == "conviction" ?
							"Unmark accurate"
						:	"Unmark important"
					: type == "conviction" ?
						"Accurate"
					:	"Important"
				}
				orientation="bottom"
			>
				<button
					className={
						liked?.[type] ?
							"text-xl text-green-500"
						:	"text-xl hover:text-green-500"
					}
					onMouseDown={(e) => handleLike(e, type)}
				>
					<HiOutlineCheckCircle size={24} />
				</button>
			</Tooltip>
			<Tooltip
				text={type == "conviction" ? "Counterpoint" : "Objection"}
				orientation="bottom"
			>
				<button
					className="text-xl hover:text-purple-600"
					onMouseDown={(e) => handleNegate(e, type)}
				>
					<HiOutlineXCircle size={24} />
				</button>
			</Tooltip>
		</div>
	);
}
