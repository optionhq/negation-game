import { FiCheck, FiHeart, FiLink2, FiXCircle } from "react-icons/fi";
import ReactButtonWrapper from "./ReactButtonWrapper";
import { AiOutlineCheckCircle, AiOutlineCiCircle } from "react-icons/ai";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";

function NegateLikeButtons({
  points,
  onNegate,
}: {
  points: number;
  onNegate: (e: React.MouseEvent<HTMLSpanElement | React.MouseEvent>) => void;
}) {
  function onLike(e: React.MouseEvent<HTMLSpanElement | React.MouseEvent>) {
    e.nativeEvent.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();

    // e.nativeEvent.stopPropagation();
    // console.log("onLike clicked");
    // console.log(e.isPropagationStopped());
  }

  return (
    <div className="group/points w-16 flex flex-col items-center">
      <p className="group-hover/points:hidden h-6">{points}</p>
      <div className="flex-row gap-1 transition-opacity hidden opacity-0 group-hover/points:flex group-hover/points:opacity-100 h-6">
        <span className="hover:text-green-500 text-xl" onPointerDown={onLike}>
          <HiOutlineCheckCircle size={24} />
        </span>
        <span className="hover:text-purple-600 text-xl" onPointerDown={onNegate}>
          <HiOutlineXCircle size={24} />
        </span>
      </div>
    </div>
  );
}

export default function Points({
  points,
  onNegate,
  type = "like",
}: {
  points: number;
  type: "relevance" | "like";
  onNegate: (e: React.MouseEvent<HTMLSpanElement | React.MouseEvent>) => void;
}) {
  return (
    <div
      // className="group/points flex flex-row items-center justify-center gap-2 p-2 rounded-md w-20  hover:bg-slate-300 -my-2 h-12"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}>
      <ReactButtonWrapper>
        <div className="flex flex-col items-center w-fit gap-[2px]">
          <div className="flex flex-row items-center gap-1 text-sm font-thin">
            {type == "relevance" ? <p>Relevance</p> : <p>Veracity</p>}
          </div>
          <hr className="w-full h-[1.5px] bg-slate-300" />
          <NegateLikeButtons points={points} onNegate={onNegate} />
        </div>

        {/* {type == "like" ? <FiHeart /> : <FiLink2 />} */}
        {/* {points} */}
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
