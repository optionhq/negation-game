import { User } from "neynar-next/server";
import Image from "next/image";

export default function ProfilePreview({ user }: { user: User }) {
	return (
		<div className="mb-2 flex flex-row gap-2">
			{user.pfp_url && (
				<Image
					src={user.pfp_url}
					alt={user.username + "pfp"}
					className="rounded-full bg-contain"
					width="40"
					height="40"
				/>
			)}
			<div className="flex flex-col">
				<strong>{user.display_name}</strong>
				<p>{user.username}</p>
			</div>
		</div>
	);
}
