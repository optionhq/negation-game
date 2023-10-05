// src/pages/index.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Accordion from "@/components/Accordion";
import HistoricalClaims from "@/components/HistoricalClaims";
import Login from "@/components/Login";
import { LinkPointsTree } from '@/types/PointsTree';
import Cast from '@/components/Cast';
import { LOCAL_STORAGE_KEYS } from '@/components/constants';
import { FarcasterUser } from '@/types/FarcasterUser';
import axios from 'axios';
import { NextPageContext } from 'next';
import { fetchFeed } from '@/pages/api/feed';

export default function Home({ initialPointsTree, initialHistoricalItems }: { initialPointsTree: LinkPointsTree[], initialHistoricalItems: string[] }) {
  const router = useRouter();
  const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id || null;

  const [filteredItems, setFilteredItems] = useState(initialPointsTree);
  const [historicalItemsState, setHistoricalItems] = useState<string[] | undefined>(initialHistoricalItems);
  
  const [farcasterUser, setFarcasterUser] = useState<FarcasterUser | null>(null);

  const reloadThreads = async () => {
    try {
      const response = await axios.get(`/api/feed?id=${router.query.id}`);
      console.log('reload response', response.data)
      setFilteredItems(response.data.pointsTree);
    } catch (error) {
      console.error('Could not reload threads', error);
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
      <header className="flex justify-end m-4"><Login/></header>
      <main className="flex min-h-screen flex-col items-center justify-start p-12 px-48">
        {farcasterUser?.status == 'approved' && <Cast farcasterUser={farcasterUser} reloadThreads={reloadThreads}/>}
        {historicalItemsState && historicalItemsState?.length !== 0 && <HistoricalClaims claimsIds={historicalItemsState.reverse()} />}
        <Accordion data={filteredItems} level={0} setHistoricalItems={setHistoricalItems} />
      </main>
    </div>
  );
}

Home.getInitialProps = async (context: NextPageContext) => {
  let id = context.query.threadId || null;

  const { pointsTree, historicalItems } = await fetchFeed(id as string)

  return {
    initialPointsTree: pointsTree,
    initialHistoricalItems: historicalItems,
  };
};