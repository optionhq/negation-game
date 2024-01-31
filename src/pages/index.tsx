import HomeFeed from "@/components/feeds/HomeFeed";
import PointFeed from "@/components/feeds/PointFeed";
import { useRouter } from "next/router";

export default function HomePage() {
	const router = useRouter();
	if (!router.query.id) return <HomeFeed />;
	return <PointFeed fromPage="home" />;
}
