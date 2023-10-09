import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Points, Accordion, ExternalLink, Arrow, InputComponent } from "@/components";
import { EndPointsTree, LinkPointsTree, User } from "@/types/PointsTree";
import RecastedComponent from "./RecastedComponent";
import ProfilePreview from "./ProfilePreview";
import { extractEndPointUrl } from "@/lib/useEndPoints";
import { extractLink } from "@/lib/extractLink";
import { useFarcasterUser } from '@/contexts/UserContext';
import { createNegation } from "@/lib/negate";
import { isCompleteNegation, validNegation } from "@/lib/isNegation";

const INDENTATION_PX = 25;

type ThreadEntry = {
  text: string;
  hash: string;
  author: User;
  parentHash?: string;
  reactions: { count: number };
  replies: { count: number };
};

export default function AccordionComponent({
  level,
  e,
  parent,
  setParentChildren,
  setHistoricalItems,
  threadData,
}: {
  level: number;
  e: LinkPointsTree;
  parent: string | undefined;
  setParentChildren: any;
  setHistoricalItems: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  threadData: any;
}) {
  const [children, setChildren] = useState<any[]>(e.children || []);
  const [isDropdownClicked, setIsDropdownClicked] = useState<boolean>(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [detailsOpened, setDetailsOpened] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentEntry, setCurrentEntry] = useState<LinkPointsTree>(e);
  const { text, link } = extractLink(e.title); // can remove
  const { farcasterUser, setFarcasterUser } = useFarcasterUser();

  useEffect(() => {

    if (isDropdownClicked) {
      fetchThreadData();
    }
  }, [isDropdownClicked]);

  const responseToLinkPointsTree = (response: ThreadEntry): LinkPointsTree => {
    const endPointUrl = extractEndPointUrl(response);
    return {
      title: response.text,
      id: response.hash,
      author: response.author,
      parentId: response.parentHash,
      points: response.reactions.count,
      replyCount: response.replies.count,
      children: [],
      endPointUrl: endPointUrl || undefined,
    };
  };

  const responseToEndPointsTree = (response: ThreadEntry): EndPointsTree => {
    return {
      title: response.text,
      id: response.hash,
      author: response.author,
      parentId: response.parentHash,
      points: response.reactions.count,
      replyCount: response.replies.count,
      children: [],
    };
  };

  const fetchThreadData = async () => {
    const res = await fetch(`/api/thread?id=${e.id}`);
    const threadData: ThreadEntry[] = await res.json();

    // Create a map of entries by their hash
    const entriesByHash: Map<string, LinkPointsTree> = new Map(
      threadData.map((entry: ThreadEntry) => [entry.hash, responseToLinkPointsTree(entry)])
    );

    // Find the replies for each entry
    threadData.forEach((entry: ThreadEntry) => {
      if (entry.parentHash && entriesByHash.has(entry.parentHash)) {
        let parentEntry = entriesByHash.get(entry.parentHash);
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
    const currentPoint = entriesByHash.get(e.id);
    if (currentPoint) {
      setChildren(currentPoint.children || []);
    }

    fetchEndPoint(e)
  };

  // useEffect(() => {
  //   fetchEndPoint(e);
  // }, []);

  const fetchEndPoint = async (entry: LinkPointsTree) => {
    // if it's a linkPoint, fetch the endPoint
    if (entry.endPointUrl && !entry.endPoint) {
      const endPointResponse = await fetch(`/api/endpoint?endPointUrl=${entry.endPointUrl}`);
      const endPointData: EndPointsTree = await endPointResponse.json();
      entry.endPoint = endPointData;
      setCurrentEntry({ ...entry }); // trigger a re-render

      // if the endPoint has children, fetch them
      const endPointNegationsResponse = await fetch(`/api/thread?id=${entry.endPoint.id}`);
      const endPointNegations: ThreadEntry[] = await endPointNegationsResponse.json();

      console.log("endPointNegations", endPointNegations);
      let negations: LinkPointsTree[] = [];
      for (const cast of endPointNegations.filter(e => e.hash !== entry.id)) {
        // maybbe try with this && cast.parentHash == entry.id ?
        if (validNegation(cast.text) && cast.parentHash == entry.endPoint.id ) {
          const negation = responseToLinkPointsTree(cast);

          negations.push(negation);
          
        }
      }
      console.log("adding negations", negations)
      console.log("on current entry", currentEntry.endPoint?.title)
      console.log(currentEntry.endPoint.id)
      setChildren([...children, ...negations])
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
    if (!detailsRef.current) return;
    detailsRef.current.open = true;
    setDetailsOpened(detailsRef.current.open);

    if (children == null) {
      setChildren([{ type: "input" }])
      return
    }
    // Check if children already contains an object with type: "input"
    else if (!children.some(child => child.type === "input")) {
      var _children = [...children, { type: "input", parentId: pointId }];
      setChildren(_children);
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
    if (current?.includes(e.id)) return;
    const route = current ? `${e.id},${current}` : e.id;
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

  const handlePublish = async ({text, parentId}: {text: string, parentId: string}) => {
    if (!farcasterUser) {
      throw new Error("Must be logged in to publish. farcasterUser is null")
    }
    const negation = await createNegation({text, parentId, farcasterUser});
    removeInput();
  };

  //@ts-ignore
  if (e.type === "input")
    return <InputComponent pointBg={pointBg} paddingLeft={paddingLeft} 
            parentText={parent!} parentId={e.parentId!} 
            removeInput={removeInput} onPublish={handlePublish} />;
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
        className={pointBg + " claim relative border bg- "}
        style={{ paddingLeft: paddingLeft }}>
        <div className="flex flex-col gap-2">
          <div className={`p-1 rounded-md ${e.replyCount > 0 ? "opacity-100" : "opacity-0"}`}>
            <div className={`transition w-full h-full ${detailsOpened ? "rotate-90" : "rotate-0"}`}>
              <Arrow />
            </div>
          </div>
          {/* {parent && (
            <div
              className="w-[1px] h-24 bg-black absolute -top-14 left-0 z-40"
              style={{ marginLeft: `${22 + INDENTATION_PX * (level - 1)}px` }}></div>
          )} */}
        </div>
        <div className="flex flex-col gap-3 items-start justify-center w-full">
          {/* <ProfilePreview user={e.author!}/> */}
          <span className="w-full"> 
            {(currentEntry.endPoint && isCompleteNegation(currentEntry)) &&
              currentEntry.endPoint.title}
          </span>
          {!currentEntry.endPoint && 
            <> 
              {currentEntry.title}
              {link && <RecastedComponent url={link} />}
            </>
          }
          {/* <hr className="w-full h-[2px] bg-slate-400"/> */}
          <div className="flex flex-row gap-2 text-gray-500">
            {/* if there is no parent this is an endPoint so veracity negates the id */}
            {!parent && <Points points={e.points} onNegate={onNegate(currentEntry.id)} type="veracity" />}
            {/* if there is a parent this is a linkPoint so veracity negates the endPoint.id */}
            {currentEntry.endPoint && 
            <>
              <Points points={e.points} onNegate={onNegate(currentEntry.endPoint!.id)} type="veracity" />
              <Points points={e.points} onNegate={onNegate(currentEntry.id)} type="relevance" />
            </>
            }
          </div>
        </div>
      </summary>
      {children && children.length > 0 && (
        <div className="flex flex-col w-full gap-1 ">
          {children.map((el: any, i: number) => (
            <AccordionComponent
              key={i}
              level={level + 1}
              e={el}
              parent={e.title}
              setHistoricalItems={setHistoricalItems}
              setParentChildren={setChildren}
              threadData={threadData}
            />
          ))}
        </div>
      )}
    </details>
  );
}
