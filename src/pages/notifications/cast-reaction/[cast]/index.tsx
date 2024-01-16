import { useSearchParams } from "next/navigation"

export default function CastReaction(){
    const params = useSearchParams()
    const castId = params.get('cast')
    return(
        <div>
            {castId}
        </div>
    )
}