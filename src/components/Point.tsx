import { useEffect } from "react";
import axios from "axios";
import { Cast } from "neynar-next/server";
import { useState } from "react";
import { getMaybeNegation } from "@/lib/useCasts";
import { Point, Negation } from "@/types/Points";

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

  if (!cast)
    return <p> Loading... </p>
  return <p
    onClick={onClick}
    className="claim font-medium cursor-pointer border border-grey-100"
  >
    {cast.endPoint ? cast.endPoint.title : cast.title}
  </p>
}