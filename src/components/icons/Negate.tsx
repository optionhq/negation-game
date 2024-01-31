import { ImCross } from "react-icons/im";

export default function NegateIcon({ color }: { color: string }) {
	return (
		<div
			className="rounded-full p-3 h-fit"
			style={{ backgroundColor: `${color}20` }}
		>
			<ImCross size={20} color={`${color}40`} />
		</div>
	);
}
