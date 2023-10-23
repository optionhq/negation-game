import { User } from "neynar-next/server";
import Image from "next/image";

export default function ProfilePreview({user}: {user: User}){
    return(
        <div className="flex flex-row gap-2 mb-2">
            {user.pfp.url && <Image src={user.pfp.url} alt={user.username + "pfp"} className="rounded-full bg-contain" width="40" height="40"/>}
            <div className="flex flex-col">
                <strong>{user.displayName}</strong>
                <p>{user.username}</p>

            </div>
        </div>
    )
}