"use client";
import HomeFeed from "@/components/feeds/HomeFeed";
import PointFeed from "@/components/feeds/PointFeed";
import { usePointIds } from "@/lib/hooks/usePointIds";

interface PointParams {
	id: string;
}

export default function Page() {
	const [ids] = usePointIds();

	if (!ids) return <HomeFeed />;
	return <PointFeed fromPage="home" />;
}
