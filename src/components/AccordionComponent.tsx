import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Points, Accordion, ExternalLink, Arrow, InputComponent } from "@/components";
import { EndPointsTree, LinkPointsTree, User } from "@/types/PointsTree";
import RecastedComponent from "./RecastedComponent";
import ProfilePreview from "./ProfilePreview";
import { extractEndPointUrl } from "@/lib/useEndPoints";
import { extractLink } from "@/lib/extractLink";
import { useFarcasterUser } from "@/contexts/UserContext";
import { negate } from "@/lib/negate";
import isNegation from "@/lib/isNegation";
import Negations from "./Negations";
import { GoUnlink, GoCircleSlash } from "react-icons/go";
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
  const [veracityNegations, setVeracityNegations] = useState<any[]>(e.children || []);
  const [relevanceNegations, setRelevanceNegations] = useState<any[]>(e.children || []);
  const [isDropdownClicked, setIsDropdownClicked] = useState<boolean>(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [detailsOpened, setDetailsOpened] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentEntry, setCurrentEntry] = useState<LinkPointsTree>(e);
  const { text, link } = extractLink(e.title); // can remove
  const { farcasterUser, setFarcasterUser } = useFarcasterUser();
  const [childrenLoading, setChildrenLoading] = useState(false);

  useEffect(() => {
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

    if (isDropdownClicked) {
      unfurlDropdown();
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

  const getNegations = async (point: LinkPointsTree) => {
    const res = await fetch(`/api/thread?id=${point.id}`);
    const threadData: ThreadEntry[] = await res.json();

    const negations: LinkPointsTree[] = [];
    for (const cast of threadData) {
      const possibleNegation = responseToLinkPointsTree(cast);
      if (possibleNegation.parentId === point.id && possibleNegation.endPointUrl) {
        const res = await fetch(`/api/endpoint?endPointUrl=${possibleNegation.endPointUrl}`);
        const endPoint: EndPointsTree = await res.json();
        possibleNegation.endPoint = endPoint;
        // it's now a negation
        const negation = possibleNegation;
        negations.push(negation);
      }
    }

    return negations;
  };

  const unfurlDropdown = async () => {
    setChildrenLoading(true);
    const relevanceNegations = await getNegations(e);

    setRelevanceNegations(relevanceNegations);

    if (e.endPoint) {
      const veracityNegations = await getNegations(e.endPoint);
      console.log("fallacies", veracityNegations);
      setVeracityNegations(veracityNegations);
    }
    setChildrenLoading(false);
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
      window.alert("You must be logged in to Negate.")
      return
    }
    if (!detailsRef.current) return;
    detailsRef.current.open = true;
    setDetailsOpened(detailsRef.current.open);

    if (relevanceNegations == null) {
      setRelevanceNegations([{ type: "input" }]);
      return;
    }
    // Check if children already contains an object with type: "input"
    else if (!relevanceNegations.some((child) => child.type === "input")) {
      var _children = [...relevanceNegations, { type: "input", parentId: pointId }];
      setRelevanceNegations(_children);
    }
  };

  function removeInput() {
    if (!parent) return;

    setParentChildren((element: any) => {
      let filtered = element.filter((child: any) => child.type !== "input");
      return filtered.length ? filtered : null;
    });
  }

  const paddingLeft = `${0}px`;
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

  const onPublishNegation = async (text: string) => {
    if (!farcasterUser) {
      window.alert("Must be logged in to publish. farcasterUser is null");
      return;
    }
    const parentId = e.parentId!;
    const negation = await negate({ text, parentId, farcasterUser });
    removeInput();
  };

  //@ts-ignore
  if (e.type === "input")
    return (
      <InputComponent
        pointBg={pointBg}
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
        className={
          pointBg +
          `claim relative border ${e.replyCount || (e.endPoint && e.endPoint?.replyCount > 0) ? "cursor-pointer" : ""}`
        }
        // style={{ paddingLeft: paddingLeft }}
      >
        <div className="flex flex-col gap-2">
          <div
            className={`p-1 rounded-md ${
              e.replyCount > 0 || (e.endPoint && e.endPoint?.replyCount > 0) ? "opacity-100" : "opacity-0"
            }`}>
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
            {currentEntry.endPoint && isNegation(currentEntry) && currentEntry.endPoint.title}
          </span>
          {!currentEntry.endPoint && (
            <>
              {currentEntry.title}
              {link && <RecastedComponent url={link} />}
            </>
          )}
          {/* <hr className="w-full h-[2px] bg-slate-400"/> */}
          <div className="flex flex-row gap-2 text-gray-500">
            {/* if there is no parent this is an endPoint so veracity negates the id */}
            {!parent && <Points points={e.points} onNegate={onNegate(currentEntry.id)} type="veracity" />}
            {/* if there is a parent this is a linkPoint so veracity negates the endPoint.id */}
            {currentEntry.endPoint && (
              <>
                <Points points={e.points} onNegate={onNegate(currentEntry.endPoint!.id)} type="veracity" />
                <Points points={e.points} onNegate={onNegate(currentEntry.id)} type="relevance" />
              </>
            )}
          </div>
        </div>
      </summary>
      {childrenLoading && <div className="border w-full p-4 flex items-center justify-center">Loading...</div>}
      {relevanceNegations && relevanceNegations.length > 0 && (
        <div className=" border-black p-2 border-l  my-3 flex flex-col gap-3" style={{ marginLeft: INDENTATION_PX }}>
          <div className="flex flex-row gap-2 p-2 items-center font-semibold text-gray-400">
            <GoUnlink size={20} color="#AAAAAA" />
            <p>Not relevant</p>
          </div>

          <Negations
            negations={relevanceNegations}
            level={level}
            parentTitle={e.title}
            setHistoricalItems={setHistoricalItems}
            setParentChildren={setRelevanceNegations}
            threadData={threadData}
            negationType="relevance"
          />
        </div>
      )}
      {veracityNegations && veracityNegations.length > 0 && (
        <div className="border-black p-2 border-l  my-3 flex flex-col gap-3" style={{ marginLeft: INDENTATION_PX }}>
          <div className="flex flex-row gap-2 p-2 items-center font-semibold text-gray-400">
            <GoCircleSlash size={20} color="#AAAAAA" />
            <p>Not true</p>
          </div>
          <Negations
            negations={veracityNegations}
            level={level}
            parentTitle={e.title}
            setHistoricalItems={setHistoricalItems}
            setParentChildren={setVeracityNegations}
            threadData={threadData}
            negationType="veracity"
          />
        </div>
      )}
    </details>
  );
}
