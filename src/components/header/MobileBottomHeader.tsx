import HeaderElement from "./HeaderElement"
import { usePathname } from "next/navigation"
import { HiHome } from "react-icons/hi";
import { MdNotifications } from "react-icons/md";
import { BiSolidGroup } from "react-icons/bi";
import { useSigner } from "@/contexts/SignerContext";

export default function MobileBottomHeader(){
  const { signer } = useSigner()
  const pathName = usePathname()

    return(
        <ul className="flex sm:hidden flex-row gap-1 text-sm items-center w-full justify-center p-1 bg-slate-50 border sticky bottom-0">
        <HeaderElement Icon={HiHome} name="Home" path="/" currentPath={pathName == "/"} />
        <HeaderElement Icon={BiSolidGroup} name="Spaces" path="/spaces" currentPath={pathName == "/spaces"} />
        {signer &&
          <HeaderElement Icon={MdNotifications} name="Notifications" path="/notifications" currentPath={pathName == "/notifications"} />
        }
      </ul>
    )
}

