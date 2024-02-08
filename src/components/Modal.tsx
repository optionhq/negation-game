import { ReactNode } from "react";

export default function Modal({
	setSelected,
	children,
}: {
	setSelected: any;
	children: ReactNode;
}) {
	return (
		<div
			className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-black/30"
			style={{ zIndex: "300" }}
			onClick={() => setSelected(false)}
		>
			<div
				className="relative flex w-[800px] flex-col items-end gap-2 rounded-md bg-white p-8"
				onClick={(e) => e.stopPropagation()}
			>
				{children}
			</div>
		</div>
	);
}
