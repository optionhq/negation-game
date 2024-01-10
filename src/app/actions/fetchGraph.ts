"use server";

import { extractTruncatedHash } from "@/lib/extractTruncatedHash";
import { isValidNegation } from "@/lib/isValidNegation";
import cytoscape, { ElementsDefinition } from "cytoscape";

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
  const allNegationGameCasts = (await fetch(
    "https://data.hubs.neynar.com/api/queries/243/results",
    {
      method: "POST",
      headers: { Authorization: `Key ${process.env.NEYNAR_REDASH_API_KEY}` },
      body: JSON.stringify({ max_age: 65 }),
    }
  ).then((res) => res.json())) as {
    query_result: {
      data: {
        rows: Cast[];
      };
    };
  };

  const casts = allNegationGameCasts.query_result.data.rows;

  const cy = cytoscape({ headless: true });

  for (let i = 0; i < casts.length; i++) {
    if (casts[i].parent_hash === null) {
      cy.add({
        group: "nodes",
        data: { id: casts[i].hash, text: casts[i].text, likes: casts[i].likes },
        classes: "point",
      });

      continue;
    }

    if (!isValidNegation(casts[i].text)) {
      try {
        cy.add([
          {
            group: "nodes",
            data: {
              id: casts[i].hash,
              likes: casts[i].likes,
              text: casts[i].text,
            },
            classes: "comment",
          },
          {
            group: "edges",
            data: {
              id: `comment-${casts[i].hash}`,
              source: casts[i].hash,
              target: casts[i].parent_hash,
            },
            classes: "commenting",
          },
        ]);
      } catch (_) {}

      continue;
    }

    const truncatedFromHash = extractTruncatedHash(casts[i].text);
    if (truncatedFromHash === null) {
      continue;
    }

    const negatingCast = findCast(truncatedFromHash, casts, i);
    if (negatingCast === null) {
      continue;
    }

    try {
      cy.add([
        {
          group: "nodes",
          data: { id: casts[i].hash, likes: casts[i].likes },
          classes: "negation",
        },
        {
          group: "edges",
          data: {
            id: `has-${casts[i].hash}`,
            source: negatingCast.hash,
            target: casts[i].hash,
          },
          classes: "has",
        },
        {
          group: "edges",
          data: {
            id: `negating-${casts[i].hash}`,
            source: casts[i].hash,
            target: casts[i].parent_hash,
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
