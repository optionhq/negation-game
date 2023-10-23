// pages/api/feed.ts
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { LinkPointsTree } from '@/types/PointsTree';
import config from '@/config';

function findRoot(id: string | undefined | null, items: any[]) {
  // for now just return all items
  return items;
  if (!id) return items;
  let filteredItems: any[] = [];
  const traverse = (_items: any) => {
    for (const _item of _items) {
      if (_item.hash === id) {
        filteredItems.push(_item);
        break;
      } else if (_item.replies && _item.replies.count > 0) {
        traverse(_item.replies);
      }
      if (filteredItems.length !== 0) return;
    }
  };

  traverse(items);
  return filteredItems;
}

export async function fetchFeed(id: string | null) {
  const options = {
    method: "GET",
    url: "https://api.neynar.com/v2/farcaster/feed",
    params: {
      api_key: process.env.NEYNAR_API_KEY,
      feed_type: 'filter',
      filter_type: 'parent_url',
      parent_url: config.channelId,
    },
    headers: { accept: "application/json", api_key: process.env.NEYNAR_API_KEY },
  };

  const response = await axios.request(options);

  const pointsTree: LinkPointsTree[] = response.data.casts.map((cast: any) => {
    return {
      title: cast.text,
      id: cast.hash,
      author: cast.author,
      points: cast.reactions.likes.length,
      replyCount: cast.replies.count,
    };
  });

  const param = findRoot(id?.toString().split(",")[0], pointsTree);
  const hist = id?.toString().split(",").slice(1);

  return { pointsTree: param, historicalItems: hist };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Invalid thread id' });
  }

  const pointsTree = await fetchFeed(id as string || null);
  res.status(200).json(pointsTree);
}
