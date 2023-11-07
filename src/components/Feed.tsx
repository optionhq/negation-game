import AccordionComponent from "./AccordionComponent";
import { Negation } from "@/types/Points";

export default function Feed({
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
    <div className="flex flex-col gap-1 centered-element">
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
          getParentAncestry={undefined}
        />
      ))}
    </div>
  );
}
