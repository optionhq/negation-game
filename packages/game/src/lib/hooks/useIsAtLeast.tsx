import config from "@/tw-config";
import { useMediaQuery } from "usehooks-ts";

export type Breakpoint = keyof typeof config.theme.screens;

export const useIsAtLeast = (
	breakpoint: Breakpoint,
	options?: { defaultValue?: boolean; initializeWithValue?: boolean },
): boolean => {
	const breakpointWidth = config.theme.screens[breakpoint];

	return useMediaQuery(`(min-width: ${breakpointWidth})`, options);
};
