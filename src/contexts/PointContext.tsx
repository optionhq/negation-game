import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Node } from '../types/Points';
import unlike from '../lib/unlike';
import like from '../lib/like';
import { Signer } from 'neynar-next/server';
import { getMaybeNegation } from '../lib/useCasts';
import axios from 'axios';
import isNegation from '../lib/isNegation';

type PointContextType = {
    point: Node,
    handleLike: (e: React.MouseEvent<HTMLSpanElement | React.MouseEvent>, type: "relevance" | "conviction") => void
    handleNegate: (e: React.MouseEvent<HTMLSpanElement | React.MouseEvent>, type: 'relevance' | 'conviction') => void
    likes: undefined | { relevance: number | undefined, conviction: number | undefined }
    liked: undefined | { relevance: boolean | undefined; conviction: boolean };
    setDetailsOpened: React.Dispatch<React.SetStateAction<boolean>>
    detailsOpened: boolean
    children: { relevance: any[]; conviction: any[] }
    setChildren: React.Dispatch<React.SetStateAction<{ relevance: any[]; conviction: any[] }>>,
    comments: Node[],
    childrenLoading: boolean,
    setChildrenLoading: React.Dispatch<React.SetStateAction<boolean>>,
    refreshChildren: () => Promise<void>,
    unfurlDropdown: () => Promise<void>,
    refreshParentThread: () => Promise<void>
};


export const PointContext = createContext<PointContextType | undefined>(undefined);

export function usePointContext() {
    const context = useContext(PointContext);
    if (!context) {
        throw new Error('usePointContext must be used within a PointContextProvider');
    }
    return context;
}

export function PointProvider({ children: _children, point, signer, refreshParentThread }: {
    children: React.ReactNode, point: Node, signer: Signer | null, refreshParentThread: () => Promise<void>
}) {

    const [children, setChildren] = useState<{ relevance: Node[], conviction: Node[] }>({ relevance: [], conviction: [] })
    const [comments, setComments] = useState<Node[]>([])
    const [likes, setLikes] = useState<undefined | { relevance: number | undefined, conviction: number | undefined }>()
    const [liked, setLiked] = useState<undefined | { relevance: boolean | undefined; conviction: boolean }>()

    const [childrenLoading, setChildrenLoading] = useState(false)
    const [detailsOpened, setDetailsOpened] = useState(false)

    useEffect(() => {
        let _likes
        let _liked
        if (point.type !== "input") {
            let likedveracity = signer && 'fid' in signer && point.advocates?.some((el: { fid: number }) => el.fid === signer.fid) ? signer && 'fid' in signer && point.advocates?.some((el: { fid: number }) => el.fid === signer.fid) : undefined
            let likedrelevance = signer && 'fid' in signer && point.advocates?.some((el: { fid: number }) => el.fid === signer.fid) ? signer && 'fid' in signer && point.endPoint?.advocates?.some((el: { fid: number }) => el.fid === signer.fid) : undefined
            if (point.type == "negation") {
                _likes = { relevance: point.points, conviction: point.endPoint?.points }
                _liked = { relevance: likedrelevance, conviction: likedveracity! }
            }
            else if (point.type == "root") {
                _likes = { relevance: undefined, conviction: point.points }
                _liked = { relevance: undefined, conviction: likedveracity! }

            }
            setLikes(_likes)
            setLiked(_liked)
        }
    }, [])

    const handleLike = useCallback(async (e: React.MouseEvent<HTMLSpanElement | React.MouseEvent>, type: "relevance" | "conviction") => {
        e.stopPropagation();
        e.preventDefault();
        if (!likes || !liked || !point.id || !signer) return
        if (liked[type])
            await unlike(point.id, signer).catch((e) => console.log("ERROR - unlike", e)).then(() => {
                setLikes(prev => ({ ...prev, [type]: prev?.[type]! - 1 } as { relevance: number | undefined; conviction: number | undefined }))
                setLiked(prev => ({ ...prev, [type]: false } as { relevance: boolean | undefined; conviction: boolean }))
            })
        else
            await like(point.id, signer).catch((e) => console.log("ERROR - like", e)).then(() => {
                setLikes(prev => ({ ...prev, [type]: prev?.[type]! + 1 } as { relevance: number | undefined; conviction: number | undefined }))
                setLiked(prev => ({ ...prev, [type]: true } as { relevance: boolean | undefined; conviction: boolean }))
            })
    }, [liked]);


    const handleNegate = useCallback(async (e: React.MouseEvent<HTMLSpanElement | React.MouseEvent>, type: 'relevance' | 'conviction') => {
        e.stopPropagation();
        e.preventDefault();

        setChildren(prev => {
            let newChildren = { ...prev };
            // Check if there's already an input element in the array
            const hasInput = newChildren[type]?.some((neg: any) => neg.type === "input");
            // If there's no input element, add one
            if (!hasInput)
                newChildren[type].push({ type: "input", parentId: point.id, negationType: type, title: "" })
            return newChildren;
        })
        if (!detailsOpened) unfurlDropdown()
    }, [detailsOpened])

    const getNegationsForType = async (_point: Node, type: "relevance" | "conviction") => {
        const { data: { result: { casts } } } = await axios.get(`/api/cast/${_point.id}/thread`);
        const comments: Node[] = [];

        const negations: Node[] = [];
        for (const cast of casts) {
            const possibleNegation = await getMaybeNegation(cast);
            if (possibleNegation.parentId == _point.id)
                if (possibleNegation.type == "negation")
                    negations.push(possibleNegation);
                else {
                    possibleNegation.type = "comment"
                    comments.push(possibleNegation);
                }
        }

        const inputBox = children?.[type]?.find(neg => neg?.type === "input");
        let sortedNegations = negations.sort((a, b) => {
            if (b.points !== a.points) {
                return b.points! - a.points!;
            } else if (a.endPoint && b.endPoint) {
                return b.endPoint.points! - a.endPoint.points!;
            } else {
                return 0;
            }
        });

        setComments((prev) => {
            const newComments = comments.filter((comment) => !prev.some((prevComment) => prevComment.id === comment.id));
            return [...prev, ...newComments];
        });
        return inputBox ? [inputBox, ...sortedNegations] : sortedNegations;
    };

    const refreshChildren = useCallback(async () => {
        if (point.type == "input") return
        let newNeg: { relevance: Node[], conviction: Node[] } = { relevance: [], conviction: [] }
        let newComments: { point: Node[], endpoint: Node[] } = { point: [], endpoint: [] }

        if (point.type == "negation") {
            [newNeg.relevance, newNeg.conviction] = await Promise.all([
                getNegationsForType(point, "relevance"),
                getNegationsForType(point.endPoint!, "conviction"),

            ])
        }
        else {
            [newNeg.conviction] = await Promise.all([
                getNegationsForType(point, "conviction"),
            ])
        }

        setChildren(newNeg)
    }, [])

    const unfurlDropdown = useCallback(async () => {
        setDetailsOpened((p) => !p)
        if (!detailsOpened) {
            setChildrenLoading(true);
            await refreshChildren()
            setChildrenLoading(false);
        }
    }, [children]);

    return (<PointContext.Provider value={{ point, handleLike, likes, liked, handleNegate, detailsOpened, setDetailsOpened, children, comments, setChildren, childrenLoading, setChildrenLoading, refreshChildren, unfurlDropdown, refreshParentThread }}>
        {_children}
    </PointContext.Provider>)
}