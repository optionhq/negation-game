import { Node } from "../types/Points";
import { isValidNegation } from "./isValidNegation";

const isNegation = (entry: Node): boolean => {
	if (entry.endPoint && isValidNegation(entry.title)) {
		return true;
	}
	return false;
};

export default isNegation;
