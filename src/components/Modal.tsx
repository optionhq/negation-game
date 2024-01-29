export default function Modal({
	setSelected,
	children,
}: { setSelected: any; children: React.ReactNode }) {
	return (
		<div
			className="fixed w-screen h-screen top-0 left-0 z-50 bg-black/30 flex items-center justify-center"
			style={{ zIndex: "300" }}
			onClick={() => setSelected(false)}
		>
			<div
				className="p-8 bg-white relative flex flex-col gap-2 items-end rounded-md w-[800px]"
				onClick={(e) => e.stopPropagation()}
			>
				{children}
			</div>
		</div>
	);
}
