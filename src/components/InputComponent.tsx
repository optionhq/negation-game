import React, { useState } from 'react';

export default function InputComponent({
  paddingLeft,
  pointBg: claimBg,
  parentText,
  parentId,
  removeInput,
  onPublish
}: {
  paddingLeft: string;
  pointBg: string;
  parentText: string;
  parentId: string;
  removeInput: () => void
  onPublish: ({text, parentId}: {text: string, parentId: string}) => void
}) {
  const [text, setText] = useState('');
  console.log("InputComponent", text, parentId)

  return (
    <div
      className={claimBg + " claim flex flex-col order-first border-2 border-black"}
      onClick={(e) => e.stopPropagation()}
      style={{ paddingLeft: paddingLeft }}>
      <textarea 
        placeholder={"The claim `" + parentText + "` is not true because ..."} 
        className="w-full h-36" 
        value={text} 
        onChange={(e) => setText(e.target.value)}
      />
      <div className="w-full flex gap-2 justify-end">
        <button className="border border-slate-600 px-3 py-2 rounded-md" onClick={removeInput}>
          Cancel
        </button>
        <button className=" bg-slate-600 px-3 py-2 text-white rounded-md" onClick={() => {
          onPublish({text: text, parentId: parentId});
        }}>Publish</button>
      </div>
    </div>
  );
}