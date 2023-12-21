import { usePointContext } from "../../contexts/PointContext"

export default function LoadingNegations() {
    const { childrenLoading } = usePointContext()

    return (
        <>
            {childrenLoading && <div className="border w-full p-4 flex items-center justify-center">Loading...</div>}
        </>
    )
}