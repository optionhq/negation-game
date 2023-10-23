// src/pages/index.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Accordion from "@/components/Accordion";
import HistoricalPoints from "@/components/HistoricalClaims";
import Login from "@/components/Login";
import { LinkPointsTree } from "@/types/PointsTree";
import CastComponent from "@/components/Cast";
import { LOCAL_STORAGE_KEYS } from "@/components/constants";
import { FarcasterUser } from "@/types/FarcasterUser";
import axios from "axios";
import { FarcasterUserContext } from "@/contexts/UserContext";
import NotificationButton from "@/components/notifications/NotificationButton";
import config from "@/config";
import { Cast } from "neynar-next/server";
import { getMaybeNegation } from "@/lib/useCasts";


async function getHomeItems(castIds: string[] | string | null): Promise<{ historicalPoints: string[], points: LinkPointsTree[] }> {
    let selectedPoint = null;
    let historicalPoints: string[] = [];
    let points: LinkPointsTree[] = [];

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

  const [filteredItems, setFilteredItems] = useState<LinkPointsTree[]>([]);
  const [historicalPointIds, setHistoricalPointIds] = useState<string[] | undefined>([]);
  const [farcasterUser, setFarcasterUser] = useState<FarcasterUser | null>(null);

  useEffect(() => {
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

    fetchItems();
  }, [router.isReady]);

  const reloadPage = async () => {
    try {
      const response = await axios.get(`/api/feed`);
      setFilteredItems(response.data.pointsTree);
    } catch (error) {
      console.error("Could not reload threads", error);
    }
  };

  useEffect(() => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEYS.FARCASTER_USER);
    if (storedData) {
      const user: FarcasterUser = JSON.parse(storedData);
      setFarcasterUser(user);
    }
  }, []);

  return (
    <div>
      <header className="flex justify-end px-6 py-2 gap-6 bg-slate-50 border fixed top-0 w-screen z-40">
        {farcasterUser?.status == "approved" && <NotificationButton/>}
        <Login />
      </header>
      <main className="flex min-h-screen flex-col items-center justify-start p-12 pt-24 px-48">
        {farcasterUser?.status == "approved" && <CastComponent farcasterUser={farcasterUser} reloadThreads={reloadPage} />}
        {historicalPointIds && historicalPointIds?.length !== 0 && (
          <HistoricalPoints ids={historicalPointIds.reverse()} />
        )}
        <FarcasterUserContext.Provider value={{ farcasterUser, setFarcasterUser }}>
          <Accordion data={filteredItems} level={0} setHistoricalItems={setHistoricalPointIds} />
        </FarcasterUserContext.Provider>
      </main>
    </div>
  );
}
