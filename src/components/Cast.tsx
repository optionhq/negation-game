import React, { useState } from "react";
import { BiSolidPencil } from "react-icons/bi"
import Modal from "./Modal"
import { InputComponent } from "."
import { Signer } from "neynar-next/server"
import publish from "@/lib/publish"

function CastComponent({ farcasterSigner, reloadThreads }: { farcasterSigner: Signer; reloadThreads: () => void }) {
  const [castModal, setCastModal] = useState(false);

  const onPublish = async (text: string) => {
    try {
      const resp = await publish({ text: text, farcasterSigner: farcasterSigner });
      if (!resp) throw Error;

      if (resp.status === 200) {
        reloadThreads();
        setCastModal(false);
      }
    } catch (error) {
      console.error("Could not send the cast", error);
    }
  };

  return (
    <div>
      <button className="fixed bottom-3 left-3 button" onClick={() => setCastModal(true)}>
        <BiSolidPencil />
        <p>Make a Point</p>
      </button>
      {castModal && (
        <Modal setSelected={setCastModal}>
          <InputComponent onPublish={onPublish} placeHolder="Enter a new point!" onCancel={() => setCastModal(false)} />
        </Modal>
      )}
    </div>
  );
}

export default CastComponent;
