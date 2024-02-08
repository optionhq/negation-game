import { usePointContext } from "../contexts/PointContext";
import { Arrow } from ".";

export default function AccordionArrow() {
	const { detailsOpened, unfurlDropdown, point } = usePointContext();

	const handleArrowClick = async (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		unfurlDropdown();
	};

	return (
		<div className="flex flex-col md:gap-2">
			<div
				className={`rounded-md py-1 ${
					(
						(point.replyCount && point.replyCount > 0) ||
						(point.endPoint?.replyCount && point.endPoint.replyCount > 0)
					) ?
						"opacity-100"
					:	"pointer-events-none opacity-0"
				}`}
				onClick={handleArrowClick}
			>
				<div className="rounded-lg p-1 hover:bg-gray-200">
					<div
						className={`transform transition ${
							detailsOpened ? "rotate-90" : ""
						}`}
					>
						<Arrow />
					</div>
				</div>
			</div>
		</div>
	);
}
