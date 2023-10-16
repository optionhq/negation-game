import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Points, Accordion, ExternalLink, Arrow, InputComponent } from "@/components";
import { Point, Node, Negation } from "@/types/Points";
import RecastedComponent from "./RecastedComponent";
import ProfilePreview from "./ProfilePreview";
import { extractEndPointUrl } from "@/lib/useEndPoints";
import { extractLink } from "@/lib/extractLink";
import { useFarcasterUser } from "@/contexts/UserContext";
import { negate } from "@/lib/negate";
import isNegation from "@/lib/isNegation";
import { Cast } from 'neynar-next/server';

const INDENTATION_PX = 25;

export default function AccordionComponent({
  level,
  point,
  parent,
  setParentChildren,
  setHistoricalItems,
  threadData,
}: {
  level: number;
  point: Point;
  parent: string | undefined;
  setParentChildren: any;
  setHistoricalItems: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  threadData: any;
}) {
  const router = useRouter();
  const [points, setPoints] = useState<Point[] | null>(null);
  const [isDropdownClicked, setIsDropdownClicked] = useState<boolean>(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [detailsOpened, setDetailsOpened] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const [currentEntry, setCurrentEntry] = useState<Point>(point);
  const { text, link } = extractLink(point.text); // can remove
  const { farcasterUser, setFarcasterUser } = useFarcasterUser();

  useEffect(() => {

    if (isDropdownClicked) {
      fetchThreadData();
    }
  }, [isDropdownClicked]);

  const fetchThreadData = async () => {
    const res = await fetch(`/api/cast/${point.hash}/thread`);
    const data: {result: { casts: Cast[] }} = await res.json();
    const thread: Cast[] = data.result.casts;



    // Create a map of entries by their hash
    const entriesByHash: Map<string, Negation> = new Map(
      thread.map((entry: Cast) => [entry.hash, entry])
    );

    // Find the replies for each entry
    thread.forEach((entry: Cast) => {
      if (entry.parent_hash && entriesByHash.has(entry.parent_hash)) {
        let parentEntry = entriesByHash.get(entry.parent_hash);
        if (parentEntry) {
          // Ensure parentEntry.children is defined
          if (!parentEntry.children) {
            parentEntry.children = [];
          }
          // Exclude duplicates
          const childEntry = entriesByHash.get(entry.hash);
          if (childEntry && !parentEntry.children.some((child) => child.id === childEntry.id)) {
            parentEntry.children.push(childEntry);
          }
        }
      }
    });

    // Update the children of the current point
    const currentPoint = entriesByHash.get(point.hash);
    // const currentCasted = entriesByHash.get(currentEntry.endPoint?.id!)

    console.log("title", point.text, "step", level, currentPoint);
    if (currentPoint) {
      setPoints(currentPoint.negations || []);
    }
  };

  useEffect(() => {
    fetchEndPoint(point);
  }, []);

  const fetchEndPoint = async (entry: Negation) => {
    if (entry.node_url && !entry.node) {
      const endPointResponse = await fetch(`/api/endpoint?endPointUrl=${entry.node_url}`);
      const endPointData: Node = await endPointResponse.json();
      entry.node = endPointData;
      setCurrentEntry({ ...entry }); // trigger a re-render

      // Fetch the thread associated with the endpoint
      const threadResponse = await fetch(`/api/thread?id=${entry.node.hash}`);
      const threadData: Cast[] = await threadResponse.json();

      // Convert the thread data to LinkPointsTree and append to children
      const threadChildren = threadData.map(responseToLinkPointsTree);
      console.log("");
      console.log(entry.negations);
      entry.negations = [...(entry.negations || []), ...threadChildren] as Negation[];
      console.log(entry.negations);

      setCurrentEntry({ ...entry }); // trigger a re-render again with updated children
    }
  };

  function expandDetails() {
    if (!detailsRef.current) return;
    detailsRef.current.open = !detailsRef.current.open;
    setDetailsOpened(detailsRef.current.open);
    if (detailsRef.current.open) {
      setIsDropdownClicked(true);
    }
  }

  const onNegate = (pointId: string) => (e: React.MouseEvent<HTMLSpanElement | React.MouseEvent>) => {
    if (!farcasterUser) {
      window.alert("You must be logged in to post.")
      return
    }
    if (!detailsRef.current) return;
    detailsRef.current.open = true;
    setDetailsOpened(detailsRef.current.open);

    if (points == null) {
      setPoints([{ type: "input" }]);
      return;
    }
    // Check if children already contains an object with type: "input"
    else if (!points.some((child) => child.type === "input")) {
      var _children = [...points, { type: "input", parentId: pointId }];
      setPoints(_children);
    }
  };

  function removeInput() {
    if (!parent) return;

    setParentChildren((element: any) => {
      let filtered = element.filter((child: any) => child.type !== "input");
      return filtered.length ? filtered : null;
    });
  }

  const paddingLeft = `${INDENTATION_PX * level + 6}px`;
  const pointBg = `${level % 2 ? " bg-indigo-700 bg-opacity-10 " : " bg-slate-50 "}`;

  function newRoute() {
    const current = searchParams.get("id");
    if (current?.includes(point.hash)) return;
    const route = current ? `${point.hash},${current}` : point.hash;
    router.push(`?id=${route}`);
  }

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    const selection = window.getSelection()?.toString();
    if (selection) return;
    expandDetails();
  }

  function handleDoubleClick(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    newRoute();
  }

  function toggle(e: any) {
    e.preventDefault();
  }

  const onPublishNegation = async (text: string) => {
    if (!farcasterUser) {
      window.alert("Must be logged in to publish. farcasterUser is null")
      return
    }
    const parentId = point.parent_hash!;
    const negation = await negate({ text, parentId, farcasterUser });
    removeInput();
  };

  //@ts-ignore
  if (point.type === "input")
    return (
      <InputComponent
        pointBg={pointBg}
        paddingLeft={paddingLeft}
        placeHolder={"The claim `" + parent + "` is not true because ..."}
        onCancel={removeInput}
        onPublish={onPublishNegation}
      />
    );
  return (
    <details
      ref={detailsRef}
      open={false}
      className="flex flex-col gap-1"
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onToggle={toggle}>
      <summary
        onClick={(e) => {
          e.preventDefault();
        }}
        className={pointBg + `claim relative border ${point.reply_count ? "cursor-pointer": ""}`}
        style={{ paddingLeft: paddingLeft }}>
        <div className="flex flex-col gap-2">
          <div className={`p-1 rounded-md ${point.reply_count > 0 ? "opacity-100" : "opacity-0"}`}>
            <div className={`transition w-full h-full ${detailsOpened ? "rotate-90" : "rotate-0"}`}>
              <Arrow />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 items-start justify-center w-full">
          {/* <ProfilePreview user={e.author!}/> */}
          <span className="w-full">
            {currentEntry.node && isNegation(currentEntry) && currentEntry.node.text}
          </span>
          {!currentEntry.node && (
            <>
              {currentEntry.text}
              {link && <RecastedComponent url={link} />}
            </>
          )}
          {/* <hr className="w-full h-[2px] bg-slate-400"/> */}
          <div className="flex flex-row gap-2 text-gray-500">
            {/* if there is no parent this is an endPoint so veracity negates the id */}
            {!parent && <Points points={point.likes} onNegate={onNegate(currentEntry.hash)} type="veracity" />}
            {/* if there is a parent this is a linkPoint so veracity negates the endPoint.id */}
            {currentEntry.node && (
              <>
                <Points points={point.likes} onNegate={onNegate(currentEntry.node!.id)} type="veracity" />
                <Points points={point.likes} onNegate={onNegate(currentEntry.hash)} type="relevance" />
              </>
            )}
          </div>
        </div>
      </summary>
      {points && points.length > 0 && (
        <div className="flex flex-col w-full gap-1 ">
          {points.map((el: any, i: number) => (
            <AccordionComponent
              key={i}
              level={level + 1}
              point={el}
              parent={point.text}
              setHistoricalItems={setHistoricalItems}
              setParentChildren={setPoints}
              threadData={threadData}
            />
          ))}
        </div>
      )}
    </details>
  );
}
