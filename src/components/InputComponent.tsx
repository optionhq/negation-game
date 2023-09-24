export default function InputComponent({
  paddingLeft,
  pointBg: claimBg,
  parent,
  removeInput
}: {
  paddingLeft: string;
  pointBg: string;
  parent: string;
  removeInput: () => void
}) {


  return (
    <div
      className={claimBg + " claim flex flex-col order-first border-2 border-black"}
      onClick={(e) => e.stopPropagation()}
      style={{ paddingLeft: paddingLeft }}>
      <textarea placeholder={"The claim `" + parent + "` is not true because ..."} className="w-full h-36" />
      <div className="w-full flex gap-2 justify-end">
        <button className="border border-slate-600 px-3 py-2 rounded-md" onClick={removeInput}>
          Cancel
        </button>
        <button className=" bg-slate-600 px-3 py-2 text-white rounded-md">Publish</button>
      </div>
    </div>
  );
}
