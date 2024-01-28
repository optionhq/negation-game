export default function ReactButtonWrapper({
	children,
}: { children: React.ReactNode }) {
	return (
		<div className="flex flex-row items-center justify-center gap-2 px-2 py-1 rounded-md transition-all border-[1px] border-slate-300  hover:border-slate-400 hover: bg-blend-color-dodge hover:bg-slate-200">
			{children}
		</div>
	);
}
