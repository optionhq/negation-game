import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";
import Tooltip from "../../Tooltip";
import { usePointContext } from "../../../contexts/PointContext";


export default function NegateLikeButtons({ type }: { type: "relevance" | "veracity" }) {
    const { handleLike, liked, handleNegate } = usePointContext()

    
    return (
        <div className=" hidden group-hover/points:flex flex-row gap-1">
            <Tooltip text={liked?.[type] ? (type == "veracity" ? "Unmark important" : "Unmark correct") : (type == "veracity" ? "Important" : "Correct")} orientation="bottom">
                <button className={liked?.[type] ? "text-green-500 text-xl" : "hover:text-green-500 text-xl"} onMouseDown={(e) => handleLike(e, type)}>
                    <HiOutlineCheckCircle size={24} />
                </button>
            </Tooltip>
            <Tooltip text={type == "veracity" ? "Alternative" : "Counterpoint"} orientation="bottom">
                <button
                    className="hover:text-purple-600 text-xl"
                    onMouseDown={(e) => handleNegate(e, type)}>
                    <HiOutlineXCircle size={24} />
                </button>
            </Tooltip>
        </div>

    );
}


