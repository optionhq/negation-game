export default function ReactButtonWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="group/points flex flex-row items-center justify-center gap-2 p-1 rounded-md w-20 hover:bg-slate-300 -my-2 h-12">
        {children}
    </div>
  );
}
