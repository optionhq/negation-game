// src/pages/index.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Feed from "@/components/Feed";
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
import { BiChevronLeft } from "react-icons/bi";
import { AiOutlinePushpin } from "react-icons/ai";


async function getHomeItems(castIds: string[] | string | null): Promise<{ historicalPoints: string[], points: Negation[] }> {
  let selectedPoint = null;
  let historicalPoints: string[] = [];
  let points: Negation[] = [];

  if (castIds === null || castIds.length === 0) {
    // if there's no path selected, get the feed
    const feed = await axios.get(`/api/feed/${encodeURIComponent(config.channelId)}`)
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

  return { historicalPoints, points }
}

export default function Home() {
  const router = useRouter();

  const [filteredItems, setFilteredItems] = useState<Negation[]>([]);
  const [pinnedCasts, setPinnedCasts] = useState<Negation[]>([])
  const [historicalPointIds, setHistoricalPointIds] = useState<string[] | undefined>([]);
  const [farcasterSigner, setFarcasterSigner] = useState<Signer | null>(null);

  const fetchItems = async () => {
    let ids: string[] = [];
    if (typeof router.query.id === 'string') {
      ids = router.query.id.split(",");
    }
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
    const { historicalPoints, points } = await getHomeItems(ids || null);
    setFilteredItems(points);
    setHistoricalPointIds(historicalPoints);
  };

  useEffect(() => {
    fetchItems();
  }, [router.isReady, router.query.id]);

  return (
    <div>
      <header className="flex justify-end px-6 py-2 gap-6 bg-slate-50 border fixed top-0 w-full z-40">
        {/* {farcasterSigner && <NotificationButton/>} */}
        <Login setFarcasterSigner={setFarcasterSigner} />
      </header>
      <main className="flex min-h-screen flex-col pt-16 pb-12 text-sm sm:text-base gap-8">
        {router.query.id && <div
          onClick={() => router.push({ pathname: '/' })}
          className="flex flex-row py-2 font-medium cursor-pointer w-fit hover:bg-slate-100 rounded-md text-gray-500 centered-element">
          <BiChevronLeft size={20} />
          <p className='px-2'>Go to Home</p>
        </div>}
        {historicalPointIds && historicalPointIds?.length !== 0 && ( <HistoricalPoints ids={historicalPointIds.reverse()} />)}
        <FarcasterSignerContext.Provider value={{ farcasterSigner: farcasterSigner, setFarcasterUser: setFarcasterSigner }}>
          {!router.query.id && pinnedCasts.length > 0 && (
            <div className="w-full flex flex-col bg-light-gold pb-5 rounded-xl py-4 gap-2">
              <div className="flex flex-row gap-2 items-center centered-element">
                <AiOutlinePushpin size={20}/>
                <h2 className="font-semibold">Pinned conversations</h2>
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
          <Feed
            key={Array.isArray(router.query.id) ? router.query.id.join(',') : router.query.id || 'default'}
            data={filteredItems}
            level={0}
            setHistoricalItems={setHistoricalPointIds}
            refreshThread={fetchItems}
          />
        </FarcasterSignerContext.Provider>
        {farcasterSigner && <CastComponent farcasterSigner={farcasterSigner} reloadThreads={fetchItems} />}
      </main>
    </div>
  );
}
