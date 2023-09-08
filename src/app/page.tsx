"use client";

import "./globals.css";
import { useEffect, useState } from "react";
import items from "./data";
import Accordion from "@/components/Accordion";
import HistoricalClaims from "@/components/HistoricalClaims";

export default function Home({ searchParams }: { searchParams: { id: string | null } }) {
  const [filteredItems, setFilteredItems] = useState<any []>();
  const [historicalItems, setHistoricalItems] = useState<string[]>();

  function findRoot(id: string | undefined | null) {
    if (!id) return items;
    let filteredItems: any[] = [];
    const traverse = (_items: any) => {
      for (const _item of _items) {
        console.log(_item.id, id);
        if (_item.id === id) {
          console.log("PUSH", _item.id)
          filteredItems.push(_item);
          break;
        } else if (_item.children && _item.children.length) {
          traverse(_item.children);
        }
        if(filteredItems.length !== 0) return
      }
    };

    traverse(items);
    return filteredItems;
  }

  useEffect(() => {
    const param = findRoot(searchParams.id?.split(",")[0])
    const hist = searchParams.id?.split(",").slice(1)
    setFilteredItems(param);
    setHistoricalItems(hist);
  }, [searchParams.id]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-12">
      {historicalItems && historicalItems?.length !== 0 && <HistoricalClaims claimsIds={historicalItems.reverse()} />}
      <Accordion data={filteredItems} level={0} setHistoricalItems={setHistoricalItems} />
    </main>
  );
}