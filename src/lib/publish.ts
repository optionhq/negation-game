import axios from "axios";
import { Signer } from "neynar-next/server";
import config from "@/config";
import { Cast } from 'neynar-next/server'

export default async function publish({
  text,
  parentId,
  farcasterSigner,
  embeds
}: {
  text: string;
  farcasterSigner: Signer;
  parentId?: string | null;
  embeds?: {url: string}[]
}) {
  try {
    const castResponse = await axios.post(`/api/cast`, {
      text: text,
      parent: parentId ? parentId : config.channelId,
      signerUuid: farcasterSigner.signer_uuid,
      embeds: embeds
    });
    return castResponse.data
  } catch (error) {
    console.error(error);
  }
}
