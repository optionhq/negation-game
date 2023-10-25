import AccordionComponent from "./AccordionComponent";
import { Negation } from "@/types/Points";

export default function Accordion({
  data,
  level,
  parent,
  setHistoricalItems,
  refreshThread,
}: {
  data: Negation[] | null;
  level: number;
  parent?: string | undefined;
  setHistoricalItems: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  refreshThread: () => Promise<void>;
}) {
  return (
    <div className="flex flex-col w-full gap-1 ">
      {data?.map((e: any, i: number) => (
        <AccordionComponent
          key={e.id} 
          level={level} 
          e={e}
          parent={undefined}
          setHistoricalItems={setHistoricalItems}
          setParentChildren={e.children}
          threadData={null}
          refreshParentThread={refreshThread}
        />
      ))}
    </div>
  );
}
