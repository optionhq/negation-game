// src/pages/index.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Accordion from "@/components/Accordion";
import HistoricalClaims from "@/components/HistoricalClaims";
import Login from "@/components/Login";
import { PointsTree, fetchPointsTree } from "@/hooks/usePointsTree";

export default function Home({ pointsTree, historicalItems }: { pointsTree: PointsTree[], historicalItems: string[] }) {
  const router = useRouter();
  const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id || null;

  // Use the fetched data directly
  const filteredItems = pointsTree;
  const [historicalItemsState, setHistoricalItems] = useState<string[] | undefined>(historicalItems);

  return (
    <div>
      <header className="flex justify-end m-4"><Login/></header>
      <main className="flex min-h-screen flex-col items-center justify-start p-12 px-48">
        {historicalItemsState && historicalItemsState?.length !== 0 && <HistoricalClaims claimsIds={historicalItemsState.reverse()} />}
        <Accordion data={filteredItems} level={0} setHistoricalItems={setHistoricalItems} />
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const id = null; // or replace with an appropriate id value
  const { pointsTree, historicalItems = [] } = await fetchPointsTree(id);

  return {
    props: {
      pointsTree,
      historicalItems,
    },
  };
}