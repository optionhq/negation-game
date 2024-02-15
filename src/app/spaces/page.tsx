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
		<div className="relative flex flex-1 flex-col items-center gap-6 overflow-scroll pb-6  sm:gap-12 sm:pb-12">
			<div className="left-0 right-0 top-0 flex w-full flex-row items-center justify-center bg-purple-900/80 p-3 text-white">
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
							className=" w-80 items-start rounded-md border p-4 shadow-lg transition-shadow duration-200 ease-in-out hover:shadow-xl"
						>
							<Link
								href={`/spaces/${space}`}
								className="flex flex-col items-start gap-2"
							>
								<div className="flex flex-row items-center gap-4">
									<div
										className="h-10 w-10 rounded-full"
										style={{ backgroundColor: "#8A63D2" }}
									/>
									<h3 className="text-xl font-medium">
										{space.charAt(0).toUpperCase() + space.slice(1)}
									</h3>
								</div>
								<p className=" text-left text-gray-500">
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
