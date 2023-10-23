import Point from './Point'

export default function HistoricalPoints({ ids }: { ids: string[] }) {

  return (
    <div className="flex flex-col w-full h-fit text-gray-500 mb-4 ">
      {ids.map((id,i) => (
        <Point key={id} id={id}/>
      ))}
    </div>
    );
  }