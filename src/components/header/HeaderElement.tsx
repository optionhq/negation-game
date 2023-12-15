import Link from "next/link";
import { IconType } from "react-icons";


export default function HeaderElement({ name, Icon, path, currentPath }: { name: string, Icon: IconType, path: string, currentPath: boolean }) {
  return (
    <button className=" ">
      <Link href={path} className="flex flex-row items-center gap-2 px-4 py-2 w-28 md:w-40 hover:bg-black/5 justify-center rounded-md ">
        <Icon color={currentPath ? "#000" : "#BBB"} size={16} />
        <p className={`${currentPath ? " font-medium" : " text-black/70"}`}>{name}</p>
      </Link>
    </button>
  )
}