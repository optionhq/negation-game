import { Node } from "../types/Points";
import { isValidNegation } from "./isValidNegation";

const isNegation = (entry: Node): boolean => {
	if (entry.endPoint && isValidNegation(entry.title)) {
		return true;
	} else {
		return false;
	}
};

export default isNegation;
