export default function ReactButtonWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="hover: flex flex-row items-center justify-center gap-2 rounded-md border-[1px] border-slate-300 px-2 py-1  bg-blend-color-dodge transition-all hover:border-slate-400 hover:bg-slate-200">
			{children}
		</div>
	);
}
