import { PointProvider, usePointContext } from "../contexts/PointContext"
import { useEffect, useState } from "react"
import PointWrapper from "./PointWrapper"
import TripleDotMenu from "./TripleDotMenu"
import Image from "next/image"

export default function Comment({ level }: { level: number }) {
    const { point, comments, refreshChildren, children } = usePointContext()
    const [isRefreshed, setIsRefreshed] = useState(false)

    useEffect(() => {
        refreshChildren()
    }, [])

    return (
        <div className="flex flex-col gap-2 relative border-b">

            <div className="rounded-lg flex flex-row  gap-4 px-2 sm:px-3 md:px-5 py-2 sm:py-3 md:py-3">
                <div className="h-8 w-8 relative">
                    <p className="text-transparent">{point.author?.pfp_url}</p>
                    <Image src={point.author?.pfp_url || "/default-avatar.svg"} fill alt={point.author?.username + " pfp"} className="rounded-full object-fill" />
                </div>
                <div className="flex flex-col flex-1">
                    <p className="">{point.author?.display_name}</p>
                    <div className="w-full text-ellipsis ">{point.title}</div>
                </div>
                <TripleDotMenu />
            </div>
            {/* <div className="absolute h-full w-[1px] bg-black ml-9 -z-20"></div> */}
            <div className="flex flex-col gap-2">
                {comments?.map((el, i) =>
                    <PointWrapper key={i} level={level} point={el} setHistoricalItems={() => { }} getParentAncestry={() => ""} refreshParentThread={() => Promise.resolve()} />
                )}
            </div>

        </div>
    )
}