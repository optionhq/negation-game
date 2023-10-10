import { MdNotifications } from "react-icons/md";
import Tooltip from "./Tooltip";

export default function Notifications({ notifNb = 100 }: { notifNb?: number }) {
  return (
    <Tooltip orientation="top" text="Notifications">
      <button className="relative flex items-center h-full justify-center border rounded-md bg-slate-100 hover:bg-slate-200 px-2">
        {notifNb > 0 && <MdNotifications size={24} />}
        <div className="absolute left-full -translate-x-1/2 -top-1 bg-red-500 rounded-full py-1 px-2 text-xs text-white">{notifNb < 100 ? notifNb : "99+"}</div>
      </button>
    </Tooltip>
  );
}
