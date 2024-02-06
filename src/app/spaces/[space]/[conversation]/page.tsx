"use client";
import ConvoFeed from "@/components/feeds/ConvoFeed";
import PointFeed from "@/components/feeds/PointFeed";
import { usePointIds } from "@/lib/hooks/usePointIds";

export default function Page({
	params: { conversation },
}: { params: { conversation: string } }) {
	const { ids } = usePointIds();
	if (!ids) return <ConvoFeed conversation={conversation} />;
	return <PointFeed fromPage="space" />;
}
