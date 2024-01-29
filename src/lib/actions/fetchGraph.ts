"use server";

import { DEFAULT_CHANNELID } from "@/constants";
import { extractTruncatedHash } from "@/lib/extractTruncatedHash";
import { isValidNegation } from "@/lib/isValidNegation";
import cytoscape, {
  CollectionReturnValue,
  ElementsDefinition,
} from "cytoscape";
import { getFarcasterDb } from "../../app/getFarcasterDb";

interface Cast {
  hash: string;
  text: string;
  parent_hash: string | null;
  likes: number;
}

const findCast = (
  truncatedHash: string,
  casts: Cast[],
  searchToIndex: number
) => {
  for (let i = 0; i < searchToIndex; i++) {
    if (casts[i].hash.startsWith(truncatedHash)) {
      return casts[i];
    }
  }
  return null;
};

export const fetchGraph = async (
  pointId?: string
): Promise<ElementsDefinition> => {
  const farcasterDb = await getFarcasterDb();

  // TODO: filter query using pointId
  const allNegationGameCasts = (await farcasterDb
    .query(
      `
  SELECT
    -- c.created_at,
    encode(c.hash, 'hex') AS hash,
    c.text,
    encode(c.parent_hash, 'hex') AS parent_hash,
    -- c.embeds,
    COUNT(r.target_hash)::int AS likes
FROM
    casts c
LEFT JOIN
    reactions r ON r.deleted_at IS NULL AND c.hash = r.target_hash AND c.fid = r.target_fid AND r.reaction_type = 1 AND r.fid IN (${process.env.NEXT_PUBLIC_PLAYLIST})
WHERE
    c.fid IN (${process.env.NEXT_PUBLIC_PLAYLIST}) AND
    (c.parent_url = '${DEFAULT_CHANNELID}' OR c.root_parent_url = '${DEFAULT_CHANNELID}')
GROUP BY
    c.created_at, c.fid, c.hash, c.text, c.embeds, c.parent_hash, c.embeds
ORDER BY c.created_at ASC;`
    )
    .then((res) => res.rows)) as Cast[];

  // TODO: encapsulate this in a queryFarcasterDb function
  farcasterDb.end();

  const cy = cytoscape({ headless: true });

  for (let i = 0; i < allNegationGameCasts.length; i++) {
    const isCurrentPoint = allNegationGameCasts[i].hash === pointId;
    if (allNegationGameCasts[i].parent_hash === null) {
      cy.add({
        group: "nodes",
        data: {
          id: allNegationGameCasts[i].hash,
          text: allNegationGameCasts[i].text,
          likes: allNegationGameCasts[i].likes,
        },
        classes: ["point", ...(isCurrentPoint ? ["current-point"] : [])],
      });

      continue;
    }

    if (!isValidNegation(allNegationGameCasts[i].text)) continue;

    const truncatedFromHash = extractTruncatedHash(
      allNegationGameCasts[i].text
    );
    if (truncatedFromHash === null) {
      continue;
    }

    const negatingCast = findCast(truncatedFromHash, allNegationGameCasts, i);
    if (negatingCast === null) {
      continue;
    }

    try {
      cy.add([
        {
          group: "nodes",

          data: {
            id: allNegationGameCasts[i].hash,
            likes: allNegationGameCasts[i].likes,
          },
          classes: "negation",
        },
        {
          group: "edges",
          data: {
            id: `negation-${allNegationGameCasts[i].hash}`,
            source: negatingCast.hash,
            target: allNegationGameCasts[i].parent_hash,
          },
          classes: "negation",
        },
        {
          group: "edges",
          data: {
            id: `to-source-${allNegationGameCasts[i].hash}`,
            source: allNegationGameCasts[i].hash,
            target: negatingCast.hash,
            aux: true,
          },
          classes: "aux",
        },
        {
          group: "edges",
          data: {
            id: `to-target-${allNegationGameCasts[i].hash}`,
            source: allNegationGameCasts[i].hash,
            target: allNegationGameCasts[i].parent_hash,
            aux: true,
          },
          classes: "aux",
        },
      ]);
    } catch (error) {}
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
  maxDepth: number
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
