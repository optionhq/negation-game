import { Node } from "../types/Points";
import { useSigner } from "neynar-next";
import { PointProvider } from "../contexts/PointContext";
import InputNegation from "./negations/InputNegation";
import Point from "./Point";
import { negate } from "../lib/negate";
import publish from "../lib/publish";
import Comment from "./Comment";

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
                    placeHolder={"This point `" + (parent?.endPoint ? parent?.endPoint.title : parent?.title) + "` is not " + (point.negationType === "relevance" ? "relevant" : "true") + " because ..."}
                    setParentChildren={setParentChildren}
                    onPublish={async (text: string) => {
                        if (point.parentId && signer)
                            await negate(text, point.parentId, signer)
                        else if (!point.parentId && signer)
                            await publish(text, signer);
                        refreshParentThread()
                    }}
                    onClose={() => {
                        setParentChildren((element: { veracity: Node[], relevance: Node[], comment: Node[] }) => {
                            let filtered = { ...element, [point.type!]: element[point.negationType!].filter((child: any) => child.type !== "input") }
                            return filtered;
                        })
                    }
                    }
                />

            }
            {
                point.type == "comment" && <Comment level={level}/>
            }
            {
                (point.type === "negation" || point.type === "root") &&
                <Point level={level} parent={parent} getParentAncestry={getParentAncestry} setHistoricalItems={setHistoricalItems} />
            }
        </PointProvider>
    );
}
