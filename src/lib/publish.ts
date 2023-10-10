import axios from "axios";
import { FarcasterUser } from "@/types/FarcasterUser";
import config from "@/config";

export default async function publish({
  text,
  parentId,
  farcasterUser,
  embeds
}: {
  text: string;
  parentId?: string | null;
  farcasterUser: FarcasterUser;
  embeds?: {url: string}[]
}) {
  try {
    const castResponse = await axios.post(`/api/cast`, {
      signer_uuid: farcasterUser.signer_uuid,
      text: text,
      parent: parentId ? parentId : config.parentUrl ,
      embeds: embeds
    });
    return castResponse
  } catch (error) {
    console.error(error);
  }
}
