import { usePointContext } from "../../contexts/PointContext";
import isNegation from "../../lib/isNegation";
import RecastedComponent from "./RecastedPoint";
import { extractLink } from "../../lib/extractLink";

export default function NegationText() {
	const { point } = usePointContext();
	const { link } = extractLink(point.title);

	return (
		<>
			<p className="w-full text-ellipsis">
				{point.endPoint && isNegation(point) && point.endPoint.title}
			</p>
			{!point.endPoint && (
				<div className=" table w-full table-fixed overflow-hidden text-ellipsis">
					<p className=" table-cell text-ellipsis">{point.title}</p>
					{link && <RecastedComponent url={link} />}
				</div>
			)}
		</>
	);
}
