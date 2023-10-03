// src/pages/index.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Accordion from "@/components/Accordion";
import HistoricalClaims from "@/components/HistoricalClaims";
import Login from "@/components/Login";
import { fetchPointsTree } from "@/hooks/usePointsTree";
import { LinkPointsTree } from '@/types/PointsTree';
import { GetServerSidePropsContext } from 'next';
import SimpleComponent from '@/components/SimpleComponent';

export default function Home({ pointsTree, historicalItems }: { pointsTree: LinkPointsTree[], historicalItems: string[] }) {
  const router = useRouter();
  const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id || null;

  // Use the fetched data directly
  const filteredItems = pointsTree;
  const [historicalItemsState, setHistoricalItems] = useState<string[] | undefined>(historicalItems);

  return (
    <div>
      <header className="flex justify-end m-4"><Login/></header>
      < SimpleComponent />
      <main className="flex min-h-screen flex-col items-center justify-start p-12 px-48">
        {historicalItemsState && historicalItemsState?.length !== 0 && <HistoricalClaims claimsIds={historicalItemsState.reverse()} />}
        <Accordion data={filteredItems} level={0} setHistoricalItems={setHistoricalItems} />
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  let id = context.query.threadId || null; // replace 'threadId' with the actual query parameter for the thread id
  if (Array.isArray(id)) {
    id = id[0];
  }

  let pointsTree = [];
  let historicalItems: string[] = [];

  // Fetch the points tree if the thread id is not present
  const data = await fetchPointsTree(null);
  pointsTree = data.pointsTree;
  historicalItems = data.historicalItems || [];

  return {
    props: {
      pointsTree,
      historicalItems,
    },
  };
}