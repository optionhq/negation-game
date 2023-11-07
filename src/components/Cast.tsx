import React, { useState } from "react";
import { BiSolidPencil } from "react-icons/bi"
import Modal from "./Modal"
import { InputComponent } from "."
import { Signer } from "neynar-next/server"
import publish from "@/lib/publish"
import { getDeviceType } from "@/lib/getDeviceType";

function CastComponent({ farcasterSigner, reloadThreads }: { farcasterSigner: Signer; reloadThreads: () => void }) {
  const [castModal, setCastModal] = useState(false);

  const deviceType = getDeviceType()

  const onPublish = async (text: string) => {
    try {
      const res = await publish({ text: text, farcasterSigner: farcasterSigner });
      if (!res) throw Error;

      console.log(res)

      if (Math.floor(res.status / 100) === 2) {
        reloadThreads();
        setCastModal(false);
      }
    } catch (error) {
      console.error("Could not send the cast", error);
    }
  };

  return (
    <div>
      <button className="fixed bottom-5 left-5 button" onClick={() => setCastModal(true)}>
        <BiSolidPencil size={18}/>
        {deviceType == "desktop" && <p>Make a point</p>}
      </button>
      {castModal && (
        <Modal setSelected={setCastModal}>
          <InputComponent onPublish={onPublish} placeHolder="Make a good point" onCancel={() => setCastModal(false)} />
        </Modal>
      )}
    </div>
  );
}

export default CastComponent;
