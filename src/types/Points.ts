import { User } from "neynar-next/server";

export type Point = {
  title: string;
  id: string;
  author?: User;
  parentId?: string;
  points: number;
  replyCount: number;
  children?: Negation[];
  // used when it's an input type
  type?: string
  kind?: "relevance" | "veracity"
};

export type Node = Point;

// TODO: once we've switched to the real network, endPoint should be required
export interface Negation extends Point {
  endPoint?: Point;
  endPointUrl?: string;
}
