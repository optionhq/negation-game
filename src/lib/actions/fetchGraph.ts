"use server";

import { DEFAULT_CHANNELID } from "@/config";
import { extractTruncatedHash } from "@/lib/extractTruncatedHash";
import { isValidNegation } from "@/lib/isValidNegation";
import { Cast } from "@/types/Cast";
import cytoscape, {
	CollectionReturnValue,
	ElementsDefinition,
} from "cytoscape";
import { neynarDb } from "../clients/neynarDb";
import { addNegationEdge } from "../cytoscape/addNegationEdge";
import { addPointNode } from "../cytoscape/addPointNode";

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

	const cy = cytoscape({ headless: true });

	for (let i = 0; i < allNegationGameCasts.length; i++) {
		if (allNegationGameCasts[i].parentHash === null) {
			addPointNode(cy, allNegationGameCasts[i]);

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

		try {
			addNegationEdge(cy, allNegationGameCasts[i], negatingCast.hash);
		} catch (error) {
			console.error("error adding", allNegationGameCasts[i].hash);
		}
	}

	const elements: CollectionReturnValue = pointId
		? cy
				.getElementById(pointId)
				// @ts-expect-error
				.component()
		: // ? extendedClosedNeighborhood(pointId, cy.elements(), 2)
		  cy.elements();

	return (
		elements
			// .filter("[!aux]")
			.jsons() as unknown as ElementsDefinition
	);
};

const extendedClosedNeighborhood = (
	rootId: string,
	allNodes: CollectionReturnValue,
	maxDepth: number,
) => {
	let extendedClosedNeighborhood = allNodes
		.cy()
		.collection([allNodes.getElementById(rootId)]);

	allNodes.breadthFirstSearch({
		roots: allNodes.getElementById(rootId),
		visit: (current, sourceEdge, previous, index, depth) => {
			if (depth > maxDepth) {
				return false;
			}
			current.data("depth", depth);
			extendedClosedNeighborhood = extendedClosedNeighborhood.add(current);
			if (sourceEdge)
				extendedClosedNeighborhood = extendedClosedNeighborhood.add(sourceEdge);
		},
		directed: false,
	});

	return extendedClosedNeighborhood;
};
