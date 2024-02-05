"use server";

import { DEFAULT_CHANNELID } from "@/config";
import { extractTruncatedHash } from "@/lib/extractTruncatedHash";
import { isValidNegation } from "@/lib/isValidNegation";
import { Cast } from "@/types/Cast";
import Cytoscape, {
	CollectionReturnValue,
	EdgeSingular,
	ElementsDefinition,
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
): Promise<ElementsDefinition> => {
	const allNegationGameCasts = (await neynarDb(
		async (client) =>
			await client
				.query(
					`
  SELECT
    -- c.created_at,
    p.fname,
    encode(c.hash, 'hex') AS hash,
    c.text,
    encode(c.parent_hash, 'hex') AS "parentHash",
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
			addPointNode(cytoscape, allNegationGameCasts[i]);

			continue;
		}

		if (!isValidNegation(allNegationGameCasts[i].text)) continue;

		const truncatedFromHash = extractTruncatedHash(
			allNegationGameCasts[i].text,
		);
		if (truncatedFromHash === null) {
			continue;
		}

		const negatingCast = findCast(truncatedFromHash, allNegationGameCasts, i);
		if (negatingCast === null) {
			continue;
		}

		const negatingNode = cytoscape.getElementById(negatingCast.hash);
		if (negatingNode.empty()) {
			continue;
		}

		const negatedNode = cytoscape.getElementById(negatedNodeHash);
		if (negatedNode.empty()) {
			continue;
		}

		try {
			addNegation(
				cytoscape,
				allNegationGameCasts[i],
				negatingNode,
				negatedNode,
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

	// console.log(elements.nodes().map((e) => e.data()));

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
				randomize: true,
				boundingBox: { x1: 0, y1: 0, w: 1000, h: 1000 },

				stop: () => {
					resolve(
						elements.filter("[!aux]").jsons() as unknown as ElementsDefinition,
					);
				},
			})
			.run();
	});
};
