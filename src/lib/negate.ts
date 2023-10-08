import axios from "axios";
import config from "@/config";
import { FarcasterUser } from "@/types/FarcasterUser";

type PostCastResponse = {
  hash: string;
  author: {
    fid: number;
    username: string;
  };
  text: string;
};

export const createNegation = async ({text, parentId, farcasterUser}: {text: string, parentId: string, farcasterUser: FarcasterUser}) => {
  try {
    const castResponse = await axios.post(`/api/cast`, {
      signer_uuid: farcasterUser.signer_uuid,
      text: text,
      parent: config.parentUrl,
    });

    const newCast: PostCastResponse = castResponse.data.cast;

    const warpcastUrl = 'https://warpcast.com/' + newCast.author.username + '/' + newCast.hash.slice(0, 8).toString()

    const replyResponse = await axios.post(`/api/cast`, {
      signer_uuid: farcasterUser.signer_uuid,
      text: config.negationSymbol + "\n" + warpcastUrl,
      parent: parentId,
    });

    return replyResponse.data.cast as PostCastResponse;

  } catch (error) {
    console.error(error);
  }
};