"use client";
import { SPACES } from "@/config";
import Link from "next/link";

const infos: { [key: string]: { description: string } } = {
	purple: {
		description:
			"Purple is a DAO whose goal is to proliferate and expand the Farcaster protocol and ecosystem. We will fund small grants via Prop House and larger on-chain proposals which proliferate Farcaster and/or build on top of the protocol.",
	},
	negationgame: {
		description: "How extraterrestrials do governance.",
	},
};

export default function Page() {
	return (
		<div className="flex-1 flex items-center gap-6 pb-6 sm:gap-12 sm:pb-12 relative  flex-col">
			<div className="w-full top-0 left-0 right-0 bg-purple-900/80 text-white p-3 flex flex-row items-center justify-center">
				<div>
					Want to open a space in the negation game ? Ping Connor&nbsp;{" "}
					<a
						href="https://warpcast.com/nor"
						target="_blank"
						rel="noreferrer"
						className="font-medium underline"
					>
						{" "}
						here.
					</a>
				</div>
			</div>
			<div className="flex flex-row flex-wrap justify-center gap-4">
				{Object.keys(SPACES).map((space, i) => {
					return (
						<button
							type="button"
							key={space}
							className=" border rounded-md p-4 w-80 items-start shadow-lg hover:shadow-xl transition-shadow duration-200 ease-in-out"
						>
							<Link
								href={`/spaces/${space}`}
								className="flex flex-col gap-2 items-start"
							>
								<div className="flex flex-row items-center gap-4">
									<div
										className="rounded-full w-10 h-10"
										style={{ backgroundColor: "#8A63D2" }}
									/>
									<h3 className="font-medium text-xl">
										{space.charAt(0).toUpperCase() + space.slice(1)}
									</h3>
								</div>
								<p className=" text-gray-500 text-left">
									{infos[space]?.description}
								</p>
								<p className="text-gray-500">
									<strong>Conversations</strong> : {SPACES[space]?.length}
								</p>
							</Link>
						</button>
					);
				})}
			</div>
		</div>
	);
}
