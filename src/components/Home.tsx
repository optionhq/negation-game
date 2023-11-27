// src/pages/index.tsx
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Feed from "@/components/Feed";
import HistoricalPoints from "@/components/HistoricalPoints";
import { Negation } from "@/types/Points";
import CastComponent from "@/components/Cast";
import axios from "axios";
import { FarcasterSignerContext } from "@/contexts/UserContext";
import { DEFAULT_CHANNELID } from "@/components/constants"
import { Cast, Signer } from "neynar-next/server";
import { getMaybeNegation } from "@/lib/useCasts";
import { BiChevronLeft } from "react-icons/bi";
import { AiOutlinePushpin } from "react-icons/ai";
import { GoListUnordered } from 'react-icons/go';

export default function Home() {
  const router = useRouter();

  const [filteredItems, setFilteredItems] = useState<Negation[]>([]);
  const [feed, setFeed] = useState<Negation[]>([]);
  const [pinnedCasts, setPinnedCasts] = useState<Negation[]>([])
  const [historicalPointIds, setHistoricalPointIds] = useState<string[] | undefined>([]);
  const [farcasterSigner, setFarcasterSigner] = useState<Signer | null>(null);
  const loader = useRef(null);
  const isFetching = useRef(false);
  const feedCursorRef = useRef<string | null>(null);
  const [topic, setTopic] = useState<string | null>(null);

  async function getHomeItems(castIds: string[] | string | null, cursor: string | null, existingPoints: Negation[] | null = null): Promise<{ historicalPoints: string[], points: Negation[], nextCursor: string | null }> {
    let selectedPoint = null;
    let historicalPoints: string[] = [];
    let points: Negation[] = [];
    let nextCursor: string | null = null;

    if (Array.isArray(castIds)) {
      // if it's a history of selected casts, get the first one
      selectedPoint = castIds[0]
      historicalPoints = castIds.slice(1)
    } else {
      selectedPoint = castIds
    }

    if (castIds === null || castIds.length === 0) {
      // if there's no path selected, get the feed

      if (router.pathname.includes('/spaces/')) {
        // if this is a space, fetch the direct responses to the cast of interest
        const castId = selectedPoint ? selectedPoint : router.query.conversation as string;
        const response = await axios.get(`/api/cast/${castId}/thread`);
        for (const cast of response.data.result.casts) {
          const point = await getMaybeNegation(cast);
          if (point.parentId === castId) {
            points.push(point);
          }
        }
        points.sort((a, b) => b.advocates?.length - a.advocates?.length);

      } else {

        // here's the existing feed
        points = existingPoints ? existingPoints : []

        const feed = await axios.get(`/api/feed/${encodeURIComponent(DEFAULT_CHANNELID)}?cursor=${cursor}`)

        nextCursor = feed.data.next?.cursor

        for (const cast of feed.data.casts) {
          if (cast !== null) {
            points.push(await getMaybeNegation(cast))
          }

        }
      }
    } else {
      // get the selected cast    
      const cast = await axios.get(`/api/cast?type=hash&identifier=${selectedPoint}`)
      points = [await getMaybeNegation(cast.data as Cast)]
    }

    return { historicalPoints, points, nextCursor }
  }

  useEffect(() => {
    var options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    };

    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current)
    }
  }, [router.isReady, router.query.id]);

  const handleObserver: IntersectionObserverCallback = (entities, observer) => {
    const target = entities[0];
    if (target.isIntersecting) {
      // Fetch the next set of casts here
      fetchItems();
    }
  }

  const fetchPinnedCasts = async () => {
    // get the pinned casts
    const fetchedPinnedCasts: Negation[] = [];
    const pinnedHashes = process.env.NEXT_PUBLIC_PINNED?.split(',');
    if (pinnedHashes) {
      for (const hash of pinnedHashes) {
        const cast = await axios.get(`/api/cast?type=hash&identifier=${hash.trim()}`);
        fetchedPinnedCasts.push(await getMaybeNegation(cast.data as Cast));
      }
    }
    setPinnedCasts(fetchedPinnedCasts); // Set the pinned casts
  };

  const fetchItems = async () => {
    if (!router.isReady || isFetching.current) {
      // A fetch operation is already in progress, so we return early
      return;
    }

    isFetching.current = true;

    let ids: string[] = [];
    if (typeof router.query.id === 'string') {
      ids = router.query.id.split(",");
    }

    const { historicalPoints, points, nextCursor } = await getHomeItems(ids || null, feedCursorRef.current, feed);
    feedCursorRef.current = nextCursor;
    setFilteredItems(points);
    // we set feed if we haven't selected any ids, then we pass feed to getHomeItems
    if (ids.length === 0) {
      setFeed(points);
    }
    setHistoricalPointIds(historicalPoints);

    isFetching.current = false;
  };

  useEffect(() => {
    fetchPinnedCasts();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [router.query.id, router.query.conversation]);

  useEffect(() => {
    if (router.pathname.includes('spaces') && typeof router.query.conversation === 'string') {
      axios.get(`/api/cast?type=hash&identifier=${router.query.conversation}`)
        .then(response => setTopic(response.data.text))
        .catch(error => console.error(error));
    }
  }, [router.pathname, router.query.id, router.query.conversation]);

  return (
    <div>
      <div className="mt-5"></div> 
      {topic && <h2 className="text-xl font-bold text-center w-3/5 mx-auto p-4 border border-gray-300 rounded-xl">{topic}</h2>}
      <main className="flex min-h-screen flex-col text-sm sm:text-base gap-1">
        {router.query.id && <div
          onClick={() => {
            if (router.pathname.includes('spaces')) {
              router.push(`/spaces/${router.query.space}/${router.query.conversation}`);
            } else {
              router.push('/');
            }
            setFeed([]);
          }}
          className="flex flex-row py-2 font-medium cursor-pointer w-fit hover:bg-slate-100 rounded-md text-gray-500 centered-element">
          <BiChevronLeft size={20} />
          <p className='px-2'>{router.pathname.includes('spaces') ? `Go back to conversation` : 'Go to Home'}</p>
        </div>}
        {historicalPointIds && historicalPointIds?.length !== 0 && (<HistoricalPoints ids={historicalPointIds.reverse()} />)}
        <FarcasterSignerContext.Provider value={{ farcasterSigner: farcasterSigner, setFarcasterUser: setFarcasterSigner }}>
          {!router.query.id && !router.query.conversation && pinnedCasts.length > 0 && (
            <div>
              <div className="flex flex-row gap-2 pb-3 items-center centered-element">
                <AiOutlinePushpin size={20} />
                <h2 className="font-semibold">Starting points</h2>
              </div>
              <Feed
                key="pinned"
                data={pinnedCasts}
                level={0}
                setHistoricalItems={setHistoricalPointIds}
                refreshThread={fetchItems}
              />
            </div>
          )}
          <div>
            {!router.query.id && !router.query.conversation && pinnedCasts.length > 0 &&
              <div className="flex flex-row gap-2 pb-3 items-center centered-element pt-24">
                <GoListUnordered size={20} />
                <h2 className="font-semibold">All points</h2>
              </div>
            }
            <Feed
              key={Array.isArray(router.query.id) ? router.query.id.join(',') : router.query.id || 'default'}
              data={filteredItems}
              level={0}
              setHistoricalItems={setHistoricalPointIds}
              refreshThread={fetchItems}
            />
          </div>
          <CastComponent conversationId={router.query.conversation} reloadThreads={fetchItems} />
        </FarcasterSignerContext.Provider >
      </main >
      {!router.query.id && !router.query.conversation &&
        <div className="loading" ref={loader} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '5vh' }}>
          <h2 style={{ fontSize: '1.5em', color: '#333' }}>Loading...</h2>
        </div>
      }
    </div >
  );
}