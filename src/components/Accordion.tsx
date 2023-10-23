import AccordionComponent from "./AccordionComponent";
import { LinkPointsTree } from "@/types/PointsTree";

export default function Accordion({
  data,
  level,
  parent,
  setHistoricalItems,
}: {
  data: LinkPointsTree[] | null;
  level: number;
  parent?: string | undefined;
  setHistoricalItems: React.Dispatch<React.SetStateAction<string[] | undefined>>;
}) {
  return (
    <div className="flex flex-col w-full gap-1 ">
      {data?.map((e: any, i: number) => (
        <AccordionComponent
          key={i} 
          level={level} 
          e={e}
          parent={parent}
          setHistoricalItems={setHistoricalItems}
          setParentChildren={e.children}
          threadData={null}
        />
      ))}
    </div>
  );
}
