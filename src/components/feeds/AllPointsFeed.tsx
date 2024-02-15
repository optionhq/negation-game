"use client";

import LoadingPane from "@/app/loading";
import { fetchAllPoints } from "@/lib/actions/fetchAllPoints";
import { Node } from "@/types/Points";
import useSWRInfinite from "swr/infinite";
import { useIntersectionObserver, useUpdateEffect } from "usehooks-ts";
import { Loader } from "../Loader";
import MakePointButton from "../MakePointButton";
import PointWrapper from "../points/PointWrapper";

export const ALL_POINTS_KEY = "allPoints";

export default function AllPointsFeed() {
	const {
		data: pointPages,
		mutate: refreshCasts,
		setSize,
	} = useSWRInfinite(
		(pageNumber, previousPageData) => {
			if (previousPageData && previousPageData.length === 0) return null;
			return ["allPoints", pageNumber];
		},
		([, pageNumber]) => fetchAllPoints({ pageNumber, pageSize: 10 }),
		{ revalidateFirstPage: false },
	);

	const { ref: loaderRef, isIntersecting } = useIntersectionObserver({
		rootMargin: "2000px",
	});

	useUpdateEffect(() => {
		if (!isIntersecting) return;

		setSize((size) => size + 1);
	}, [isIntersecting, setSize]);

	if (!pointPages) return <LoadingPane />;

	return (
		<div className="relative flex flex-col items-center gap-4 py-4">
			<div className="centered-element flex flex-col gap-1">
				{pointPages?.flatMap((page) =>
					page.map((e: Node, i: number) => (
						<PointWrapper
							key={e.id}
							level={0}
							point={e}
							parent={undefined}
							setParentChildren={() => {}}
							getParentAncestry={undefined}
							refreshParentThread={async () => {
								await refreshCasts();
							}}
						/>
					)),
				)}
			</div>
			<div ref={loaderRef}>
				<Loader />
			</div>

			<MakePointButton
				classNames={{ button: "sticky bottom-4 z-50 mx-5 self-end shadow-md" }}
				refreshThread={async () => {
					await refreshCasts();
				}}
			/>
		</div>
	);
}
