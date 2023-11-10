import { BiChevronLeft } from 'react-icons/bi';
import Point from './Point'
import { useRouter } from 'next/router';

export default function HistoricalPoints({ ids }: { ids: string[] } ) {
  const router = useRouter();

  function onClick(id: string) {
    const reverseIds = ids.reverse()
    const index = reverseIds.indexOf(id);
    const newIds = reverseIds.slice(index);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, id: newIds.join(',') },
    });
  }


  return (
    <div className="flex flex-col h-fit text-gray-500 space-y-0 gap-1 centered-element">
      {ids.map((id, i) => (
        <Point key={id} id={id} onClick={() => onClick(id)} />
      ))}
    </div>
  );
}