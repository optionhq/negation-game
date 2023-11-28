import { useRouter } from 'next/router';
import { useEffect } from "react";
import axios from "axios";
import { Cast } from "neynar-next/server";
import { useState } from "react";
import { getMaybeNegation } from "@/lib/useCasts";
import { Point, Negation } from "@/types/Points";

function HistoricalPoint({ id, onClick }: { id: string, onClick: () => void }) {

  const [cast, setCast] = useState<Negation | null>(null);

  useEffect(() => {
    const fetchCast = async () => {
      const res = await axios.get(`/api/cast?type=hash&identifier=${id}`)
      const cast: Cast = res.data
      const maybeNegation = await getMaybeNegation(cast)
      setCast(maybeNegation)
    };
    fetchCast();
  }, [id]);

  if (!cast)
    return <p> Loading... </p>
  return <>
    <p className='flex items-center p-7 text-gray-500'>{cast.endPoint ? cast.endPoint.advocates.length : cast.advocates.length}</p>
    <p
      onClick={onClick}
      className="min-h-[70px] font-medium text-gray-900 flex items-center"
    >
      {cast.endPoint ? cast.endPoint.title : cast.title}
    </p>
  </>
}

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
    <div className="flex flex-col h-fit space-y-0 gap-1 pb-1 centered-element">
      {ids.map((id, i) => (
        <div className="flex cursor-pointer rounded-md border border-grey-100 hover:bg-gray-100">
          <HistoricalPoint key={id} id={id} onClick={() => onClick(id)} />
        </div>
      ))}
    </div>
  );
}