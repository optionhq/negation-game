import axios from "axios";
import { Cast, Node } from "../types/Points";
import isNegation from "./isNegation";
import { extractEndPointUrl } from "./useEndPoints";

export async function getMaybeNegation(cast: Cast): Promise<Node> {
	const maybeNegation = castToNegation(cast);

	if (maybeNegation.endPointUrl) {
		const res = await axios.get(
			`/api/cast?type=url&identifier=${maybeNegation.endPointUrl}`,
		);
		res.status === 200 || console.error("Failed to fetch cast", res);
		if (!res.data) return maybeNegation;
		const endPoint: Node = castToPoint(res.data);
		maybeNegation.endPoint = endPoint;
		if (isNegation(maybeNegation)) maybeNegation.type = "negation";
	}

	return maybeNegation;
}

export async function fetchNegationTargets(node: Node): Promise<Node> {
	if (node.endPointUrl) {
		const res = await axios.get(
			`/api/cast?type=url&identifier=${node.endPointUrl}`,
		);
		res.status === 200 || console.error("Failed to fetch cast", res);
		if (!res.data) return node;
		const endPoint: Node = castToPoint(res.data);
		node.endPoint = endPoint;
		if (isNegation(node)) node.type = "negation";
	}

	return node;
}

export function castToNegation(cast: Cast): Node {
	const endPointUrl = extractEndPointUrl(cast);
	return {
		title: cast.text,
		id: cast.hash,
		author: cast.author,
		parentId: cast.parent_hash as string,
		points: cast.reactions?.likes?.length,
		advocates: cast.reactions?.likes,
		replyCount: cast.replies?.count,
		children: [],
		endPointUrl: endPointUrl || undefined,
		type: "root",
	};
}

export function castToPoint(cast: Cast): Node {
	return {
		title: cast.text,
		id: cast.hash,
		author: cast.author,
		parentId: cast.parent_hash || undefined,
		replyCount: cast.replies?.count,
		advocates: cast.reactions?.likes,
		points: cast.reactions?.likes?.length,
		children: [],
		type: "root",
	};
}
