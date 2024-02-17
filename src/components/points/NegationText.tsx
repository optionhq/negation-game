import { usePointContext } from "../../contexts/PointContext";
import isNegation from "../../lib/isNegation";
import RecastedComponent from "./RecastedPoint";
import { extractLink } from "../../lib/extractLink";
import Text from "../Text";

export default function NegationText() {
	const { point } = usePointContext();
	const { link } = extractLink(point.title);

	return (
		<>
			{point.endPoint && isNegation(point) && (
				<Text text={point.endPoint.title} />
			)}
			{!point.endPoint && (
				<div className=" table w-full table-fixed">
					<Text text={point.title} />
					{link && <RecastedComponent url={link} />}
				</div>
			)}
		</>
	);
}
