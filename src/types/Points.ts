import { User } from "neynar-next/server";

export type Node = {
  title: string;
  id?: string;
  author?: User;
  parentId?: string;
  points?: number;
  replyCount?: number;
  advocates?: { fid: number }[];
  lovers?: { fid: number }[];
  children?: Node[];
  type: "root" | "input" | "negation"
  kind?: "relevance" | "veracity"
// TODO: once we've switched to the real network, endPoint should be required
  endPoint?: Node
  endPointUrl?: string

};

