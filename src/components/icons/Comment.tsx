import { BiComment, BiSolidComment } from "react-icons/bi";

export default function CommentIcon() {
	return (
		<div
			className="rounded-full p-3 h-fit"
			style={{ backgroundColor: "#EBEDEF" }}
		>
			<BiSolidComment size={20} color="#BBBBBB" />
		</div>
	);
}
