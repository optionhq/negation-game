import { FiHeart, FiLink2, FiXCircle } from "react-icons/fi";
import ReactButtonWrapper from "./ReactButtonWrapper";

export default function Points({
  points,
  onNegate,
  type = "like",
}: {
  points: number;
  type: "relevance" | "like";
  onNegate: (e: React.MouseEvent<HTMLSpanElement | React.MouseEvent>) => void;
}) {
  function onLike(e: React.MouseEvent<HTMLSpanElement | React.MouseEvent>) {
    e.nativeEvent.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();
  }

  return (
    <div
      // className="group/points flex flex-row items-center justify-center gap-2 p-2 rounded-md w-20  hover:bg-slate-300 -my-2 h-12"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}>
      <ReactButtonWrapper>
        {type == "like" ? <FiHeart /> : <FiLink2 />}
        {points}
        <div className="flex-row gap-2 transition-all hidden group-hover/points:flex">
          <span className="hover:text-green-500 text-xl" onPointerDown={onLike}>
            <FiHeart />
          </span>
          <span className="hover:text-red-500 text-xl" onPointerDown={onNegate}>
            <FiXCircle />
          </span>
        </div>
      </ReactButtonWrapper>
    </div>
  );
}

function Linkage({ points = 0 }: { points?: number }) {
  return (
    <div className="w-fit border border-slate-500 rounded-md px-4 py-2 flex flex-col bg-white items-center justify-center ">
      <div className="flex flex-row gap-2 items-center justify-center">
        <FiLink2 />
        <p>{points}</p>
      </div>
    </div>
  );
}
