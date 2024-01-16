import axios from "axios";
import { Signer } from "neynar-next/server";
import { DEFAULT_CHANNELID } from "@/constants";

export default async function getNotifications(signer: Signer | null, amount?: number, cursor?: string) {
    if (!signer) return

    try {
        // localStorage.removeItem("old_most_recent_notification")
        // localStorage.removeItem("most_recent_notification")
        //@ts-ignore
        const url = `/api/notifications/${"https%3A%2F%2Fnegationgame.com"}?user=${signer?.fid}&limit=${amount ?? 25}${cursor ? `&cursor=${cursor}` : ""}`
        const feed = await axios.get(url)
        let nextCursor = feed.data.next.cursor
        // let filteredNotifications = feed.data.notifications.filter((notification: any, i: number) =>
        //     (notification.type !== "follows" && (notification.cast?.root_parent_url === "https://negationgame.com" || notification.cast?.parent_url === "https://negationgame.com"))
        // );
        return [feed.data.notifications, nextCursor]
        // return [filteredNotifications, nextCursor]

    } catch (e) {
        console.error(e)
    }
}

export async function getNegationGameNotifications(signer: Signer | null, amount?: number, cursor?: string){
    let notifications:any[] = []
    // while (notifications.length < (amount ?? 25)){
        let result = await getNotifications(signer, amount, cursor)
        if(!result) return
        let [notifs, nextCursor] = result
        notifications.concat(notifs)
        console.log(notifs, notifications)
        cursor = nextCursor
    // }
    return [notifications, cursor]

}