import { GoHeartFill } from "react-icons/go";

export default function LikeIcon({color}: {color:string}) {
    
    return (
        <div className="rounded-full p-3 h-fit" style={{ backgroundColor: color + "20" }}>
           <GoHeartFill size={20} color={color+"40"}/>
        </div>
    )
}