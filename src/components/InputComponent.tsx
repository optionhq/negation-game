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
      className={claimBg + "flex flex-col relative gap-3 font-medium cursor-pointer list-none px-5 py-3 rounded-md order-first border border-black"}
      onClick={(e) => e.stopPropagation()}
      style={{ paddingLeft: paddingLeft }}>
      <textarea placeholder={"The claim `" + parent + "` is not true because ..."} className="w-full h-36" />
      <div className="w-full flex gap-2 justify-end">
        <button className="secondary-button" onClick={removeInput}>
          Cancel
        </button>
        <button className="button">Publish</button>
      </div>
    </div>
  );
}
