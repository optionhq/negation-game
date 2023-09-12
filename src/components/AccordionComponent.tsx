import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Points, Accordion, ExternalLink, Arrow, InputComponent } from "@/components";

const INDENTATION_PX = 25;

export default function AccordionComponent({
  level,
  e,
  parent,
  setParentChildren,
  setHistoricalItems,
}: {
  level: number;
  e: any;
  parent: string | undefined;
  setParentChildren: any;
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

  function expandDetails() {
    if (!detailsRef.current) return;
    detailsRef.current.open = !detailsRef.current.open;
    setDetailsOpened(detailsRef.current.open);
  }
  const onNegate = (e: React.MouseEvent<HTMLSpanElement | React.MouseEvent>) => {
    // e.stopPropagation();
    // e.preventDefault();
    // e.nativeEvent.stopImmediatePropagation();
    // e.nativeEvent.stopPropagation();
    if (!detailsRef.current) return;
    detailsRef.current.open = true;
    setDetailsOpened(detailsRef.current.open);
    var _children = children;
    if (_children) _children.push({ type: "input" });
    else _children = new Array({ type: "input" });
    _children.map((e: any) => console.log(e));
    setChildren(_children);
  };

  function removeInput() {
    if (!parent) return;

    setParentChildren((element: any) => {
      console.log(element);
      let filtered = element.filter((child: any) => child.type !== "input");
      console.log(filtered);
      return filtered.length ? filtered : null;
    });
    // const filteredChildren = children.filter((child: any) => child.type !== "input");

    // setParentChildren((element:any) => element.filter((child: any) => child.type === "input"));
    // const filteredChildren = children.filter((child: any) => child.type === "input");
    // setChildren(filteredChildren);
  }

  const paddingLeft = `${INDENTATION_PX * level + 6}px`;
  const claimBg = `${level % 2 ? "bg-slate-200" : " bg-slate-100"}`;

  function newRoute() {
    const current = searchParams.get("id");
    if (current?.includes(e.id)) return;
    const route = current ? `${e.id},${current}` : e.id;
    router.push(`?id=${route}`);
  }

  function handleClick(e: React.MouseEvent) {
    console.log("aaa");

    //stop propagation to not toggle
    e.stopPropagation();

    //dont fire if the user is selecting a text
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
    console.log("ééé");
  }
  if (e.type === "input")
    return <InputComponent claimBg={claimBg} paddingLeft={paddingLeft} parent={parent!} removeInput={removeInput} />;
  return (
    <details
      ref={detailsRef}
      open={false}
      className="flex flex-col gap-1"
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onToggle={toggle}>
      <summary
        onClick={(e) => {
          e.preventDefault();
        }}
        className={claimBg + " claim relative"}
        style={{ paddingLeft: paddingLeft }}>
        <div className="flex flex-col gap-2">
          <div className={`p-1 rounded-md ${children && children.length ? "opacity-100" : "opacity-0"}`}>
            <div className={`transition w-full h-full ${detailsOpened ? "rotate-180" : ""}`}>
              <Arrow />
            </div>
          </div>
          {/* {detailsOpened && <div className="w-[1px] bg-black absolute bottom-0 top-12 ml-4"></div>} */}
          {parent && <div className="w-[1px] h-24 bg-black absolute -top-14 left-0 z-40" style={{marginLeft: `${22 + (INDENTATION_PX * (level -1))}px`}}></div>}
        </div>
        <div className="flex flex-col gap-1 items-start justify-center">
          <span className="w-full"> {e.title}</span>
          <div className="flex flex-row gap-0 text-gray-500">
            <Points points={e.points} onNegate={onNegate} type="like" />
            {parent && <Points points={e.points} onNegate={onNegate} type="relevance" />}
            <ExternalLink />
          </div>
        </div>
      </summary>
      {children && children.length && (
        <div className="flex flex-col w-full gap-1 ">
          {children?.map((el: any, i: number) => (
            <AccordionComponent
              key={i}
              level={level + 1}
              e={el}
              parent={e.title}
              setHistoricalItems={setHistoricalItems}
              setParentChildren={setChildren}
            />
          ))}
        </div>
      )}
    </details>
  );
}
