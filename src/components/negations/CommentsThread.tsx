import { usePointContext } from "../../contexts/PointContext"
import { useState } from "react"
import { GoComment } from "react-icons/go"
import PointWrapper from "../PointWrapper"
import { Node } from "../../types/Points"

function CommentThreadHeader({ isrelevanceVisible, setIsrelevanceVisible, nbItems }: { isrelevanceVisible: boolean, setIsrelevanceVisible: React.Dispatch<React.SetStateAction<boolean>>, nbItems: number }) {
    function handleExpand(e: React.MouseEvent<HTMLButtonElement | MouseEvent>) {
        e.preventDefault()
        e.stopPropagation()
        setIsrelevanceVisible(!isrelevanceVisible)
    }

    return (
        <button className="flex flex-col items-start p-2 text-gray-400" onClick={(e) => handleExpand(e)} >
            <div className="flex flex-row items-center gap-2 justify-center text-rose-800">
                {isrelevanceVisible ? <GoComment size={18} color="rgb(168, 33, 105)" /> :
                    <div className="w-[18px]">{nbItems}</div>
                }
                <p className="font-semibold">{`Comment${nbItems > 1 || isrelevanceVisible ? "s" : ""}`}</p>
                <p className="font-normal text-gray-400">{`tap to ${isrelevanceVisible ? "hide" : "show"}`}</p>
            </div>
        </button>
    )
}

export default function CommentsThread({ level }: { level: number }) {
    const { point, children, setChildren, detailsOpened, refreshChildren, comments } = usePointContext()
    const [threadVisible, setThreadVisible] = useState(false)

    return (
        <>
            {
                comments.length > 0 && comments && detailsOpened && (
                    <div className="border-black pl-3 border-l  my-2 flex flex-col gap-2 ml-2 sm:ml-6 lg:ml-8">
                        <CommentThreadHeader isrelevanceVisible={threadVisible} setIsrelevanceVisible={setThreadVisible} nbItems={comments.length} />
                        {threadVisible &&
                            <div className={`flex flex-col w-full gap-1`}>
                                {comments.map((el: Node, i: number) => {
                                    return <PointWrapper
                                        key={el.id! + i}
                                        level={level + 1}
                                        point={el}
                                        parent={point}
                                        setHistoricalItems={() => { }}
                                        setParentChildren={setChildren}
                                        refreshParentThread={refreshChildren}
                                        getParentAncestry={() => ""}
                                    />
                                })}
                            </div>
                        }
                    </div>

                )

            }
        </>
    )
}