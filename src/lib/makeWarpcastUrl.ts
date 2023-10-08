
export default function makeWarpcastUrl(cast: any) {
  return 'https://warpcast.com/' + cast.author.username + '/' + cast.hash.slice(0, 8).toString();
}
