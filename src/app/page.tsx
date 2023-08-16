"use client";

import Arrow from "@/components/Arrow";
import "./globals.css";
import Image from "next/image";
import { EventHandler, useEffect, useRef, useState } from "react";
import { FiExternalLink, FiLink2, FiHeart, FiXCircle } from "react-icons/fi";
import items from "./data";
import Points from "./Points";
import ExternalLink from "./ExternalLink";
const INDENTATION_PX = 30;
import { useRouter, useSearchParams } from "next/navigation";

function Linkage({ points = 0 }: { points?: number }) {
  return (
    <div className="w-fit border border-slate-500 rounded-md px-4 py-2 flex flex-col bg-white items-center justify-center ">
      <div className="flex flex-row gap-2 items-center justify-center">
        <FiLink2 />
        <p>{points}</p>
      </div>
    </div>
  );
}

function AccordionComponent({
  level,
  e,
  parent,
  setHistoricalItems,
}: {
  level: number;
  e: any;
  parent: string | undefined;
  setHistoricalItems: React.Dispatch<React.SetStateAction<string[] | undefined>>;
}) {
  const [children, setChildren] = useState<any[]>(e.children);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [detailsOpened, setDetailsOpened] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setChildren(e.children);
  }, [e]);
  function summaryClick(e: React.MouseEvent) {
    e.preventDefault();
  }

  function expandDetails() {
    if (!detailsRef.current) return;
    detailsRef.current.open = !detailsRef.current.open;
    setDetailsOpened(detailsRef.current.open);
  }
  const onNegate = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    e.nativeEvent.stopPropagation();
    if (!detailsRef.current) return;
    detailsRef.current.open = true;
    setDetailsOpened(detailsRef.current.open);
    var _children = children;
    if (_children) _children.push({ input: true });
    else _children = new Array({ input: true });
    _children.map((e: any) => console.log(e));
    setChildren(_children);
  };

  const paddingLeft = `${INDENTATION_PX * level + (children ? 6 : 60)}px`;
  const claimStyle = `relative flex justify-between items-center gap-4 font-medium cursor-pointer list-none border border-transparent px-5 py-4 hover:border-slate-500 rounded-md ${
    level % 2 ? "bg-slate-200" : " bg-slate-100"
  }`;

  function newRoute() {
    const current = searchParams.get("id");
    // const route = ""
    if (current?.includes(e.id)) return;
    const route = current ? `${e.id},${current}` : e.id;
    router.push(`?id=${route}`);
    // router.replace(`?id=${e.id}`)
  }

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    const selection = window.getSelection()?.toString();
    if (selection) return;
    expandDetails();
  }

  function handleDoubleClick(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    newRoute();
  }

  function toggle(e: any) {
    e.preventDefault();
  }
  if (e.input)
    return (
      <div
        className={claimStyle + " flex flex-col order-first border-2 border-black"}
        onClick={(e) => e.stopPropagation}
        style={{ paddingLeft: paddingLeft }}>
        <textarea placeholder={"The claim `" + parent + "` is not true because ..."} className="w-full h-36" />
        <div className="w-full flex gap-2 justify-end">
          <button className="border border-slate-600 px-3 py-2 rounded-md">Cancel</button>
          <button className=" bg-slate-600 px-3 py-2 text-white rounded-md">Publish</button>
        </div>
      </div>
    );
  return (
    <details
      ref={detailsRef}
      open={false}
      className="flex flex-col gap-1"
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onToggle={toggle}>
      <summary onClick={summaryClick} className={claimStyle} style={{ paddingLeft: paddingLeft }}>
        {children && children.length && (
          <div className={`p-3 hover:bg-slate-300 rounded-md`}>
            <div className={`transition w-full h-full ${detailsOpened ? "rotate-180" : ""}`}>
              <Arrow />
            </div>
          </div>
        )}
        <span className="w-full"> {e.title}</span>
        <Points points={e.points} onNegate={onNegate} />
        <ExternalLink />
      </summary>
      {children && children.length && (
        <Accordion data={children} level={level + 1} parent={e.title} setHistoricalItems={setHistoricalItems} />
      )}
    </details>
  );
}

function Accordion({
  data,
  level,
  parent,
  setHistoricalItems,
}: {
  data: any;
  level: number;
  parent?: string | undefined;
  setHistoricalItems: React.Dispatch<React.SetStateAction<string[] | undefined>>;
}) {
  return (
    <div className="flex flex-col w-full gap-1 ">
      {data?.map((e: any, i: number) => (
        <AccordionComponent key={i} level={level} e={e} parent={parent} setHistoricalItems={setHistoricalItems} />
      ))}
    </div>
  );
}

function HistoricalClaims({ claimsIds }: { claimsIds: string[] }) {
  function findElement(id: string) {
    if (!id) return items;
    let item: any;

    const traverse = (_items: any) => {
      for (const _item of _items) {
        if (_item.id === id) {
          item = _item;
        } else if (_item.children && _item.children.length) {
          traverse(_item.children);
        }
      }
    };

    traverse(items);
    return item;
  }

  return (
    <div className="flex flex-col w-full h-fit text-gray-500 mb-4 ">
      {claimsIds.map((e,i) => (
        <div key={i} className="relative justify-between items-center gap-4 font-medium cursor-pointer list-none border border-grey-100 -mt-3 bg-white px-5 py-4 rounded-md">{findElement(e).title}</div>
      ))}
    </div>
  );
}

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
    console.log("FILTERED", filteredItems);
    return filteredItems;
  }

  useEffect(() => {
    const param = findRoot(searchParams.id?.split(",")[0])
    const hist = searchParams.id?.split(",").slice(1)
    console.log("HIST", hist)
    setFilteredItems(param);
    setHistoricalItems(hist);
  }, [searchParams.id]);

  console.log("HISTORICAL", historicalItems, filteredItems);
  // let filteredItems = findRoot(searchParams.id);
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      {historicalItems && historicalItems?.length !== 0 && <HistoricalClaims claimsIds={historicalItems.reverse()} />}
      <Accordion data={filteredItems} level={0} setHistoricalItems={setHistoricalItems} />
    </main>
  );
}
