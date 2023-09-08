import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Points, Accordion, ExternalLink, Arrow } from "@/components";

const INDENTATION_PX = 30;

export default function AccordionComponent({
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
