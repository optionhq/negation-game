import AccordionComponent from "./AccordionComponent";

type NegationsProps = {
  negations: any[];
  level: number;
  parentTitle: string;
  setHistoricalItems: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  setParentChildren: React.Dispatch<React.SetStateAction<any[]>>;
  threadData: any;
  negationType: "veracity" | "relevance";
};

const Negations: React.FC<NegationsProps> = ({
  negations,
  level,
  parentTitle,
  setHistoricalItems,
  setParentChildren,
  threadData,
  negationType,
}) => {
  return (
  <div className={`flex flex-col w-full gap-1`}>
    {negations.map((el: any, i: number) => (
      <AccordionComponent
        key={i}
        level={level + 1}
        e={el}
        parent={parentTitle}
        setHistoricalItems={setHistoricalItems}
        setParentChildren={setParentChildren}
        threadData={threadData}
      />
    ))}
  </div>
)};

export default Negations;