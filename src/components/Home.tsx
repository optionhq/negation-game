// src/pages/index.tsx
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import HistoricalPoints from "@/components/HistoricalPoints";
import { Node } from "@/types/Points";
import axios from "axios";
import { Cast } from "neynar-next/server";
import { getMaybeNegation } from "@/lib/useCasts";
import { BiChevronLeft } from "react-icons/bi";
import RootFeed from "./RootFeed";
import CastButton from "./CastButton";
import { DEFAULT_CHANNELID } from "./constants";

export default function Home() {
  const router = useRouter();

  const [filteredItems, setFilteredItems] = useState<Node[]>([]);
  const [pinnedCasts, setPinnedCasts] = useState<Node[]>([])
  const [historicalPointIds, setHistoricalPointIds] = useState<string[] | undefined>([]);

  const loader = useRef(null);
  const isFetching = useRef(false);
  const feedCursorRef = useRef<string | null>(null);
  const [topic, setTopic] = useState<string | null>(null);

  async function fetchPoints(castIds: string[] | string | null, cursor: string | null, existingPoints: Node[] | null = null)
  // :
  // Promise<{ historicalPointsIds: string[], points: Node[],
  // nextCursor: string | null
  // }> 
  {
    let selectedPoint = null;
    let points: Node[] = [];
    // let nextCursor: string | null = null;

    if (Array.isArray(castIds)) {
      // if it's a history of selected casts, get the first one
      selectedPoint = castIds[0]
      setHistoricalPointIds(castIds.slice(1).reverse());
    } else {
      selectedPoint = castIds
    }

    if (!selectedPoint) {
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
        points.sort((a, b) => b.advocates?.length! - a.advocates?.length!);

      } else {

        // here's the existing feed
        points = existingPoints ? existingPoints : []

        const feed = await axios.get(`/api/feed/${encodeURIComponent(DEFAULT_CHANNELID)}`)

        // nextCursor = feed.data.next?.cursor

        for (const cast of feed.data.casts) {
          if (cast !== null) {
            points.push(await getMaybeNegation(cast))
          }
        }
      }
    } else if (selectedPoint) {
      // if there is a selected cast get the selected cast    
      const cast = await axios.get(`/api/cast?type=hash&identifier=${selectedPoint}`)
      points = [await getMaybeNegation(cast.data as Cast)]
    }

    setFilteredItems(points);

    // return { historicalPointsIds, points
    // , nextCursor
    // }
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

  // get the pinned casts
  const fetchPinnedCasts = async () => {
    const fetchedPinnedCasts: Node[] = [];
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
    console.log("fetching")
    // A fetch operation is already in progress, so we return early
    if (!router.isReady || isFetching.current) return

    isFetching.current = true;

    let ids: string[] = [];
    if (typeof router.query.id === 'string') {
      ids = router.query.id.split(",");
    }

    await fetchPoints(ids || null, feedCursorRef.current);

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
    <main className="flex flex-col text-sm sm:text-base gap-4 my-8">
      {topic && <h2 className="text-lg md:text-xl font-bold text-center mx-4 md:mx-12 p-4 border border-gray-300 bg-white rounded-xl sticky top-20 z-30 shadow-sm">{topic}</h2>}
      {router.query.id && <div
        onClick={() => {
          router.push(router.pathname.includes('spaces') ? `/spaces/${router.query.space}/${router.query.conversation}` : "/");
        }}
        className="flex flex-row py-2 font-medium cursor-pointer w-fit hover:bg-slate-100 rounded-md text-gray-500 centered-element">
        <BiChevronLeft size={20} />
        <p className='px-2'>{router.pathname.includes('spaces') ? `Go back to conversation` : 'Go to Home'}</p>
      </div>}
      {historicalPointIds && historicalPointIds?.length !== 0 && (<HistoricalPoints ids={historicalPointIds} />)}
      <RootFeed
        pinned={true}
        key="pinned"
        data={pinnedCasts}
        setData={setPinnedCasts}
        setHistoricalItems={setHistoricalPointIds}
        refreshThread={fetchItems}
      />
      <RootFeed
        key={Array.isArray(router.query.id) ? router.query.id.join(',') : router.query.id || 'default'}
        data={filteredItems}
        setData={setFilteredItems}
        setHistoricalItems={setHistoricalPointIds}
        refreshThread={fetchItems}
      />
      {!router.query.id && <CastButton conversation={router.query.conversation as string} updateFeed={fetchItems} />}
      {!router.query.id && !router.query.conversation &&
        <div className="loading" ref={loader} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '5vh' }}>
          <h2 style={{ fontSize: '1.5em', color: '#333' }}>Loading...</h2>
        </div>
      }
    </main >
  );
}