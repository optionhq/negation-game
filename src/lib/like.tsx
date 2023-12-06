import axios from "axios";
import { Signer } from "neynar-next/server";

export default async function like(castId: string, signer: Signer) {
    try {
        let resp = await axios.post(`/api/cast/${castId}/like`, { signerUuid: signer.signer_uuid })
        return resp
    } catch (error) {
        console.error(error)
    }
}