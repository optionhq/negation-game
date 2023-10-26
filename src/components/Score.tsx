import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { FiCheck, FiHeart, FiLink2, FiXCircle } from "react-icons/fi";
import ReactButtonWrapper from "./ReactButtonWrapper";
import { AiOutlineCheckCircle, AiOutlineCiCircle, AiOutlineCheck } from "react-icons/ai";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";
import Tooltip from "./Tooltip";
import { Signer } from 'neynar-next/server'

function NegateLikeButtons({
  id,
  points,
  onNegate,
  type,
  advocates,
  farcasterSigner,
}: {
  id: string;
  points: number;
  onNegate: (e: React.MouseEvent<HTMLSpanElement | React.MouseEvent>) => void;
  type: "relevance" | "veracity";
  advocates: { fid: number }[];
  farcasterSigner: Signer | null;
}) {
  const [isLiked, setIsLiked] = useState(
    farcasterSigner && 'fid' in farcasterSigner && advocates.some(advocate => advocate.fid === farcasterSigner.fid)
  );
  const [score, setScore] = useState(points);

  useEffect(() => {
    // This will run every time `isLiked` or `score` changes
  }, [isLiked, score]);

  const handleLike = useCallback((e: React.MouseEvent<HTMLSpanElement | React.MouseEvent>) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    const toggleLike = async () => {
      if (isLiked) {
        // Call the internal API to unlike
        await axios.delete(`/api/cast/${id}/like`, { data: { signerUuid: farcasterSigner?.signer_uuid } })
          .then(() => {
            setScore(prevScore => prevScore - 1);
            setIsLiked(false);
          });
      } else {
        // Call the internal API to like
        await axios.post(`/api/cast/${id}/like`, { signerUuid: farcasterSigner?.signer_uuid })
          .then(() => {
            setScore(prevScore => prevScore + 1);
            setIsLiked(true);
          });
      }
    };

    toggleLike();
  }, [isLiked, farcasterSigner, id, setScore, setIsLiked]);

  return (
    <div>
      <div className="group/points w-16 flex flex-col items-center">
      <div className={`group-hover/points:hidden h-6 ${isLiked ? 'font-bold' : ''} flex items-center gap-1`}>
        <span>{score}</span>
        {isLiked && <AiOutlineCheck />}
      </div>
        <div className="flex-row gap-1 transition-opacity hidden opacity-0 group-hover/points:flex group-hover/points:opacity-100 h-6">
          <Tooltip text={isLiked ? (type == "veracity" ? "Undo yep" : "Undo matters") : (type == "veracity" ? "Yep" : "Matters")} orientation="bottom">
            <span 
              className={isLiked ? "text-green-500 text-xl" : "hover:text-green-500 text-xl"} 
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleLike(e);
              }}
            >
              <HiOutlineCheckCircle size={24} />
            </span>
          </Tooltip>
          <Tooltip text={type == "veracity" ? "Nope" : "Doesn't matter"} orientation="bottom">
            <span 
              className="hover:text-purple-600 text-xl" 
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onNegate(e);
              }}
            >
              <HiOutlineXCircle size={24} />
            </span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

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
      advocates: {fid: number}[];
      farcasterSigner: Signer | null;
      id: string;
}) {
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
            <div className="flex flex-row items-center gap-1 text-sm font-thin">
              {type == "relevance" ? <p>Relevance</p> : <p>Veracity</p>}
            </div>
            <hr className="w-full h-[1.5px] bg-slate-300" />
            <NegateLikeButtons id={id} points={points} onNegate={onNegate} type={type} advocates={advocates} farcasterSigner={farcasterSigner} />
          </div>
        </ReactButtonWrapper>
      </div>
      );
}
