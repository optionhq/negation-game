import { Notification } from "neynar-next/server"

export default function Notification({ notification }: { notification: Notification }) {
  return (
    <div className="w-full px-3 py-2 text-black bg-slate-50 border">
      <p>{notification.author.username} said</p>
      <p>{notification.text} to</p>
      <p>{notification.parentUrl}</p>
    </div>
  );
}
