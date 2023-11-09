import { Cast } from "neynar-next/server";
import { Negation, Point, Node } from "@/types/Points";
import { extractEndPointUrl } from "@/lib/useEndPoints";
import axios from "axios";

export async function getMaybeNegation(cast: Cast): Promise<Negation> {
  const maybeNegation = castToNegation(cast)

  if (maybeNegation.endPointUrl) {
    const res = await axios.get(`/api/cast?type=url&identifier=${maybeNegation.endPointUrl}`);
    res.status === 200 || console.error("Failed to fetch cast", res);
    const cast: Cast = res.data;
    if (!cast) return maybeNegation;
    const endPoint: Point = castToPoint(cast)
    
    maybeNegation.endPoint = endPoint;
  }

  return maybeNegation;
}

export function castToNegation(cast: Cast): Negation {
  const endPointUrl = extractEndPointUrl(cast);
  return {
    title: cast.text,
    id: cast.hash,
    author: cast.author,
    parentId: cast.parent_hash as string,
    points: cast.reactions.likes.length,
    advocates: cast.reactions.likes,
    lovers: cast.reactions.recasts,
    replyCount: cast.replies.count,
    children: [],
    endPointUrl: endPointUrl || undefined,
  };
};

export function castToPoint(cast: Cast): Point {
  return {
    title: cast.text,
    id: cast.hash,
    author: cast.author,
    parentId: cast.parent_hash || undefined,
    replyCount: cast.replies.count,
    advocates: cast.reactions.likes,
    lovers: cast.reactions.recasts,
    points: cast.reactions.likes.length,
    children: []
  }
}