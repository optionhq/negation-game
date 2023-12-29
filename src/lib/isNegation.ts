import { okUrls } from "./useEndPoints";
import { Node } from "../types/Points";
import { NEGATION_SYMBOL } from '../constants'

const validNegation = (title: string): boolean => {
  // a title is a valid negation if it starts with NEGATION_SYMBOL 
  // and is then followed by any number of whitespace or newline characters
  // and finally followed by an okUrl
  for (let url of okUrls) {
    const negationRegex = new RegExp(`^${NEGATION_SYMBOL}\\s*${url.source}\\s*$`);
    if (negationRegex.test(title)) {
      return true;
    }
  }
  return false;
}

const isNegation = (entry: Node): boolean => {
  if (entry.endPoint && validNegation(entry.title)) {
    return true;
  } else {
    return false;
  }
}

export default isNegation;