"use client";
import HomeFeed from "@/components/feeds/HomeFeed";
import PointFeed from "@/components/feeds/PointFeed";
import { fetchGraph } from "@/lib/actions/fetchGraph";
import { usePointIds } from "@/lib/hooks/usePointIds";
import { useMemo } from "react";
import useSWR from "swr";

interface PointParams {
	id: string;
}

export default function Page() {
	const [ids] = usePointIds();

	return ids ? <PointFeed fromPage="home" /> : <HomeFeed />;
}
