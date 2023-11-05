// src/pages/index.tsx
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Accordion from "@/components/Accordion";
import HistoricalPoints from "@/components/HistoricalPoints";
import Login from "@/components/Login";
import { Negation } from "@/types/Points";
import CastComponent from "@/components/Cast";
import axios from "axios";
import { FarcasterSignerContext } from "@/contexts/UserContext";
import NotificationButton from "@/components/notifications/NotificationButton";
import config from "@/config";
import { Cast, Signer } from "neynar-next/server";
import { getMaybeNegation } from "@/lib/useCasts";

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

  async function getHomeItems(castIds: string[] | string | null, cursor: string | null, existingPoints: Negation[] | null = null): Promise<{ historicalPoints: string[], points: Negation[], nextCursor: string | null }> {
    let selectedPoint = null;
    let historicalPoints: string[] = [];
    let points: Negation[] = [];
    let nextCursor: string | null = null;


    if (router.pathname.startsWith('/question/')) {
      const org = router.pathname.split('/')[2] as keyof typeof config.orgs;
      const questionUrls = config.orgs[org]
      
      if (questionUrls) {
        // Fetch the parent casts
        for (const url of Object.values(questionUrls)) {
          const parentCast = await axios.get(`/api/cast?type=url&identifier=${url}`);
          points.push(await getMaybeNegation(parentCast.data as Cast));
        }
      }
    } else if (castIds === null || castIds.length === 0) {
      // if there's no path selected, get the feed

      // here's the existing feed
      points = existingPoints ? existingPoints : []

      const feed = await axios.get(`/api/feed/${encodeURIComponent(config.channelId)}?cursor=${cursor}`)

      nextCursor = feed.data.next?.cursor

      for (const cast of feed.data.casts) {
        if (cast !== null) {
          points.push(await getMaybeNegation(cast))
        }

      }
  
    } else {
      if (Array.isArray(castIds)) {
        // if it's a history of selected casts, get the first one
        selectedPoint = castIds[0]
        historicalPoints = castIds.slice(1)
      } else {
        selectedPoint = castIds
      }
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
  }

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

  const {historicalPoints, points, nextCursor} = await getHomeItems(ids || null, feedCursorRef.current, feed);
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
  }, [router.query.id]);

  const returnToHome = () => {
    setFeed([]);
    router.push({ pathname: '/' });
  };

  return (
    <div>
      <header className="flex justify-end px-6 py-2 gap-6 bg-slate-50 border fixed top-0 w-screen z-40">
        {/* {farcasterSigner && <NotificationButton/>} */}
        <Login setFarcasterSigner={setFarcasterSigner} />
      </header>
      <main className="flex min-h-screen flex-col items-center justify-start p-12 pt-24 px-32">
        {router.query.id && (
          <div className="flex justify-center w-full my-4 px-10">
            <div 
              onClick={returnToHome}
              className="relative justify-between items-center gap-4 font-medium cursor-pointer list-none border border-grey-100 -mt-3 bg-white px-5 py-4 rounded-md w-full h-10"
            >
            </div>
          </div>
        )}
        {historicalPointIds && historicalPointIds?.length !== 0 && (
          <div className="w-full flex px-10">
            <HistoricalPoints 
              ids={historicalPointIds.reverse()} 
              onClick={(id) => {
                const reverseIds = historicalPointIds.reverse()
                const index = reverseIds.indexOf(id);
                const newIds = reverseIds.slice(index);
                router.push({
                  pathname: router.pathname,
                  query: { ...router.query, id: newIds.join(',') },
                });
              }}
            />
          </div>
        )}
        <FarcasterSignerContext.Provider value={{ farcasterSigner: farcasterSigner, setFarcasterUser: setFarcasterSigner }}>
          {!router.query.id && pinnedCasts.length > 0 && (
            <>
            <div className="w-full flex-grow bg-light-gold p-10 pt-2 rounded-xl">
              <h2 className="text-center pb-2">Pinned conversations</h2>
              <div className="w-full">
                <Accordion 
                  key="pinned"
                  data={pinnedCasts}
                  level={0} 
                  setHistoricalItems={setHistoricalPointIds} 
                  refreshThread={fetchItems}
                />
              </div>
            </div>
            <hr className="my-2" />
            </>
          )}
          
          <div className="w-full flex-grow px-10">
            <Accordion 
              key={`${Array.isArray(router.query.id) ? router.query.id.join(',') : router.query.id || 'default'}-${Date.now()}`}
              data={filteredItems} 
              level={0} 
              setHistoricalItems={setHistoricalPointIds} 
              refreshThread={fetchItems}
            />
          </div>
        </FarcasterSignerContext.Provider>
        {farcasterSigner && <CastComponent farcasterSigner={farcasterSigner} reloadThreads={fetchItems} />}
      </main>
      {!router.query.id &&
        <div className="loading" ref={loader} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '5vh' }}>
          <h2 style={{ fontSize: '1.5em', color: '#333' }}>Loading...</h2>
        </div>
      }
    </div>
  );
}
