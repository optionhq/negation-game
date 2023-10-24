import { User } from "neynar-next/server";

export type PointsTree = {
  title: string;
  id: string;
  author?: User;
  parentId?: string;
  points: number;
  replyCount: number;
  children?: LinkPointsTree[];
  // used when it's an input type
  type?: string
  kind?: "relevance" | "veracity"
};

export type EndPointsTree = PointsTree;

// TODO: once we've switched to the real network, endPoint should be required
export interface LinkPointsTree extends PointsTree {
  endPoint?: PointsTree;
  endPointUrl?: string;
}
