// src/lib/isNegation.ts
import config from "@/config";
import { okUrls } from "@/lib/useEndPoints";
import { LinkPointsTree } from "@/types/PointsTree";

export const validNegation = (title: string): boolean => {
  // a title is a valid negation if it starts with config.negationSymbol 
  // and is then followed by any number of whitespace or newline characters
  // and finally followed by an okUrl
  for (let url of okUrls) {
    const negationRegex = new RegExp(`^${config.negationSymbol}\\s*${url.source}\\s*$`);
    if (negationRegex.test(title)) {
      return true;
    }
  }
  return false;
}

export const isCompleteNegation = (entry: LinkPointsTree): boolean => {
  if (entry.endPoint && validNegation(entry.title)) {
    return true;
  } else {
    return false;
  }
}