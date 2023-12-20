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
    handleLike: (e: React.MouseEvent<HTMLSpanElement | React.MouseEvent>, type: "importance" | "veracity") => void
    handleNegate: (e: React.MouseEvent<HTMLSpanElement | React.MouseEvent>, type: 'importance' | 'veracity') => void
    likes: undefined | { importance: number | undefined, veracity: number | undefined }
    liked: undefined | { importance: boolean | undefined; veracity: boolean };
    setDetailsOpened: React.Dispatch<React.SetStateAction<boolean>>
    detailsOpened: boolean
    children: { importance: any[]; veracity: any[] }
    setChildren: React.Dispatch<React.SetStateAction<{ importance: any[]; veracity: any[] }>>,
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

    const [children, setChildren] = useState<{ importance: Node[], veracity: Node[] }>({ importance: [], veracity: [] })
    const [comments, setComments] = useState<Node[]>([])
    const [likes, setLikes] = useState<undefined | { importance: number | undefined, veracity: number | undefined }>()
    const [liked, setLiked] = useState<undefined | { importance: boolean | undefined; veracity: boolean }>()

    const [childrenLoading, setChildrenLoading] = useState(false)
    const [detailsOpened, setDetailsOpened] = useState(false)

    useEffect(() => {
        let _likes
        let _liked
        if (point.type !== "input") {
            let likedveracity = signer && 'fid' in signer && point.advocates?.some((el: { fid: number }) => el.fid === signer.fid) ? signer && 'fid' in signer && point.advocates?.some((el: { fid: number }) => el.fid === signer.fid) : undefined
            let likedrelevance = signer && 'fid' in signer && point.advocates?.some((el: { fid: number }) => el.fid === signer.fid) ? signer && 'fid' in signer && point.endPoint?.advocates?.some((el: { fid: number }) => el.fid === signer.fid) : undefined
            if (point.type == "negation") {
                _likes = { importance: point.points, veracity: point.endPoint?.points }
                _liked = { importance: likedrelevance, veracity: likedveracity! }
            }
            else if (point.type == "root") {
                _likes = { importance: undefined, veracity: point.points }
                _liked = { importance: undefined, veracity: likedveracity! }

            }
            setLikes(_likes)
            setLiked(_liked)
        }
    }, [])

    const handleLike = useCallback(async (e: React.MouseEvent<HTMLSpanElement | React.MouseEvent>, type: "importance" | "veracity") => {
        e.stopPropagation();
        e.preventDefault();
        if (!likes || !liked || !point.id || !signer) return
        if (liked[type])
            await unlike(point.id, signer).catch((e) => console.log("ERROR - unlike", e)).then(() => {
                setLikes(prev => ({ ...prev, [type]: prev?.[type]! - 1 } as { importance: number | undefined; veracity: number | undefined }))
                setLiked(prev => ({ ...prev, [type]: false } as { importance: boolean | undefined; veracity: boolean }))
            })
        else
            await like(point.id, signer).catch((e) => console.log("ERROR - like", e)).then(() => {
                setLikes(prev => ({ ...prev, [type]: prev?.[type]! + 1 } as { importance: number | undefined; veracity: number | undefined }))
                setLiked(prev => ({ ...prev, [type]: true } as { importance: boolean | undefined; veracity: boolean }))
            })
    }, [liked]);


    const handleNegate = useCallback(async (e: React.MouseEvent<HTMLSpanElement | React.MouseEvent>, type: 'importance' | 'veracity') => {
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

    const getNegationsForType = async (_point: Node, type: "importance" | "veracity") => {
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
        let newNeg: { importance: Node[], veracity: Node[] } = { importance: [], veracity: [] }
        let newComments: { point: Node[], endpoint: Node[] } = { point: [], endpoint: [] }

        if (point.type == "negation") {
            [newNeg.importance, newNeg.veracity] = await Promise.all([
                getNegationsForType(point, "importance"),
                getNegationsForType(point.endPoint!, "veracity"),

            ])
        }
        else {
            [newNeg.veracity] = await Promise.all([
                getNegationsForType(point, "veracity"),
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