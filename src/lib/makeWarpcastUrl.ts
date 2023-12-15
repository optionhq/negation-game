
import { Node } from '../types/Points'

export default function makeWarpcastUrl(cast: Node) {
  if (cast.id)
    return 'https://warpcast.com/' + cast.author?.username + '/' + cast.id.slice(0, 8).toString();
}
