import { Signer } from 'neynar-next/server'
import ReactButtonWrapper from '../ReactButtonWrapper';
import NegateLikeButtons from './NegateLikeButtons';
import { useState } from 'react';


export default function Score({ points, onNegate, type, advocates, farcasterSigner, id }: {
    points: number;
    onNegate: (e: React.MouseEvent<HTMLSpanElement | React.MouseEvent>) => void;
    type: "relevance" | "veracity";
    advocates: { fid: number }[];
    farcasterSigner: Signer | null;
    id: string;
}) {

    const [isLiked, setIsLiked] = useState(
        farcasterSigner && 'fid' in farcasterSigner && advocates.some(advocate => advocate.fid === farcasterSigner.fid)
    );

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
                    <div className="flex flex-row items-center gap-1">
                        <span>{points}</span>
                        <p className='text-sm font-thin'>{type[0].toUpperCase() + type.slice(1)}</p>
                    </div>
                    <hr className="w-full h-[1.5px] bg-slate-300" />
                    <NegateLikeButtons id={id} points={points} onNegate={onNegate} type={type} advocates={advocates} farcasterSigner={farcasterSigner} setIsLiked={setIsLiked} isLiked={isLiked} />
                </div>
            </ReactButtonWrapper>
        </div>
    )
}

