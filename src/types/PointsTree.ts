export type EndPointsTree = {
  title: string;
  id: string;
  parentId?: string;
  points: number;
  replyCount: number;
  children?: LinkPointsTree[];
};

// TODO: once we've switched to the real network, endPoint should be required
export interface LinkPointsTree extends EndPointsTree {
  endPoint?: EndPointsTree;
  endPointUrl?: string;
}
