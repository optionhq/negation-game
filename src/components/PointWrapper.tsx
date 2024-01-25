import { useSigner } from "@/contexts/SignerContext";
import { PointProvider } from "../contexts/PointContext";
import { negate } from "../lib/negate";
import publish from "../lib/publish";
import { Node } from "../types/Points";
import Comment from "./Comment";
import Point from "./Point";
import InputNegation from "./negations/InputNegation";

export default function PointWrapper({
    level,
    point,
    parent = undefined,
    setParentChildren,
    setHistoricalItems,
    getParentAncestry,
    refreshParentThread,
}: {
    level: number;
    point: Node
    parent?: Node | undefined;
    setParentChildren?: any;
    setHistoricalItems: React.Dispatch<React.SetStateAction<string[] | undefined>>;
    getParentAncestry: undefined | (() => string);
    refreshParentThread: () => Promise<void>;
}) {
    const { signer } = useSigner()
    const pointBg = `${level % 2 ? " bg-indigo-25 hover:bg-indigo-50" : " bg-slate-50 hover:bg-gray-100"}`;

    return (
        <PointProvider point={point} signer={signer} refreshParentThread={refreshParentThread}>
            {
                point.type === "input" &&
                <InputNegation
                    pointBg={pointBg}
                    placeHolder={point.negationType === "relevance" ? "This point `" + (parent?.endPoint ? parent?.endPoint.title : parent?.title) + "` is not valid in this context because..." : "The point `" + (parent?.endPoint ? parent?.endPoint.title : parent?.title) + "` is wrong, because..."}
                    setParentChildren={setParentChildren}
                    onPublish={async (text: string) => {
                        if (point.parentId && signer)
                            await negate(text, point.parentId, signer)
                        else if (!point.parentId && signer)
                            await publish(text, signer);
                        setParentChildren((element: { conviction: Node[], relevance: Node[], comment: Node[] }) => {
                            let filtered = { ...element, [point.type!]: element[point.negationType!].filter((child: any) => child.type !== "input") }
                            return filtered;
                        })
                        refreshParentThread()
                    }}
                    onClose={() => {
                        setParentChildren((element: { conviction: Node[], relevance: Node[], comment: Node[] }) => {
                            let filtered = { ...element, [point.negationType!]: element[point.negationType!].filter((child: any) => child.type !== "input") }
                            return filtered;
                        })
                        // refreshParentThread()
                    }
                    }
                />

            }
            {
                point.type == "comment" && <Comment level={level} />
            }
            {
                (point.type === "negation" || point.type === "root") &&
                <Point level={level} parent={parent} getParentAncestry={getParentAncestry} setHistoricalItems={setHistoricalItems} />
            }
        </PointProvider>
    );
}
