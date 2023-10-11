import { useState } from "react";
import Notification from "./Notification";

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState(Array(10).fill(""));

  return (
    <div className="fixed flex flex-col gap-2 w-[264px] h-96 p-2 right-2 translate-y-2 top-12 bg-slate-50 shadow-md rounded-md overflow-y-scroll">
      {notifications.map((el, i) => (
        <Notification />
      ))}
    </div>
  );
}
