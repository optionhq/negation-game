"use client";

import Arrow from "@/components/Arrow";
import "./globals.css";
import Image from "next/image";
import { useRef, useState } from "react";
import { FiExternalLink, FiLink2, FiHeart, FiXCircle } from "react-icons/fi";
import items from "./data";
import Points from "./Points";
import ExternalLink from "./ExternalLink";
const INDENTATION_PX = 30;

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

function AccordionComponent({ level, e, parent }: { level: number; e: any; parent: string | undefined }) {
  const [children, setChildren] = useState<any[]>(e.children);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [detailsOpened, setDetailsOpened] = useState<boolean>(false);

  // children?.map((e:any) => console.log(e))
  function summaryClick(e: React.MouseEvent) {
    e.preventDefault();
  }

  function expandDetails() {
    if (!detailsRef.current) return;
    detailsRef.current.open = !detailsRef.current.open;
    setDetailsOpened(detailsRef.current.open);
  }
  const onNegate = () => {
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

  if (e.input)
    return (
      <div
        className={claimStyle + " flex flex-col order-first border-2 border-black"}
        style={{ paddingLeft: paddingLeft }}>
        <textarea placeholder={"The claim `" + parent + "` is not true because ..."} className="w-full h-36" />
        <div className="w-full flex gap-2 justify-end">
          <button className="border border-slate-600 px-3 py-2 rounded-md">Cancel</button>
          <button className=" bg-slate-600 px-3 py-2 text-white rounded-md">Publish</button>
        </div>
      </div>
    );
  return (
    <details ref={detailsRef} open={false} className="flex flex-col gap-1">
      <summary onClick={summaryClick} className={claimStyle} style={{ paddingLeft: paddingLeft }}>
        {children && children.length && (
          <div className={`p-3 hover:bg-slate-300 rounded-md`} onClick={expandDetails}>
            <div className={`transition w-full h-full ${detailsOpened ? "rotate-180" : ""}`}>
              <Arrow />
            </div>
          </div>
        )}
        <span className="w-full"> {e.title}</span>
        <Points points={e.points} onNegate={onNegate} />
        <ExternalLink />
      </summary>
      {children && children.length && <Accordion data={children} level={level + 1} parent={e.title} />}
    </details>
  );
}

function Accordion({ data, level, parent }: { data: any; level: number; parent?: string | undefined }) {
  console.log(data);
  return (
    <div className="flex flex-col w-full gap-1 ">
      {data?.map((e: any, i: number) => (
        <AccordionComponent key={i} level={level} e={e} parent={parent} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Accordion data={items} level={0} />
    </main>
  );
}
