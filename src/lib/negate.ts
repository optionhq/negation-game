import axios from "axios";
import config from "@/config";
import { FarcasterUser } from "@/types/FarcasterUser";
import publish from "./publish";

type PostCastResponse = {
  hash: string;
  author: {
    fid: number;
    username: string;
  };
  text: string;
};

export const negate = async ({
  text,
  parentId,
  farcasterUser,
}: {
  text: string;
  parentId: string;
  farcasterUser: FarcasterUser;
}) => {
  try {
    const castResponse = await publish({text, parentId, farcasterUser});
    if (!castResponse) throw Error;

    const newCast: PostCastResponse = castResponse.data.cast;

    const warpcastUrl = "https://warpcast.com/" + newCast.author.username + "/" + newCast.hash.slice(0, 8).toString();
    const embeds = [{ url: warpcastUrl }]
    const negationResponse = await publish({text, parentId, farcasterUser, embeds})
    if (!negationResponse) throw Error;

    return negationResponse.data.cast as PostCastResponse;
  } catch (error) {
    console.error(error);
  }
};
