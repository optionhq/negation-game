import { Cast } from "neynar-next/server";
import { LinkPointsTree, EndPointsTree, PointsTree } from "@/types/PointsTree";
import { extractEndPointUrl } from "@/lib/useEndPoints";
import axios from "axios";

export async function getMaybeNegation(cast: Cast): Promise<LinkPointsTree> {
  const maybeNegation = castToLinkPointsTree(cast)

  if (maybeNegation.endPointUrl) {
    const res = await axios.get(`/api/cast?type=url&identifier=${maybeNegation.endPointUrl}`);
    res.status === 200 || console.error("Failed to fetch cast", res);
    const cast: Cast = res.data;
    if (!cast) return maybeNegation;
    const endPoint: EndPointsTree = castToPointsTree(cast)
    
    maybeNegation.endPoint = endPoint;
  }

  return maybeNegation;
}

export function castToLinkPointsTree(cast: Cast): LinkPointsTree {
  const endPointUrl = extractEndPointUrl(cast);
  return {
    title: cast.text,
    id: cast.hash,
    author: cast.author,
    parentId: cast.parent_hash as string,
    points: cast.reactions.likes.length,
    replyCount: cast.replies.count,
    children: [],
    endPointUrl: endPointUrl || undefined,
  };
};

export function castToPointsTree(cast: Cast): EndPointsTree {
  return {
    title: cast.text,
    id: cast.hash,
    author: cast.author,
    parentId: cast.parent_hash || undefined,
    replyCount: cast.replies.count,
    points: cast.reactions.likes.length,
    children: []
  }
}