import axios from 'axios';
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Points, Accordion, ExternalLink, Arrow, InputComponent } from "@/components";
import { EndPointsTree, LinkPointsTree } from '@/types/PointsTree';
import { extractEndPointUrl } from '@/hooks/useEndPoints';

const INDENTATION_PX = 25;

type ThreadEntry = {
  text: string;
  hash: string;
  parentHash?: string;
  reactions: any[];
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
  e: any;
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



  useEffect(() => {
    const responseToLinkPointsTree = (response: ThreadEntry): EndPointsTree | LinkPointsTree => {
      return {
        title: response.text,
        id: response.hash,
        parentId: response.parentHash,
        points: response.reactions.length,
        replyCount: response.replies.count,
        children: [],
      };
    };

    const responseToEndPointsTree = (response: ThreadEntry): EndPointsTree => {
      return {
        title: response.text,
        id: response.hash,
        parentId: response.parentHash,
        points: response.reactions.length,
        replyCount: response.replies.count,
        children: [],
      };
    };

    const fetchThreadData = async () => {
      const res = await fetch(`/api/thread?id=${e.id}`);
      const threadData: ThreadEntry[] = await res.json();
    
      // Create a map of entries by their hash
      const entriesByHash: Map<string, LinkPointsTree> = new Map(
        threadData.map((entry: ThreadEntry) => [
          entry.hash, 
          responseToLinkPointsTree(entry)
        ])
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
            if (childEntry && !parentEntry.children.some(child => child.id === childEntry.id)) {
              parentEntry.children.push(childEntry);
            }
          }
        }
      });
    
      // Set the endPoint property for each LinkingPointsTree that has a parent
      for (const [hash, entry] of entriesByHash) {
        if (entry.parentId) {
          const endPointUrl = extractEndPointUrl(entry);
          if (endPointUrl) {
            const endPointResponse = await fetch(`/api/endpoint?endPointUrl=${endPointUrl}`);
            const endPointData: ThreadEntry = await endPointResponse.json();
            entry.endPoint = responseToEndPointsTree(endPointData);
          }
        }
      }
    
      // Update the children of the current point
      const currentPoint = entriesByHash.get(e.id);
      if (currentPoint) {
        setChildren(currentPoint.children || []);
      }
    };
    
    if (isDropdownClicked) {
      fetchThreadData();
    }
  }, [isDropdownClicked]);

  function expandDetails() {
    if (!detailsRef.current) return;
    detailsRef.current.open = !detailsRef.current.open;
    setDetailsOpened(detailsRef.current.open);
    if (detailsRef.current.open) {
      setIsDropdownClicked(true);
    }
  }

  const onNegate = (e: React.MouseEvent<HTMLSpanElement | React.MouseEvent>) => {
    if (!detailsRef.current) return;
    detailsRef.current.open = true;
    setDetailsOpened(detailsRef.current.open);
    var _children = children;
    if (_children) _children.push({ type: "input" });
    else _children = new Array({ type: "input" });
    _children.map((e: any) => console.log(e));
    setChildren(_children);
  };

  function removeInput() {
    if (!parent) return;

    setParentChildren((element: any) => {
      let filtered = element.filter((child: any) => child.type !== "input");
      return filtered.length ? filtered : null;
    });
  }

  const paddingLeft = `${INDENTATION_PX * level + 6}px`;
  const pointBg = `${level % 2 ? "bg-slate-200" : " bg-slate-100"}`;

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

  if (e.type === "input")
    return <InputComponent pointBg={pointBg} paddingLeft={paddingLeft} parent={parent!} removeInput={removeInput} />;

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
        className={pointBg + " claim relative"}
        style={{ paddingLeft: paddingLeft }}>
        <div className="flex flex-col gap-2">
          <div className={`p-1 rounded-md ${e.replyCount > 0 ? "opacity-100" : "opacity-0"}`}>
            <div className={`transition w-full h-full ${detailsOpened ? "rotate-90" : "rotate-0"}`}>
              <Arrow />
            </div>
          </div>
          {parent && <div className="w-[1px] h-24 bg-black absolute -top-14 left-0 z-40" style={{marginLeft: `${22 + (INDENTATION_PX * (level -1))}px`}}></div>}
        </div>
        <div className="flex flex-col gap-1 items-start justify-center">
          <span className="w-full"> {e.title}</span>
          <div className="flex flex-row gap-0 text-gray-500">
            <Points points={e.points} onNegate={onNegate} type="like" />
            {parent && <Points points={e.points} onNegate={onNegate} type="relevance" />}
            <ExternalLink />
          </div>
        </div>
      </summary>
      {children && children.length && (
        <div className="flex flex-col w-full gap-1 ">
          {children?.map((el: any, i: number) => (
            <AccordionComponent
              key={i}
              level={level + 1}
              e={el}
              parent={e.title}
              setHistoricalItems={setHistoricalItems}
              setParentChildren={setChildren}
              threadData={threadData} // add this line
            />
          ))}
        </div>
      )}
    </details>
  );
}