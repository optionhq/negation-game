import { useRouter } from 'next/router';
import Point from '@/components/Point'
import axios from 'axios';
import { getMaybeNegation } from '@/lib/useCasts'
import { Cast } from "neynar-next/server";

export default async function PointPage() {
  const router = useRouter();
  const { pointId } = router.query;

  const { path } = router.query.path ? router.query.path : null;

  // Now you can use the `point` variable in your component.
  // Remember to handle the case where `point` is undefined, as it will be on the first render.

  const cast = await axios.get(`/api/cast?type=hash&identifier=${pointId}`)
  const point = await getMaybeNegation(cast.data as Cast)

  return 
  <>
    {historicalPointIds && historicalPointIds?.length !== 0 && (<HistoricalPoints ids={historicalPointIds.reverse()} />)}
    <Point level={0} parent={undefined} getParentAncestry={undefined} setHistoricalItems={undefined} />
  </>
}