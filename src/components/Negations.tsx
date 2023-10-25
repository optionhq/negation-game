import AccordionComponent from "./AccordionComponent";
import { Negation } from "@/types/Points";

type NegationsProps = {
  negations: Negation[];
  level: number;
  parent: Negation;
  setHistoricalItems: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  setParentChildren: React.Dispatch<React.SetStateAction<any[]>>;
  threadData: any;
  negationType: "veracity" | "relevance";
  refreshParentThread: () => Promise<void>,
  getParentAncestry: undefined | (() => string)
};

const Negations: React.FC<NegationsProps> = ({
  negations,
  level,
  parent,
  setHistoricalItems,
  setParentChildren,
  threadData,
  negationType,
  refreshParentThread,
  getParentAncestry
}) => {
  return (
  <div className={`flex flex-col w-full gap-1`}>
    {negations.map((el: Negation, i: number) => (
      <AccordionComponent
        key={el.id}
        level={level + 1}
        e={el}
        parent={parent}
        setHistoricalItems={setHistoricalItems}
        setParentChildren={setParentChildren}
        threadData={threadData}
        refreshParentThread={refreshParentThread}
        getParentAncestry={getParentAncestry}
      />
    ))}
  </div>
)};

export default Negations;