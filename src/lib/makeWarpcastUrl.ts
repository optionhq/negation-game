
import { Node } from '@/types/Points'

export default function makeWarpcastUrl(cast: Node) {
  return 'https://warpcast.com/' + cast.author?.username + '/' + cast.id.slice(0, 8).toString();
}
