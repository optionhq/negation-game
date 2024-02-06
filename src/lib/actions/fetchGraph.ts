"use server";

import { DEFAULT_CHANNELID } from "@/config";
import { extractTruncatedHash } from "@/lib/extractTruncatedHash";
import { isValidNegation } from "@/lib/isValidNegation";
import { Cast } from "@/types/Cast";
import Cytoscape, {
	CollectionReturnValue,
	EdgeSingular,
	ElementDefinition,
	NodeSingular,
} from "cytoscape";
// @ts-expect-error
import eulerExtension from "cytoscape-euler";
import { neynarDb } from "../clients/neynarDb";
import { addNegation } from "../cytoscape/addNegation";
import { addPointNode } from "../cytoscape/addPointNode";
import { assignScores } from "../cytoscape/algo/assignScores";

Cytoscape.use(eulerExtension);

const findCast = (
	truncatedHash: string,
	casts: Cast[],
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
	const allNegationGameCasts = (await neynarDb(
		async (client) =>
			await client
				.query(
					`
  SELECT
    -- c.created_at,
    p.fname,
    CONCAT('0x',encode(c.hash, 'hex')) AS hash,
    c.text,
    (CASE WHEN (c.parent_hash IS NULL) THEN NULL ELSE CONCAT('0x',encode(c.parent_hash, 'hex')) END) AS "parentHash",
    -- c.embeds,
    COUNT(r.target_hash)::int AS likes
FROM
    casts c
LEFT JOIN
    reactions r ON r.deleted_at IS NULL AND c.hash = r.target_hash AND c.fid = r.target_fid AND r.reaction_type = 1 AND r.fid IN (${process.env.NEXT_PUBLIC_PLAYLIST})
LEFT JOIN
    profile_with_addresses p on c.fid = p.fid
WHERE
    c.fid IN (${process.env.NEXT_PUBLIC_PLAYLIST}) AND
    (c.parent_url = '${DEFAULT_CHANNELID}' OR c.root_parent_url = '${DEFAULT_CHANNELID}') AND
    c.deleted_at IS NULL
GROUP BY
    p.fname, c.created_at, c.fid, c.hash, c.text, c.embeds, c.parent_hash, c.embeds
ORDER BY c.created_at ASC;`,
				)
				.then((res) => res.rows),
	)) as Cast[];

	const cytoscape = Cytoscape({ headless: true });

	for (let i = 0; i < allNegationGameCasts.length; i++) {
		const negatedNodeHash = allNegationGameCasts[i].parentHash;
		if (negatedNodeHash === null) {
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

	const elements: CollectionReturnValue = pointId
		? cytoscape
				.getElementById(pointId)
				// @ts-expect-error
				.component()
		: // ? extendedClosedNeighborhood(pointId, cy.elements(), 2)
		  cytoscape.elements();

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
