import { GoCircleSlash, GoInfo, GoUnlink } from "react-icons/go"
import { Node } from "@/types/Points";
import { usePointContext } from "@/contexts/PointContext";
import { useEffect, useState } from "react";
import PointWrapper from "../PointWrapper";


function VeracityThreadHeader() {
    return (<div className="flex flex-row gap-2 pt-3 pl-2 pb-2 items-center font-semibold text-gray-400">
        <GoCircleSlash size={18} color="#AAAAAA" />
        <p>Not true</p>
        <button onClick={() => window.open('https://responses.negationgame.com/', '_blank')}>
            <GoInfo size={18} color="#AAAAAA" />
        </button>
    </div>)
}

function RelevanceThreadHeader() {
    return (<div className="flex flex-row gap-2 pt-3 pl-2 pb-2 items-center font-semibold text-gray-400">
        <GoUnlink size={18} color="#AAAAAA" />
        <p>Doesn&lsquo;t matter</p>
        <button onClick={() => window.open('https://responses.negationgame.com/', '_blank')}>
            <GoInfo size={18} color="#AAAAAA" />
        </button>
    </div>)
}

export default function ChildrenThread({ type, level, setHistoricalItems, getParentAncestry }: {
    type: "veracity" | "relevance"
    level: number;
    setHistoricalItems: React.Dispatch<React.SetStateAction<string[] | undefined>>;
    getParentAncestry: undefined | (() => string);
}) {
    const { point, children, setChildren, detailsOpened, refreshChildren } = usePointContext()

    return (
        <>
            {children[type] && children[type].length > 0 && detailsOpened && (
                <div className="border-black pl-3 border-l  my-2 flex flex-col gap-2 ml-2 sm:ml-6 lg:ml-8">
                    {type == "relevance" && <RelevanceThreadHeader />}
                    {type == "veracity" && <VeracityThreadHeader />}
                    <div className={`flex flex-col w-full gap-1`}>
                        {children[type].map((el: Node, i: number) => {
                            return <PointWrapper
                                key={el.id! + i}
                                level={level + 1}
                                point={el}
                                parent={point}
                                setHistoricalItems={setHistoricalItems}
                                setParentChildren={setChildren}
                                refreshParentThread={refreshChildren}
                                getParentAncestry={getParentAncestry}
                            />
                        })}
                    </div>

                </div>
            )}
        </>
    )
}
