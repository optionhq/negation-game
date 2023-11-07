import axios from "axios";
import { Signer } from "neynar-next/server";

export default async function unlike(castId: string, signer: Signer) {
    return axios.delete(`/api/cast/${castId}/like`, { data: { signerUuid: signer.signer_uuid } })
                .then((resp) => {
                    console.log(resp)
                    return resp
                })
                .catch((e) => console.log(e))

}