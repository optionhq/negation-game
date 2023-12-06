import { Node } from "@/types/Points";
import { useSigner } from "neynar-next";
import { PointProvider } from "@/contexts/PointContext";
import InputNegation from "./negations/InputNegation";
import Point from "./Point";
import { negate } from "@/lib/negate";
import publish from "@/lib/publish";

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

    console.log(point.type)

    return (
        <PointProvider point={point} signer={signer} refreshParentThread={refreshParentThread}>
            {
                point.type === "input" &&
                <InputNegation
                    pointBg={pointBg}
                    placeHolder={"This point `" + (parent?.endPoint ? parent?.endPoint.title : parent?.title) + "` is not " + (point.kind === "relevance" ? "relevant" : "true") + " because ..."}
                    setParentChildren={setParentChildren}
                    onPublish={async (text: string) => {
                        if (point.parentId && signer)
                            await negate(text, point.parentId, signer)
                        else if (!point.parentId && signer)
                            await publish(text, signer);
                        refreshParentThread()
                    }}
                    onClose={() => {
                        setParentChildren((element: { veracity: Node[], relevance: Node[] }) => {
                            let filtered = { ...element, [point.kind!]: element[point.kind!].filter((child: any) => child.type !== "input") }
                            return filtered;
                        })
                    }
                    }
                />

            }
            {
                (point.type === "negation" || point.type === "root") &&
                <Point level={level} parent={parent} getParentAncestry={getParentAncestry} setHistoricalItems={setHistoricalItems} />
            }
        </PointProvider>
    );
}
