import { BiChevronLeft } from 'react-icons/bi';
import Point from './Point'
import { useRouter } from 'next/router';

export default function HistoricalPoints({ ids, _onClick }: { ids: string[], _onClick?: (id: string) => void }) {
  const router = useRouter();

  function onClick(id: string) {
    const index = ids.indexOf(id);
    const newIds = ids.slice(index);
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