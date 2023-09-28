// src/types/PointsTree.ts
export type PointsTree = {
  title: string;
  id: string;
  parentId?: string;
  points: number;
  replyCount: number;
  children?: PointsTree[];
  endPoint?: PointsTree;
};