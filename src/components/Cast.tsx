"use client"
import React, { useState, useEffect } from "react";
import { BiSolidPencil } from "react-icons/bi"
import Modal from "./Modal"
import { InputComponent } from "."
import { Signer } from "neynar-next/server"
import publish from "@/lib/publish"
import { getDeviceType } from "@/lib/getDeviceType";
import { useSigner } from "neynar-next";

function CastComponent({ reloadThreads, conversationId }: { reloadThreads: () => void, conversationId: string | string[] | undefined }) {
  const [castModal, setCastModal] = useState(false);
  const { signer } = useSigner()
  const [deviceType, setDeviceType] = useState("");

  let parentId: string | null = null;
  if (Array.isArray(conversationId)) {
    parentId = conversationId[0];
  } else if ( conversationId ) {
    parentId = conversationId;
  } else {
    parentId = null
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDeviceType(getDeviceType());
    }
  }, []);

  const onPublish = async (text: string) => {
    if (!signer) return
    try {
      const res = await publish({ text: text, signer: signer, parentId: parentId });
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
    <>
      {signer && (
        <div>
          <button className="fixed bottom-16 z-50 sm:bottom-5 right-5 button" onClick={() => setCastModal(true)}>
            <BiSolidPencil size={18} />
            {deviceType == "desktop" && <p>Make a point</p>}
          </button>
          {castModal && (
            <Modal setSelected={setCastModal}>
              <InputComponent onPublish={onPublish} placeHolder="Make a good point" onCancel={() => setCastModal(false)} />
            </Modal>
          )}
        </div>
      )}
    </>
  );
}

export default CastComponent;
