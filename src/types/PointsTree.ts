export type User = {
  fid: number,
  username: string,
  display_name: string,
  pfp_url: string,
  profile: { bio: [Object] },
  follower_count: number,
  following_count: number,
  verifications: string[],
  active_status: 'active'
}

export type EndPointsTree = {
  title: string;
  id: string;
  author?: User;
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
