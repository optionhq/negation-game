import { NEGATION_SYMBOL } from "@/constants";
import { okUrls } from "./useEndPoints";

export const isValidNegation = (title: string): boolean => {
  // a title is a valid negation if it starts with NEGATION_SYMBOL
  // and is then followed by any number of whitespace or newline characters
  // and finally followed by an okUrl
  for (let url of okUrls) {
    const negationRegex = new RegExp(
      `^${NEGATION_SYMBOL}\\s*${url.source}\\s*$`
    );
    if (negationRegex.test(title)) {
      return true;
    }
  }
  return false;
};
