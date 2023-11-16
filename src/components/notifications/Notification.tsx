export default function Notification({ text="Notification", time }: { text?: string; time?: Date }) {
  return <div className="w-full px-3 py-2 text-black bg-slate-50 border">{text}</div>
}
