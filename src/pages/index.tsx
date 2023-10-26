// src/pages/index.tsx
import React, { useEffect, useState } from "react";
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
  const [historicalPointIds, setHistoricalPointIds] = useState<string[] | undefined>([]);
  const [farcasterSigner, setFarcasterSigner] = useState<Signer | null>(null);

  const fetchItems = async () => {
    let ids: string[] = [];
    if (typeof router.query.id === 'string') {
      ids = router.query.id.split(",");
    }
    if (ids.length !== 0) {
      const {historicalPoints, points} = await getHomeItems(ids || null);
      setFilteredItems(points);
      setHistoricalPointIds(historicalPoints);
    } else if (router.isReady && ids.length === 0) {
      const {historicalPoints, points} = await getHomeItems(ids || null);
      setFilteredItems(points);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [router.isReady, router.query.id]);

  return (
    <div>
      <header className="flex justify-end px-6 py-2 gap-6 bg-slate-50 border fixed top-0 w-screen z-40">
        {/* {farcasterSigner && <NotificationButton/>} */}
        <Login setFarcasterSigner={setFarcasterSigner} />
      </header>
      <main className="flex min-h-screen flex-col items-center justify-start p-12 pt-24 px-48">
        {farcasterSigner && <CastComponent farcasterSigner={farcasterSigner} reloadThreads={fetchItems} />}
        {historicalPointIds && historicalPointIds?.length !== 0 && (
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
        )}
        <FarcasterSignerContext.Provider value={{ farcasterSigner: farcasterSigner, setFarcasterUser: setFarcasterSigner }}>
          <Accordion 
            key={Array.isArray(router.query.id) ? router.query.id.join(',') : router.query.id || 'default'}
            data={filteredItems} 
            level={0} 
            setHistoricalItems={setHistoricalPointIds} 
            refreshThread={fetchItems}
          />
        </FarcasterSignerContext.Provider>
      </main>
    </div>
  );
}
