// src/pages/spaces/[space]/[id]/index.tsx
import React from "react";
import { useRouter } from "next/router";
import ConvoFeed from "@/components/feeds/ConvoFeed";
import PointFeed from "@/components/feeds/PointFeed";

export default function ConversationPage() {
	const router = useRouter();
	if (!router.query.id) return <ConvoFeed />;
	return <PointFeed fromPage="space" />;
}
