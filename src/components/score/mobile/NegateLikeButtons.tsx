import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";
import { usePointContext } from "../../../contexts/PointContext";


export default function NegateLikeButtons({
    type,
}: {
    type: "importance" | "veracity";
}) {
    const { handleLike, liked, handleNegate } = usePointContext()

    return (
        <div className="flex flex-row gap-2">
            <button className={liked?.[type] ? "text-green-500 text-xl" : "text-xl"} onMouseDown={(e) => handleLike(e, type)}>
                <HiOutlineCheckCircle size={30} />
            </button>
            <button
                className="hover:text-purple-600 text-xl"
                onMouseDown={(e) => handleNegate(e, type)} >
                <HiOutlineXCircle size={30} />
            </button>
        </div>

    );
}


