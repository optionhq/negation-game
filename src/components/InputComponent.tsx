import React, { useEffect, useState, useRef } from "react";

const MAX_CHAR_PER_CAST = 320;

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && (event.key === "Enter" || event.key === "Return")) {
        // Click the publish button
        text && onPublish(text);
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [text, onPublish]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <div
      className={
        pointBg +
        "w-full flex flex-col relative gap-3 font-medium cursor-pointer list-none px-5 py-3 rounded-md order-first border"
      }
      onClick={(e) => e.stopPropagation()}
      >
      <textarea
        ref={textareaRef}
        placeholder={placeHolder}
        className="w-full h-36 caret-purple-900 border-1"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="w-full flex justify-between">
        <p className={` text-sm  text-black/60`}><span className={`${text.length > MAX_CHAR_PER_CAST ? "text-red-500": ""}`}>{text.length}</span>/{MAX_CHAR_PER_CAST}</p>
        <div className="flex gap-2">
          <button className="secondary-button" onClick={onCancel}>
            Cancel
          </button>
          <button
            className={`button`}
            onClick={() => {
              text && onPublish(text);
            }}
            disabled={text.length == 0 || text.length > MAX_CHAR_PER_CAST}>
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}