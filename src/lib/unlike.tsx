import axios from "axios";
import { Signer } from "neynar-next/server";

export default async function unlike(castId: string, signer: Signer) {
    try {
        let resp = await axios.delete(`/api/cast/${castId}/like`, { data: { signerUuid: signer.signer_uuid } })
        return resp
    } catch (error) {
        console.error(error)
    }
}