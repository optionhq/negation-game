import Link from "next/link";
import { IconType } from "react-icons";


export default function HeaderElement({name, Icon, path, currentPath}: {name: string, Icon:IconType, path: string, currentPath: boolean}){
    return(
        <button className=" w-28 md:w-36 hover:bg-black/5 flex items-center justify-center rounded-md px-4 py-2">
        <Link href={path} className="flex flex-row items-center gap-2">
          <Icon color={currentPath ? "#000": "#BBB"} size={16}/>
          <p className={`${currentPath ? " font-medium" : " text-black/70"}`}>{name}</p>
        </Link>
      </button>    
    )
}