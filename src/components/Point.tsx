import { useEffect } from "react";
import axios from "axios";
import { Cast } from "neynar-next/server";
import { useState } from "react";
import { getMaybeNegation } from "@/lib/useCasts";
import { Node, Negation } from "@/types/Points";

export default function Point({ id, onClick }: { id: string, onClick: () => void }) {

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

  return (
    <>
      {cast ? (
        <div 
          onClick={onClick}
          className="relative justify-between items-center gap-4 font-medium cursor-pointer list-none border border-grey-100 -mt-3 bg-white px-5 py-4 rounded-md"
        >
          {cast.endPoint ? cast.endPoint.title : cast.title}
        </div>
      ) : ( 
        <div> Loading... </div> 
      )}
    </>
  );
}