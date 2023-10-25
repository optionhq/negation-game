import { Notification as NotificationType } from "neynar-next/server";
import Notification from "./Notification";

type NotificationsPanelProps = {
  notifications: NotificationType[];
};

export default function NotificationsPanel({ notifications }: NotificationsPanelProps) {
  return (
    <div className="fixed flex flex-col gap-2 w-[264px] h-96 p-2 right-2 translate-y-2 top-12 bg-slate-50 shadow-md rounded-md overflow-y-scroll">
      {notifications.length === 0 ? <p>No notifications</p> : notifications.map((notification, i) => (
        <Notification key={i} notification={notification} />
      ))}
    </div>
  );
}