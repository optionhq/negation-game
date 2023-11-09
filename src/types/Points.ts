import { User } from "neynar-next/server";

export type Node = {
  title: string;
  id: string;
  author?: User;
  parentId?: string;
  points: number;
  replyCount: number;
  advocates: {fid: number}[];
  lovers: {fid: number}[];
  children?: Negation[];
  // used when it's an input type
  type?: string
  kind?: "relevance" | "veracity"
};

export type Point = Node;

// TODO: once we've switched to the real network, endPoint should be required
export interface Negation extends Node {
  endPoint?: Node;
  endPointUrl?: string;
}
