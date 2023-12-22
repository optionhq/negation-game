"use client"
import React from 'react';
import ReactButtonWrapper from "../../ReactButtonWrapper";
import { AiOutlineCheck } from "react-icons/ai";
import NegateLikeButtons from './NegateLikeButtons';
import {  Node } from '../../../types/Points';
import { usePointContext } from '../../../contexts/PointContext';

export default function DesktopScore({
  type,
}: {
  type: "relevance" | "conviction";

}) {
  const { likes, liked} = usePointContext()

  if(likes?.[type] == undefined) return <></>
  return (
    <div
      onClick={(e) => {
        // Only stop propagation and prevent default if the target is this div
        if (e.target !== e.currentTarget) {
          e.stopPropagation();
          e.preventDefault();
        }
      }}
    >
      <ReactButtonWrapper>
        <div className="flex flex-col items-center w-fit gap-[2px]">
          <p className='text-sm font-thin'>{type[0].toUpperCase() + type.slice(1)}</p>
          <hr className="w-full h-[1.5px] bg-slate-300" />
          <div className='group/points h-6 w-16 flex items-center justify-center'>
            <div className={`group-hover/points:hidden gap-1 flex flex-row items-center`}>
              <span className={liked?.[type] ? " text-green-500 font-bold": ""}>{likes[type]}</span>
              {liked?.[type] && <AiOutlineCheck />}
            </div>
            <NegateLikeButtons type={type} />
          </div>
        </div>
      </ReactButtonWrapper>
    </div>
  );
}