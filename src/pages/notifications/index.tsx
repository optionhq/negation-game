// import Notification from "../../components/notifications/Notification"
import axios from "axios";
import { useEffect, useRef, useState } from "react"
import { DEFAULT_CHANNELID } from "@/constants";
import { useFarcasterSigner } from "@/contexts/UserContext";
import { useSigner } from "neynar-next";
import { User } from "neynar-next/server";
import Image from "next/image";
import isNegation, { validNegation } from "@/lib/isNegation";
import { castToNegation, getMaybeNegation } from "@/lib/useCasts";
import getNotifications, { getNegationGameNotifications } from "@/lib/notifications/getNotifications";
import { Node } from "@/types/Points";
import AccuracyIcon from "@/components/icons/Accuracy";
import ImportanceIcon from "@/components/icons/Importance";
import CommentIcon from "@/components/icons/Comment";
import LikeIcon from "@/components/icons/Like";
import NegateIcon from "@/components/icons/Negate";
import { useRouter } from "next/navigation";

function FollowNotification({ notification }: { notification: any }) {
    const followersLen = notification.follows.length
    return (
        <p>
            <span className="font-bold">{notification.follows?.[0].user.username}</span> {followersLen > 1 && "and"} {followersLen > 1 && <span className="font-bold">{notification.follows.length - 1} others</span>} followed you
        </p>
    )
}

function ReplyNotification({ notification }: { notification: any }) {
    const [node, setNode] = useState<Node>();
    const [isLinkingPoint, setIsLinkingPoint] = useState<boolean>(false)
    const [parent, setParent] = useState<Node>();
    async function getCast() {
        try {
            const _node = await getMaybeNegation(notification.cast);
            setIsLinkingPoint(validNegation(_node.title));
            setNode(_node);

            axios.get(`/api/cast?type=hash&identifier=${"0x" + _node.parentId}`)
                .then(async response => {
                    const _parent = await getMaybeNegation(response.data)
                    setParent(_parent)
                })
                .catch(error => console.error('Error fetching conversation:', error));
        } catch (error) { console.error('Error fetching cast:', error) }
    }

    useEffect(() => {
        getCast()
    }, [])

    return (
        <div className="flex flex-row gap-3">
            {node?.type == "root" ? <CommentIcon /> :
                <NegateIcon color={parent?.type == "negation" ? "#6b21a8" : "#1e40af"} />
            }
            {/* {parent?.type == "root" && node?.type == "negation"  && } */}

            <div className="flex flex-col gap-3">
                <div className="flex flex-row gap-1">
                    <a className=" font-semibold hover:underline" href={"https://warpcast.com/" + node?.author?.username} target="_blank" >{node?.author?.username}</a>
                    {node?.type == "negation" ? <p> negated {parent?.type == "negation" ? "the importance" : "the accuracy"} of your point.</p> : <p>replied to your point.</p>}
                </div>
                <div className="table table-fixed w-full overflow-hidden">
                    <div className="flex flex-col gap-2 ">
                        <p className="text-sm text-black/50">{parent?.type == "negation" ? parent.endPoint!.title : parent?.title}</p>
                        <p className="">{node?.type == "negation" ? node?.endPoint?.title : node?.title}</p>
                    </div>

                </div>
            </div>
        </div>
    )
}

function MentionNotification({ notification }: { notification: any }) {
    return (
        <div>
            <div className="flex flex-row items-center gap-2">
                <Image src={notification.cast.author.pfp_url} alt="cast author" width={30} height={30} className="rounded-full" />
                <p className="font-bold">{notification.cast.author.display_name}</p>
            </div>
            <div className="table table-fixed w-full overflow-hidden">

                <p>{notification.cast.text}</p>
            </div>
        </div>
    )
}

function LikersTooltip({ reactions }: { reactions: any }) {
    return (
        <div className="absolute flex flex-col top-0 bg-slate-50 border rounded-md p-2 w-44" style={{ transform: "translateY(-100%)" }}>
            {reactions.slice(1).map((reaction: any) => (
                <div key={reaction.user.username}>
                    <a href={"https://warpcast.com/" + reaction.user.username} className="font-semibold hover:underline" target="_blank">{reaction.user.username}</a>
                </div>
            ))}
        </div>
    )
}

