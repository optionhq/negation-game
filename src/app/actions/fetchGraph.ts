"use server";

import { DEFAULT_CHANNELID } from "@/constants";
import { extractTruncatedHash } from "@/lib/extractTruncatedHash";
import { isValidNegation } from "@/lib/isValidNegation";
import cytoscape, { ElementsDefinition } from "cytoscape";
import { getFarcasterDb } from "../getFarcasterDb";

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

// TODO: use SQL query directly
export const fetchGraph = async (
  pointId?: string
): Promise<ElementsDefinition> => {
  const farcasterDb = await getFarcasterDb();

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

  const cy = cytoscape({ headless: true });

  for (let i = 0; i < allNegationGameCasts.length; i++) {
    if (allNegationGameCasts[i].parent_hash === null) {
      cy.add({
        group: "nodes",
        data: {
          id: allNegationGameCasts[i].hash,
          text: allNegationGameCasts[i].text,
          likes: allNegationGameCasts[i].likes,
        },
        classes: "point",
      });

      continue;
    }

    if (!isValidNegation(allNegationGameCasts[i].text)) {
      try {
        cy.add([
          {
            group: "nodes",
            data: {
              id: allNegationGameCasts[i].hash,
              likes: allNegationGameCasts[i].likes,
              text: allNegationGameCasts[i].text,
            },
            classes: "comment",
          },
          {
            group: "edges",
            data: {
              id: `comment-${allNegationGameCasts[i].hash}`,
              source: allNegationGameCasts[i].hash,
              target: allNegationGameCasts[i].parent_hash,
            },
            classes: "commenting",
          },
        ]);
      } catch (_) {}

      continue;
    }

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
            id: `has-${allNegationGameCasts[i].hash}`,
            source: negatingCast.hash,
            target: allNegationGameCasts[i].hash,
          },
          classes: "has",
        },
        {
          group: "edges",
          data: {
            id: `negating-${allNegationGameCasts[i].hash}`,
            source: allNegationGameCasts[i].hash,
            target: allNegationGameCasts[i].parent_hash,
          },
          classes: "negating",
        },
      ]);
    } catch (error) {}
  }

  const elements = pointId
    ? //@ts-expect-error
      cy.getElementById(pointId).component()
    : cy.elements();

  return elements.jsons();
};
