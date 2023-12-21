import { GoInfo, GoComment } from "react-icons/go"
import { Node } from "../../types/Points";
import { usePointContext } from "../../contexts/PointContext";
import { useEffect, useState } from "react";
import PointWrapper from "../PointWrapper";
import { PiExcludeDuotone } from "react-icons/pi";
import { MdDoNotDisturbOnTotalSilence } from "react-icons/md";

function VeracityThreadHeader({ isVeracityVisible, setIsVeracityVisible, nbItems }: { isVeracityVisible: boolean, setIsVeracityVisible: React.Dispatch<React.SetStateAction<boolean>>, nbItems: number }) {

    function handleExpand(e: React.MouseEvent<HTMLButtonElement | MouseEvent>) {
        e.preventDefault()
        e.stopPropagation()
        setIsVeracityVisible(!isVeracityVisible)
    }

    return (
        <button className="flex flex-col items-start p-2 text-blue-800" onClick={(e) => handleExpand(e)} >
            <div className="flex flex-row items-center gap-2 justify-start">
                {isVeracityVisible ? <PiExcludeDuotone size={18} color="rgb(30,64,175)"  /> :
                    // <BsChevronExpand size={18}/>
                    <div className="w-[18px]">{nbItems}</div>
                }
                <p className="font-semibold">Alternatives</p>
                <p className="font-normal text-gray-400">{`tap to ${isVeracityVisible ? "hide" : "show"}`}</p>

                <a href="https://responses.negationgame.com/" target="_blank" className="flex flex-row gap-1 items-center hover:text-black">
                    <GoInfo size={18} color="#AAAAAA" />
                </a>
            </div>
            {isVeracityVisible && <p className="text-gray-400/80 font-light">these points ↓ are alternative options to the parent point ↑</p>}
        </button>)
}

function RelevanceThreadHeader({ isRelevanceVisible, setIsRelevanceVisible, nbItems }: { isRelevanceVisible: boolean, setIsRelevanceVisible: React.Dispatch<React.SetStateAction<boolean>>, nbItems: number }) {
    function handleExpand(e: React.MouseEvent<HTMLButtonElement | MouseEvent>) {
        e.preventDefault()
        e.stopPropagation()
        setIsRelevanceVisible(!isRelevanceVisible)
    }

    return (
        <button className="flex flex-col items-start p-2 text-gray-400" onClick={(e) => handleExpand(e)} >
            <div className="flex flex-row items-center gap-2 justify-center text-purple-800">
                {isRelevanceVisible ? <MdDoNotDisturbOnTotalSilence size={18} color="rgb(107, 33, 168)" /> :
                    // <BsChevronExpand size={18}/>
                    <div className="w-[18px]">{nbItems}</div>
                }
                <p className="font-semibold">Counterpoints</p>
                <p className="font-normal text-gray-400">{`tap to ${isRelevanceVisible ? "hide" : "show"}`}</p>
                <a href="https://responses.negationgame.com/" target="_blank" className="flex flex-row gap-1 items-center hover:text-black">
                    <GoInfo size={18} color="#AAAAAA" />
                </a>
            </div>
            {isRelevanceVisible && <p className="text-gray-400/80 font-light">these points ↓ are evidence against the parent point ↑ in this context</p>}
        </button>
    )
}


export default function ChildrenThread({ type, level, setHistoricalItems, getParentAncestry }: {
    type: "conviction" | "importance"
    level: number;
    setHistoricalItems: React.Dispatch<React.SetStateAction<string[] | undefined>>;
    getParentAncestry: undefined | (() => string);
}) {
    const { point, children, setChildren, detailsOpened, refreshChildren } = usePointContext()
    const [threadVisible, setThreadVisible] = useState(true)

    return (
        <>
            {children[type] && children[type].length > 0 && detailsOpened && (
                <div className="border-black pl-3 border-l  my-2 flex flex-col gap-2 ml-2 sm:ml-6 lg:ml-8">
                    {type == "importance" && <RelevanceThreadHeader isRelevanceVisible={threadVisible} setIsRelevanceVisible={setThreadVisible} nbItems={children[type].filter((child: any) => child.type !== "input").length} />}
                    {type == "conviction" && <VeracityThreadHeader isVeracityVisible={threadVisible} setIsVeracityVisible={setThreadVisible} nbItems={children[type].filter((child: any) => child.type !== "input").length} />}
                    {threadVisible &&
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
                    }
                </div>
            )}
        </>
    )
}
