import { TbExclamationMark } from "react-icons/tb";

export default function ImportanceIcon() {
	return (
		<div
			className="rounded-full p-2 h-fit"
			style={{ backgroundColor: "rgba(107, 33, 168, 0.2)" }}
		>
			<TbExclamationMark size={24} />
		</div>
	);
}
