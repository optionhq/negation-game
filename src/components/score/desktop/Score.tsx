"use client"
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { FiCheck, FiHeart, FiLink2, FiXCircle } from "react-icons/fi";
import ReactButtonWrapper from "../../ReactButtonWrapper";
import { AiOutlineCheckCircle, AiOutlineCiCircle, AiOutlineCheck } from "react-icons/ai";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";
import Tooltip from "../../Tooltip";
import { Signer } from 'neynar-next/server'
import { getDeviceType } from '@/lib/getDeviceType';
import NegateLikeButtons from './NegateLikeButtons';
import MobileScore from '../mobile/Score';

export default function Score({
  points,
  onNegate,
  type = "veracity",
  advocates,
  farcasterSigner,
  id,
}: {
  points: number;
  onNegate: (e: React.MouseEvent<HTMLSpanElement | React.MouseEvent>) => void;
  type: "relevance" | "veracity";
  advocates: { fid: number }[];
  farcasterSigner: Signer | null;
  id: string;
}) {
  const [score, setScore] = useState(points);
  const [isLiked, setIsLiked] = useState(
    farcasterSigner && 'fid' in farcasterSigner && advocates.some(advocate => advocate.fid === farcasterSigner.fid)
  );
  const deviceType = getDeviceType()

  if (deviceType === "mobile") return <MobileScore points={points} onNegate={onNegate} type={type} advocates={advocates} farcasterSigner={farcasterSigner} id={id} />
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
              <span>{score}</span>
              {isLiked && <AiOutlineCheck />}
            </div>
            <NegateLikeButtons id={id} points={points} onNegate={onNegate} type={type} advocates={advocates} farcasterSigner={farcasterSigner} setIsLiked={setIsLiked} isLiked={isLiked} setScore={setScore}/>
          </div>
        </div>
      </ReactButtonWrapper>
    </div>
  );
}