import config from "@/config";
import { Signer } from 'neynar-next/server';
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
  farcasterSigner,
}: {
  text: string;
  parentId: string;
  farcasterSigner: Signer;
}) => {
  try {
    const castResponse = await publish({text, farcasterSigner});
    if (!castResponse) throw Error;

    const newCast: PostCastResponse = castResponse.data.cast;

    const warpcastUrl = "https://warpcast.com/" + newCast.author.username + "/" + newCast.hash.slice(0, 8).toString();
    const embeds = [{ url: warpcastUrl }]
    const negation = config.negationSymbol + "\n" + warpcastUrl;
    const negationResponse = await publish({text: negation, parentId, farcasterSigner, embeds})
    if (!negationResponse) throw Error;

    return negationResponse.data.cast as PostCastResponse;
  } catch (error) {
    console.error(error);
  }
};
