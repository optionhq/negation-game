// src/hooks/usePointsTree.ts
import axios from 'axios';
import { LinkPointsTree } from '@/types/PointsTree';



function findRoot(id: string | undefined | null, items: any[]) {
  if (!id) return items;
  let filteredItems: any[] = [];
  const traverse = (_items: any) => {
    for (const _item of _items) {
      console.log(_item.hash, id);
      if (_item.hash === id) {
        console.log("PUSH", _item.hash)
        filteredItems.push(_item);
        break;
      } else if (_item.replies && _item.replies.count > 0) {
        traverse(_item.replies);
      }
      if(filteredItems.length !== 0) return
    }
  };

  traverse(items);
  return filteredItems;
}

export async function fetchPointsTree(id: string | null) {
  const options = {
    method: 'GET',
    url: 'https://api.neynar.com/v2/farcaster/feed',
    params: {
      api_key: process.env.NEYNAR_API_KEY,
      feed_type: 'filter',
      filter_type: 'parent_url',
      parent_url: 'chain://eip155:1/erc721:0xd4498134211baad5846ce70ce04e7c4da78931cc'
    },
    headers: {accept: 'application/json', api_key: process.env.NEYNAR_API_KEY}
  };

  const response = await axios.request(options);

  const pointsTree: LinkPointsTree[] = response.data.casts.map((cast: any) => ({
    title: cast.text,
    id: cast.hash,
    points: cast.reactions.likes.length,
    replyCount: cast.replies.count,
  }));

  const param = findRoot(id?.toString().split(",")[0], pointsTree);
  const hist = id?.toString().split(",").slice(1);

  return { pointsTree: param, historicalItems: hist };
}