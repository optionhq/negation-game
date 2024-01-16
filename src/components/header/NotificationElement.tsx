import { useEffect, useState } from "react";
import HeaderElement from "./HeaderElement";
import getNbNewNotifications from "@/lib/notifications/getNbNewNotifications";
import { MdNotifications } from "react-icons/md";
import { usePathname } from "next/navigation";
import { useSigner } from "neynar-next";

export default function NotificationElement() {

    const [nbNotifs, setNbNotifs] = useState(0)
    const pathName = usePathname()
    const { signer } = useSigner()

    async function fetchNotifications() {
        setNbNotifs(await getNbNewNotifications(signer))
    }

    useEffect(() => {
        fetchNotifications()
    }, [signer])

    return (
        <div onClick={() => setNbNotifs(0)}>
            <HeaderElement Icon={MdNotifications} name="Notifications" path="/notifications" currentPath={pathName == "/notifications"} nbNotifs={nbNotifs} />
        </div>)
}