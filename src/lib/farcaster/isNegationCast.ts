import { CastWithInteractions } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { isValidNegation } from "../isValidNegation";

export const isNegationCast = (cast: CastWithInteractions) => {
	return isValidNegation(cast.text);
};
