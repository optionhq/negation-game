import config from "@/config";
import { Signer } from 'neynar-next/server';
import publish from "./publish";
import { NEGATION_SYMBOL } from "@/components/constants";

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
  signer,
}: {
  text: string;
  parentId: string;
  signer: Signer;
}) => {
  try {
    const castResponse = await publish({text, signer});
    if (!castResponse) throw Error;

    const newCast: PostCastResponse = castResponse.data.cast;

    const warpcastUrl = "https://warpcast.com/" + newCast.author.username + "/" + newCast.hash.slice(0, 8).toString();
    const embeds = [{ url: warpcastUrl }]
    const negation = NEGATION_SYMBOL + "\n" + warpcastUrl;
    const negationResponse = await publish({text: negation, parentId, signer, embeds})
    if (!negationResponse) throw Error;

    return negationResponse.data.cast as PostCastResponse;
  } catch (error) {
    console.error(error);
  }
};
