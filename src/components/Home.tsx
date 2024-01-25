'use client'
// src/pages/index.tsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import HistoricalPoints from "./HistoricalPoints";
import { Node } from "../types/Points";
import axios from "axios";
import { Cast } from "neynar-next/server";
import { getMaybeNegation } from "../lib/useCasts";
import { BiChevronLeft } from "react-icons/bi";
import RootFeed from "./RootFeed";
import CastButton from "./CastButton";
import { DEFAULT_CHANNELID } from "../constants";

export default function Home() {
  const router = useRouter();
  const [points, setPoints] = useState<Node[]>([]);
  const [pinnedPoints, setPinnedPoints] = useState<Node[]>([])
  const [historicalPointIds, setHistoricalPointIds] = useState<string[] | undefined>([]);

  const loader = useRef(null);
  const isFetching = useRef(false);
  const feedCursorRef = useRef<string | undefined>();
  const [topic, setTopic] = useState<string | null>(null);
  const [observer, setObserver] = useState<IntersectionObserver>()

  async function fetchFeed({ limit, cursor }: { limit: number, existingPoints?: Node[], cursor?: string }) {
    let points: Node[] = []

    const url = `/api/feed/${encodeURIComponent(DEFAULT_CHANNELID)}?limit=${limit}${cursor !== undefined ? `&cursor=${cursor}`: ""}`
    const feed = await axios.get(url)

    if (!feed.data.casts) return
    for (const cast of feed.data.casts) {
      if (cast !== null) {
        points.push(await getMaybeNegation(cast))
      }
    }
    return { points, cursor: feed.data.next?.cursor }
  }

  async function fetchThread(pointId: string) {
    let points: Node[] = [];

    const response = await axios.get(`/api/cast/${pointId}/thread`);
    for (const cast of response.data.result.casts) {
      const point = await getMaybeNegation(cast);
      if (point.parentId === pointId) {
        points.push(point);
      }
    }
    points.sort((a, b) => b.advocates?.length! - a.advocates?.length!);

    return points
  }

  async function fetchPoint(pointId: string) {
    let points: Node[] = [];

    const cast = await axios.get(`/api/cast?type=hash&identifier=${pointId}`)
    points = [await getMaybeNegation(cast.data as Cast)]

    return points
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
    setPinnedPoints(fetchedPinnedCasts); // Set the pinned casts
  };

  const getSelectedPoints = () => {
    const ids_string = router.query.id;
    let ids;

    if (!ids_string) {
      setHistoricalPointIds(undefined);
      return
    }
    if (typeof ids_string === 'string') {
      ids = ids_string.split(",");
    }
    if (Array.isArray(ids)) {
      // if it's a history of selected casts, get the first one
      setHistoricalPointIds(ids.slice(1));
      return ids[0]
    }
    return ids
  }

  const fetchItems = useCallback(async ({ onlyReload = false, number }: { onlyReload?: boolean, number?: number | undefined } = {}) => {
    // A fetch operation is already in progress, so we return early
    if (!router.isReady || isFetching.current) return
    isFetching.current = true;

    let selectedPoint = getSelectedPoints()
    let _points: Node[] = [];


    if (selectedPoint)
      // if there's a point selected, only get its thread
      _points = await fetchPoint(selectedPoint)
    else if (!selectedPoint) {
      // if there's no path selected, get the feed
      if (router.pathname.includes('/spaces/')) {
        //if we're in a space, get the thread of the conversation
        _points = await fetchThread(router.query.conversation as string)
      } else {
        // else get the default feed
        const cursor = !onlyReload ? feedCursorRef.current : undefined;
        const feedResult = await fetchFeed({ limit: number || 25, cursor: cursor });
        if (feedResult) {
          _points = feedResult.points;
          if (!onlyReload)
            feedCursorRef.current = feedResult.cursor
        }
      }
    }
    setPoints(prev => onlyReload ? [..._points] : [...prev, ..._points]);
    isFetching.current = false;
  }, [router.isReady, isFetching.current, points, feedCursorRef, router.query.conversation, router.query.id]);

  const refreshItems = useCallback(async () => fetchItems({ onlyReload: true }), [points, setPoints, router, isFetching.current, fetchFeed, fetchThread, router.query])

  const handleObserver: IntersectionObserverCallback = (entities) => {
    const target = entities[0];
    if (target.isIntersecting) fetchItems()
  }

  useEffect(() => {
    setPoints([])
    feedCursorRef.current = undefined
    setHistoricalPointIds(undefined)
    if (!router.query.id && !router.query.conversation) {
      fetchPinnedCasts();

      var options = { root: null, rootMargin: "20px", threshold: 1.0 }
      let _observer = new IntersectionObserver(handleObserver, options);
      setObserver(_observer)
      if (loader.current)
        _observer?.observe(loader.current)
    }
    if (router.pathname.includes('spaces') && typeof router.query.conversation === 'string') {
      axios.get(`/api/cast?type=hash&identifier=${router.query.conversation}`)
        .then(response => setTopic(response.data.text))
        .catch(error => console.error(error));
    }
    else if (router.query.conversation || router.query.id) (
      observer?.disconnect()
    )
    fetchItems();

  }, [router.query.id, router.pathname, router.query.conversation]);

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
        data={pinnedPoints}
        setData={setPinnedPoints}
        setHistoricalItems={setHistoricalPointIds}
        refreshThread={refreshItems}
      />
      <RootFeed
        key={Array.isArray(router.query.id) ? router.query.id.join(',') : router.query.id || 'default'}
        data={points}
        setData={setPoints}
        setHistoricalItems={setHistoricalPointIds}
        refreshThread={refreshItems}
      />
      {!router.query.id && <CastButton conversation={router.query.conversation as string} refreshThread={refreshItems} />}
      {!router.query.id && !router.query.conversation &&
        <div className="loading" ref={loader} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '5vh' }}>
          <h2 style={{ fontSize: '1.5em', color: '#333' }}>Loading...</h2>
        </div>
      }
    </main >
  );
}