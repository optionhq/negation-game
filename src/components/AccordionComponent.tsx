import axios from "axios";
import { useSearchParams, useRouter as oldRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Score, Accordion, ExternalLink, Arrow, InputComponent } from "@/components";
import { Point, Negation } from "@/types/Points";
import RecastedComponent from "./RecastedComponent";
import ProfilePreview from "./ProfilePreview";
import { extractLink } from "@/lib/extractLink";
import { useFarcasterSigner } from "@/contexts/UserContext";
import { negate } from "@/lib/negate";
import isNegation from "@/lib/isNegation";
import Negations from "./Negations";
import { GoUnlink, GoCircleSlash } from "react-icons/go";
import { Cast, User } from "neynar-next/server";
import { castToPoint, castToNegation } from "@/lib/useCasts";
import { useRouter } from "next/router";
import TripleDotMenu from './TripleDotMenu';
import { GoInfo } from "react-icons/go";

export default function AccordionComponent({
  level,
  e,
  parent,
  setParentChildren,
  setHistoricalItems,
  threadData,
  refreshParentThread,
  getParentAncestry,
}: {
  level: number;
  e: Negation;
  parent: Negation | undefined;
  setParentChildren: any;
  setHistoricalItems: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  threadData: any;
  refreshParentThread: () => Promise<void>;
  getParentAncestry: undefined | (() => string);
}) {
  const [veracityNegations, setVeracityNegations] = useState<any[]>(e.children || []);
  const [relevanceNegations, setRelevanceNegations] = useState<any[]>(e.children || []);
  const [isDropdownClicked, setIsDropdownClicked] = useState<boolean>(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [detailsOpened, setDetailsOpened] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { text, link } = extractLink(e.title);
  const { farcasterSigner, setFarcasterUser } = useFarcasterSigner();
  const [childrenLoading, setChildrenLoading] = useState(false);
  const [isTripleDotOpen, setTripleDotMenu] = useState(false);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);



  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // let INDENTATION_PX = 25
  let INDENTATION_PX = windowWidth > 768 ? 25 : 15;
  if (windowWidth > 1024) {
    INDENTATION_PX = 30;
  } else if (windowWidth < 480) {
    INDENTATION_PX = 10;
  }



  const getNegations = async (point: Negation) => {
    const { data: { result: { casts } } } = await axios.get(`/api/cast/${point.id}/thread`);

    const negations: Negation[] = [];
    for (const cast of casts) {
      const possibleNegation = castToNegation(cast);
      if (possibleNegation.parentId === point.id && possibleNegation.endPointUrl) {
        const res = await axios.get(`/api/cast?type=url&identifier=${possibleNegation.endPointUrl}`);

        const cast: Cast = res.data;
        const endPoint: Point = castToPoint(cast)

        possibleNegation.endPoint = endPoint;
        // it's now a negation
        const negation = possibleNegation;
        negations.push(negation);
      }
    }

    return negations;
  };

  const updateNegationsInPlace = async (
    setNegations: React.Dispatch<React.SetStateAction<Negation[]>>,
    getNegationsFor: () => Promise<Negation[]>
  ) => {
    const newNegations = await getNegationsFor();
    setNegations(prevNegations => {
      // Preserve any existing input box
      const inputBox = prevNegations?.find(negation => negation.type === "input");

      // Negations in newNegations that are also in prevNegations
      const toKeep = prevNegations ? prevNegations.filter(prevNegation =>
        newNegations.some(negation => negation.id === prevNegation.id)
      ) : [];

      // Negations in newNegations that are not in prevNegations
      const toAdd = newNegations.filter(negation =>
        !prevNegations?.some(prevNegation => prevNegation.id === negation.id)
      );

      // Sort the negations by points (relevance), then by endPoint.points (veracity)
      const sortedNegations = [...toKeep, ...toAdd].sort((a, b) => {
        if (b.points !== a.points) {
          return b.points - a.points;
        } else if (a.endPoint && b.endPoint) {
          return b.endPoint.points - a.endPoint.points;
        } else {
          return 0;
        }
      });

      // If there's an input box, add it to the start of the new state
      if (inputBox) {
        return [inputBox, ...sortedNegations];
      } else {
        return sortedNegations;
      }
    });
  };

  const unfurlDropdown = async () => {
    setChildrenLoading(true);

    if (isNegation(e)) {
      await updateNegationsInPlace(setRelevanceNegations, () => getNegations(e));
      if (e.endPoint) {
        await updateNegationsInPlace(setVeracityNegations, () => getNegations(e.endPoint!));
      }
    } else {
      await updateNegationsInPlace(setVeracityNegations, () => getNegations(e));
    }

    setChildrenLoading(false);
  };

  useEffect(() => {
    if (detailsOpened && e.type !== "input") {
      unfurlDropdown();
    }
  }, [detailsOpened, e]);

  const onNegate = (pointId: string, negationType: 'relevance' | 'veracity') => (e: React.MouseEvent<HTMLSpanElement | React.MouseEvent>) => {

    // Open the details if they're not already open
    if (!detailsOpened) {
      setIsDropdownClicked(true)
      setDetailsOpened(true);
    }

    const setNegations = negationType === 'relevance' ? setRelevanceNegations : setVeracityNegations;

    // add it if there isn't already one in there
    setNegations(prevNegations => {
      // Check if there's already an input element in the array
      const hasInput = prevNegations?.some(negation => negation.type === "input");

      // If there's already an input element, return the previous state
      if (hasInput) {
        return prevNegations;
      }

      // If there's no input element, add one
      return [...(prevNegations || []), { type: "input", parentId: pointId, kind: negationType }];
    });

  };

  function removeInput() {
    if (!parent) return;

    setParentChildren((element: any) => {
      let filtered = element.filter((child: any) => child.type !== "input");
      return filtered.length ? filtered : null;
    });
  }

  const paddingLeft = `${0}px`;
  const pointBg = `${level % 2 ? " bg-indigo-25 " : " bg-slate-50 "}`;

  function getAncestry(): string {
    // Call the parent's getAncestry function if it exists
    const parentAncestry = parent && getParentAncestry ? getParentAncestry() : '';

    // Return the current component's ID followed by the parent's ancestry
    return parentAncestry ? `${e.id},${parentAncestry}` : e.id;
  }

  function newRoute() {
    const ancestry = getAncestry().split(',');
    const current = searchParams.get("id");
    const currentIds = current ? current.split(',') : [];
  
    // Find the first ancestor that is already in the path
    const commonAncestorIndex = ancestry.findIndex(ancestor => ancestor === currentIds[0]);
  
    // If the first ancestor is already in the path, do nothing
    if (commonAncestorIndex === 0) {
      return;
    }
  
    // Prepend the missing ancestors to the path
    const missingAncestors = commonAncestorIndex > 0 ? ancestry.slice(0, commonAncestorIndex).join(',') : ancestry.join(',');
    const route = current ? `${missingAncestors},${current}` : missingAncestors;
  
    // Check if space and conversation parameters exist
    if (router.query.space && router.query.conversation) {
      router.push({
        pathname: `/spaces/${router.query.space}/${router.query.conversation}`,
        query: { id: route }
      });
    } else {
      router.push({
        pathname: '/',
        query: { id: route }
      });
    }
  }

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    newRoute();
  }

  const handleArrowClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownClicked(prevState => !prevState)
    await unfurlDropdown();
    setDetailsOpened(prevState => !prevState);
  };

  useEffect(() => {
    const selectedIds = typeof router.query.id === 'string' ? router.query.id.split(',') : [router.query.id];
    const selectedId = selectedIds[0];
    if (selectedId === e.id) {
      setIsDropdownClicked(true);
      setDetailsOpened(true);
    } else {
      setIsDropdownClicked(false);
      setDetailsOpened(false);
    }
  }, [router.query.id, e.id]);

  const onPublishNegation = async (text: string) => {
    if (!farcasterSigner) {
      window.alert("Must be logged in to publish. farcasterUser is null");
      return;
    }
    const parentId = e.parentId!;
    const negation = await negate({ text, parentId, farcasterSigner });
    removeInput();
    // @ts-ignore
    refreshParentThread()
  };

  //@ts-ignore
  if (e.type === "input")
    return (
      <InputComponent
        pointBg={pointBg}
        placeHolder={"This point `" + (parent?.endPoint ? parent?.endPoint.title : parent?.title) + "` is not " + (e?.kind === "relevance" ? "relevant" : "true") + " because ..."}
        onCancel={removeInput}
        onPublish={onPublishNegation}
      />
    );
  return (
    <details
      open={detailsOpened}
      className="flex flex-col gap-1"
    >
      <summary
        onClick={(e) => {
          // Toggle the details
          setDetailsOpened(prevState => !prevState);
        }}
        className={
          pointBg +
          `claim relative border cursor-pointer ${level % 2 === 0 ? "hover:bg-gray-100" : "hover:bg-indigo-50"}`
        }
      >
        <div className="flex flex-col  md:gap-2">
          <div
            className={`py-1 rounded-md ${e.replyCount > 0 || (e.endPoint && e.endPoint?.replyCount > 0) ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            onClick={handleArrowClick}>
            <div
              className={`p-1 rounded-lg hover:bg-gray-200`}>
              <div className={`transition transform ${isDropdownClicked ? "rotate-90" : ""}`}>
                <Arrow />
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex flex-col gap-3 items-start justify-center w-full"
          onClick={handleClick}
        >
          {/* <ProfilePreview user={e.author!}/> */}
          <p className="w-full text-ellipsis">
            {e.endPoint && isNegation(e) && e.endPoint.title}
          </p>
          {!e.endPoint && (
            <div className=" overflow-hidden text-ellipsis w-full table table-fixed">
              <p className=" text-ellipsis table-cell">{e.title}</p>

              {link && <RecastedComponent url={link} />}
            </div>
          )}
          {/* <hr className="w-full h-[2px] bg-slate-400"/> */}
          <div className="flex flex-row gap-2 text-gray-500">
            {/* if there is no parent this is an endPoint so veracity negates the id */}
            {e.endPoint && (
              <>
                <Score id={e.endPoint!.id} points={e.endPoint.points} onNegate={onNegate(e.endPoint.id, 'veracity')} type="veracity" advocates={e.endPoint.advocates} farcasterSigner={farcasterSigner} />
                <Score id={e.id} points={e.points} onNegate={onNegate(e.id, 'relevance')} type="relevance" advocates={e.advocates} farcasterSigner={farcasterSigner} />
              </>
            ) ||
              <Score id={e.id} points={e.points} onNegate={onNegate(e.id, 'veracity')} type="veracity" advocates={e.advocates} farcasterSigner={farcasterSigner} />
            }
          </div>
        </div>
        <TripleDotMenu
          isTripleDotOpen={isTripleDotOpen}
          setTripleDotMenu={setTripleDotMenu}
          farcasterSigner={farcasterSigner}
          e={e}
          refreshParentThread={refreshParentThread}
        />
      </summary>
      {relevanceNegations && relevanceNegations.length > 0 && (
        <div className="border-black pl-3 border-l my-2 flex flex-col gap-2" style={{ marginLeft: INDENTATION_PX }}>
          <div className="flex flex-row gap-2 pt-3 pl-2 pb-2 items-center font-semibold text-gray-400">
            <GoUnlink size={18} color="#AAAAAA" />
            <p>Doesn&lsquo;t matter</p>
            <button onClick={() => window.open('https://responses.negationgame.com/', '_blank')}>
              <GoInfo size={18} color="#AAAAAA" />
            </button>
          </div>

          <Negations
            negations={relevanceNegations}
            level={level}
            parent={e}
            setHistoricalItems={setHistoricalItems}
            setParentChildren={setRelevanceNegations}
            threadData={threadData}
            negationType="relevance"
            refreshParentThread={unfurlDropdown}
            getParentAncestry={getAncestry}
          />
        </div>
      )}
      {veracityNegations && veracityNegations.length > 0 && (
        <div className="border-black pl-3 border-l  my-2 flex flex-col gap-2" style={{ marginLeft: INDENTATION_PX }}>
          <div className="flex flex-row gap-2 pt-3 pl-2 pb-2 items-center font-semibold text-gray-400">
            <GoCircleSlash size={18} color="#AAAAAA" />
            <p>Not true</p>
            <button onClick={() => window.open('https://responses.negationgame.com/', '_blank')}>
              <GoInfo size={18} color="#AAAAAA" />
            </button>
          </div>
          <Negations
            negations={veracityNegations}
            level={level}
            parent={e}
            setHistoricalItems={setHistoricalItems}
            setParentChildren={setVeracityNegations}
            threadData={threadData}
            negationType="veracity"
            refreshParentThread={unfurlDropdown}
            getParentAncestry={getAncestry}
          />
        </div>
      )}
      {childrenLoading && <div className="border w-full p-4 flex items-center justify-center">Loading...</div>}
    </details>
  );
}
