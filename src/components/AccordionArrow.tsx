import { usePointContext } from "../contexts/PointContext";
import { Arrow } from ".";

export default function AccordionArrow() {
	const { detailsOpened, unfurlDropdown, point } = usePointContext();

	const handleArrowClick = async (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		await unfurlDropdown();
	};

	return (
		<div className="flex flex-col md:gap-2">
			<div
				className={`py-1 rounded-md ${
					point.replyCount! > 0 ||
					(point.endPoint && point.endPoint?.replyCount! > 0)
						? "opacity-100"
						: "opacity-0 pointer-events-none"
				}`}
				onClick={handleArrowClick}
			>
				<div className={`p-1 rounded-lg hover:bg-gray-200`}>
					<div
						className={`transition transform ${
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
