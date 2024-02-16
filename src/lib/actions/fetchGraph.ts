"use server";

import { DEFAULT_CHANNELID, ROOT_CAST_ID } from "@/config";
import { extractTruncatedHash } from "@/lib/extractTruncatedHash";
import { isValidNegation } from "@/lib/isValidNegation";
import { GameCast } from "@/types/Cast";
import Cytoscape, {
	CollectionReturnValue,
	EdgeSingular,
	ElementDefinition,
	NodeSingular,
} from "cytoscape";
// @ts-expect-error
import eulerExtension from "cytoscape-euler";
import { sql } from "kysely";
import { queryFarcasterDb } from "../clients/neynarDb";
import { addNegation } from "../cytoscape/addNegation";
import { addPointNode } from "../cytoscape/addPointNode";
import { assignScores } from "../cytoscape/algo/assignScores";

Cytoscape.use(eulerExtension);

const findCast = (
	truncatedHash: string,
	casts: GameCast[],
	searchToIndex: number,
) => {
	for (let i = 0; i < searchToIndex; i++) {
		if (casts[i].hash.startsWith(truncatedHash)) {
			return casts[i];
		}
	}
	return null;
};

export const fetchGraph = async (
	pointId?: string,
): Promise<ElementDefinition[]> => {
	const playlistedFids = process.env.NEXT_PUBLIC_PLAYLIST?.split(",") || [];

	const allNegationGameCasts = await queryFarcasterDb(
		async (client) =>
			await client
				.selectFrom("casts as c")
				.leftJoin("reactions as r", (join) =>
					join
						.onRef("c.hash", "=", "r.target_hash")
						.onRef("c.fid", "=", "r.target_fid")
						.on("r.deleted_at", "is", null)
						.on("r.reaction_type", "=", 1)
						.on("r.fid", "in", playlistedFids),
				)
				.leftJoin("profile_with_addresses as p", (join) =>
					join.onRef("c.fid", "=", "p.fid"),
				)
				.select([
					"p.fname",
					"c.text",
					sql<`0x${string}`>`CONCAT('0x',encode(c.hash, 'hex'))`.as("hash"),
					sql<
						`0x${string}` | null
					>`(CASE WHEN (c.parent_hash IS NULL) THEN NULL ELSE CONCAT('0x',encode(c.parent_hash, 'hex')) END)`.as(
						"parentHash",
					),
					sql<number>`COUNT(r.target_hash)::int`.as("likes"),
				])
				.where((e) =>
					e.and([
						e(
							"c.fid",
							"in",
							sql<string>`(${sql.raw(process.env.NEXT_PUBLIC_PLAYLIST ?? "")})`,
						),
						e("c.deleted_at", "is", null),
						e(
							"c.hash",
							"!=",
							sql<Buffer>`'\\x${sql.raw(`${ROOT_CAST_ID.slice(2)}`)}'::bytea`,
						),
						e("c.root_parent_url", "=", DEFAULT_CHANNELID),
					]),
				)
				.$narrowType<{ fname: string }>()
				.groupBy([
					"p.fname",
					"c.created_at",
					"c.fid",
					"c.hash",
					"c.text",
					"c.embeds",
					"c.parent_hash",
					"c.embeds",
				])
				.orderBy("c.created_at", "asc")
				.execute(),
	);

	const cytoscape = Cytoscape({ headless: true });

	for (let i = 0; i < allNegationGameCasts.length; i++) {
		const negatedNodeHash = allNegationGameCasts[i].parentHash;
		if (negatedNodeHash === null || negatedNodeHash === ROOT_CAST_ID) {
			// console.log("adding point node", allNegationGameCasts[i]);
			addPointNode(cytoscape, allNegationGameCasts[i]);

			continue;
		}

		if (!isValidNegation(allNegationGameCasts[i].text)) {
			// console.log("invalid negation", allNegationGameCasts[i]);
			continue;
		}

		const truncatedFromHash = extractTruncatedHash(
			allNegationGameCasts[i].text,
		);
		if (truncatedFromHash === null) {
			// console.log("negating cast embed not found", allNegationGameCasts[i]);
			continue;
		}

		const negatingCast = findCast(truncatedFromHash, allNegationGameCasts, i);
		if (negatingCast === null) {
			// console.log("negating cast not found", allNegationGameCasts[i]);
			continue;
		}

		const negatingNode = cytoscape.getElementById(negatingCast.hash);
		if (negatingNode.empty()) {
			// console.log("negating node not found", allNegationGameCasts[i]);
			continue;
		}

		const negatedNode = cytoscape.getElementById(negatedNodeHash);
		if (negatedNode.empty()) {
			// console.log("negated node not found", allNegationGameCasts[i]);
			continue;
		}

		try {
			addNegation(
				cytoscape,
				allNegationGameCasts[i],
				negatingNode,
				negatedNode,
				true,
			);
		} catch (error) {
			console.error("error adding", allNegationGameCasts[i], error?.toString());
		}
	}

	const elements: CollectionReturnValue =
		pointId ?
			cytoscape
				.getElementById(pointId)
				// @ts-expect-error
				.component()
			// ? extendedClosedNeighborhood(pointId, cy.elements(), 2)
		:	cytoscape.elements();

	assignScores(elements);

	elements.layout({ name: "grid" }).run();

	// console.log(elements.jsons());

	return new Promise((resolve) => {
		return elements
			.layout({
				name: "euler",
				// @ts-expect-error
				springLength: (edge) => 400,
				springCoeff: (edge: EdgeSingular) => 0.0008,
				mass: (node: NodeSingular) => (node.hasClass("point") ? 100 : 10),
				gravity: -3,
				pull: 0.002,
				theta: 0.888,
				dragCoeff: 0.02,
				movementThreshold: 1,
				timeStep: 100,
				refresh: 10,
				maxIterations: 1000,
				maxSimulationTime: 4000,
				fit: false,
				animate: false,
				boundingBox: { x1: 0, y1: 0, w: 1000, h: 1000 },

				stop: () => {
					resolve(
						elements.filter("[!aux]").jsons() as unknown as ElementDefinition[],
					);
				},
			})
			.run();
	});
};
