import Login from "@/components/Login";
import { Signer } from "neynar-next/server";
import NotificationButton from "@/components/notifications/NotificationButton";

export default function Header({ setFarcasterSigner }: { setFarcasterSigner: React.Dispatch<React.SetStateAction<Signer | null>> }) {
  return (
    <header className="flex justify-end px-6 py-2 gap-6 bg-slate-50 border fixed top-0 w-full z-40">
      {/* {farcasterSigner && <NotificationButton/>} */}
      <Login setFarcasterSigner={setFarcasterSigner} />
    </header>
  )
}