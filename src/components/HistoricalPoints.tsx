import Point from './Point'

export default function HistoricalPoints({ ids, onClick }: { ids: string[], onClick: (id: string) => void }) {
  return (
    <div className="flex flex-col w-full h-fit text-gray-500 mb-4 space-y-0">
      {ids.map((id,i) => (
        <Point key={id} id={id} onClick={() => onClick(id)} />
      ))}
    </div>
  );
}