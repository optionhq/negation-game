
import { Point } from '@/types/Points'

export default function makeWarpcastUrl(cast: Point) {
  return 'https://warpcast.com/' + cast.author?.username + '/' + cast.id.slice(0, 8).toString();
}
