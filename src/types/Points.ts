import {Cast} from 'neynar-next/server'

export type Point = {
  text: string;
  hash: string;
  parent_hash?: string;
  likes: number;
  reply_count: number;
  negations: Point[];
};

export type Node = Point;

export interface Negation extends Point {
  node_url: string;
  node: Node;
}
