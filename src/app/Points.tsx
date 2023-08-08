"use client";
import { MouseEventHandler } from "react";
import { FiHeart, FiXCircle } from "react-icons/fi";

export default function Points({ points, onNegate }: { points: number; onNegate: () => void }) {
  function onNegateClick(e: React.MouseEvent) {
    e.nativeEvent.stopPropagation();
    onNegate();
  }

  function onLike(e: React.MouseEvent) {
    e.stopPropagation();
    e.nativeEvent.stopPropagation();
    console.log("onLike clicked");
    console.log(e.isPropagationStopped());
  }
  return (
    <div className=" group/points flex flex-col items-center justify-center p-2 rounded-md w-20 hover:bg-slate-300 -my-2 h-12">
      {points}
      <div className="flex-row gap-2 transition-all hidden group-hover/points:flex">
        <span className="hover:text-green-500 text-xl" onPointerDown={onLike}>
          <FiHeart />
        </span>
        <span className="hover:text-red-500 text-xl" onPointerDown={onNegateClick}>
          <FiXCircle />
        </span>
      </div>
    </div>
  );
}
