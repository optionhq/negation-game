import { useMemo } from "react"
import DesktopScore from "./desktop/DesktopScore"
import MobileScore from "./mobile/MobileScore"
import { getDeviceType } from "../../lib/getDeviceType"
import { usePointContext } from "../../contexts/PointContext"

export default function Score() {
    const { likes } = usePointContext()
    const _Score = useMemo(() => {
        const deviceType = getDeviceType()
        return deviceType == "mobile" ? MobileScore : DesktopScore
    }, [])

    if(!likes) return
    return (
        <div className="flex flex-row gap-2 text-gray-500">
            <_Score type="veracity" />
            {likes["relevance"] !== undefined && <_Score type="relevance" />}
        </div>
    )
}


