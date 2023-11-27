import axios from "axios";
import { Signer } from "neynar-next/server";
import { DEFAULT_CHANNELID } from "@/components/constants"
import config from "@/config";
import { Cast } from 'neynar-next/server'

export default async function publish({
  text,
  parentId,
  signer,
  embeds
}: {
  text: string;
  signer: Signer;
  parentId?: string | null;
  embeds?: {url: string}[]
}) {
  try {
    const castResponse = await axios.post(`/api/cast`, {
      text: text,
      parent: parentId ? parentId : DEFAULT_CHANNELID,
      signerUuid: signer.signer_uuid,
      embeds: embeds
    });
    return castResponse
  } catch (error) {
    console.error(error);
  }
}