function LikeNotification({ notification }: { notification: any }) {
    const [node, setNode] = useState<Node>();
    const [isLinkingPoint, setIsLinkingPoint] = useState<boolean>(false)
    const [showTooltip, setShowTooltip] = useState(false)
    const likersLen = notification.reactions.length

    const thirdPerson = likersLen > 1 ? '' : 's'

    async function getCast() {
        try {
            const _node = await getMaybeNegation(notification.cast);
            setIsLinkingPoint(validNegation(_node.title));
            setNode(_node);
        } catch (error) { console.error('Error fetching cast:', error) }
    }

    useEffect(() => {
        getCast()
    }, [])

    return (
        <div className="flex flex-row gap-3 ">
            <LikeIcon color={node?.type == "negation" ? "#6b21a8" : "#1e40af"} />
            {/* {node?.type == "negation" ? <ImportanceIcon /> : <AccuracyIcon />} */}
            <div >
                <div className="flex flex-row gap-1 flex-wrap">
                    <a className=" font-semibold hover:underline" href={"https://warpcast.com/" + notification.reactions[0].user.username} target="_blank" >{notification.reactions[0].user.username}</a>
                    {likersLen > 1 &&
                        <div className="flex flex-row gap-1 ">
                            <p>and</p>
                            <div className="relative w-fit" onPointerEnter={() => setShowTooltip(true)} onPointerLeave={() => setShowTooltip(false)}>
                                <p className="font-semibold hover:underline w-fit">{likersLen - 1} other{likersLen > 2 ? 's' : ''}</p>
                                {showTooltip && <div><LikersTooltip reactions={notification.reactions} /></div>}
                            </div>
                        </div>}
                    <p>think{thirdPerson} your point is {isLinkingPoint ? 'important' : 'accurate'}.</p>
                </div>
                <div className="table table-fixed w-full overflow-hidden">
                    <p className=" text-black/50 text-sm ">{isLinkingPoint ? node?.endPoint!.title : node?.title}</p>
                </div>
            </div>
        </div>
    )
}

function Notification({ notification, previousNotif }: { notification: any, previousNotif: string }) {
    const [isNew, setIsNew] = useState(new Date(notification.most_recent_timestamp).getTime() > new Date(previousNotif).getTime() || previousNotif === "")
    const [node, setNode] = useState<Node>();
    const router = useRouter()
    async function getCast() {
        try {
            if (notification.cast) {
                const _node = await getMaybeNegation(notification.cast);
                setNode(_node);
            }
        } catch (error) { console.error('Error fetching cast:', error) }
    }

    useEffect(() => {
        getCast()
    }, [])


    if (notification.type == "recasts") return <></>
    const replyHistoric = notification.type == "reply" ? `%2C0x${node?.parentId}` : ""
    if (notification.type !== "follows" && notification.type !== "mention" && notification.type !== "likes" && notification.type !== "reply") console.log(notification)
    return (
        <div className={`border p-4 w-[500px] rounded-md hover:bg-slate-50 cursor-pointer ${isNew ? "bg-indigo-600/10" : ""}`} onClick={() => node && router.push(`/?id=${node.id}${replyHistoric}`)}>
            {notification.type == "follows" && <FollowNotification notification={notification} />}
            {notification.type == "mention" && <MentionNotification notification={notification} />}
            {notification.type == "likes" && <LikeNotification notification={notification} />}
            {notification.type == "reply" && <ReplyNotification notification={notification} />}
        </div>
    )
}

const NB_NOTIF = 320
export default function Notifications() {
    const [notifications, setNotifications] = useState<any[]>([])
    const { signer } = useSigner()
    const [previousNotif, setPreviousNotif] = useState<string>("")
    const cursor = useRef(undefined)
    const loader = useRef(null)

    async function loadMoreNotifications() {
        if (cursor.current == null) return
        const result: any[] | undefined = await getNotifications(signer, NB_NOTIF, cursor.current)
        if (!result) return
        const [_notifications, nextCursor] = result
        cursor.current = nextCursor
        setNotifications((prev) => prev.concat(_notifications));
    }

    async function fetchNotifications() {
        let old_most_recent = localStorage.getItem("most_recent_notification") || ""
        setPreviousNotif(old_most_recent)
        localStorage.setItem("old_most_recent_notification", old_most_recent)
        const result: any[] | undefined = await getNotifications(signer, NB_NOTIF)
        if (!result || !result[0].length) return
        
        const [_notifications, nextCursor] = result
        localStorage.setItem("most_recent_notification", _notifications[0].most_recent_timestamp)
        cursor.current = nextCursor
        setNotifications(_notifications)
    }

    const handleObserver: IntersectionObserverCallback = (entities) => {
        const target = entities[0];
        if (target.isIntersecting) loadMoreNotifications()
    }

    useEffect(() => {
        setNotifications([])
        if (signer)
            fetchNotifications()
        var options = { root: null, rootMargin: "20px", threshold: 1.0 }
        let _observer = new IntersectionObserver(handleObserver, options);
        if (loader.current)
            _observer.observe(loader.current)
    }, [signer])

    console.log(notifications)
    return (
        <div className="flex-1 py-12 flex justify-center">
            <div className="flex flex-col items-center gap-2">
                {notifications.map((notif, i) => <Notification notification={notif} key={i} previousNotif={previousNotif} />)}
                <div className="loader" ref={loader}></div>
            </div>
        </div>
    )
}