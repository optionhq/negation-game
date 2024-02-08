"use client";
import ConversationPreview from "@/components/ConversationPreview";
import { SPACES } from "@/config";

export default function Page({
	params: { space },
}: {
	params: { space: string };
}) {
	return (
		<div className="my-12 flex h-full flex-col items-center  gap-2">
			{SPACES[space]?.map((id: string) => (
				<ConversationPreview key={id} id={id} />
			))}
		</div>
	);
}
