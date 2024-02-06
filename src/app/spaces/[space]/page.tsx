"use client";
import ConversationPreview from "@/components/ConversationPreview";
import { SPACES } from "@/config";

export default function Page({
	params: { space },
}: { params: { space: string } }) {
	return (
		<div className="flex flex-col gap-2 h-full items-center  my-12">
			{SPACES[space]?.map((id: string) => (
				<ConversationPreview key={id} id={id} />
			))}
		</div>
	);
}
