import React, { useState } from "react";

export default function InputComponent({
  paddingLeft = "20px",
  pointBg = "bg-white ",
  placeHolder,
  onCancel,
  onPublish,
}: {
  paddingLeft?: string;
  pointBg?: string;
  placeHolder: string;
  onCancel: () => void;
  onPublish: (text: string) => Promise<void>;
}) {
  const [text, setText] = useState("");

  return (
    <div
      className={
        pointBg +
        "w-full flex flex-col relative gap-3 font-medium cursor-pointer list-none px-5 py-3 rounded-md order-first border"
      }
      onClick={(e) => e.stopPropagation()}
      style={{ paddingLeft: paddingLeft }}>
      <textarea
        placeholder={placeHolder}
        className="w-full h-36 bg-teal-500/10 caret-teal-500"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="w-full flex gap-2 justify-end">
        <button className="secondary-button" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="button"
          onClick={() => {
            onPublish(text);
          }}>
          Publish
        </button>
      </div>
    </div>
  );
}
