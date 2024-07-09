import { cn } from "@/lib/utils";
import { FC } from "react";
import { BiLoaderAlt } from "react-icons/bi";

export interface LoaderProps {
	className?: string;
}

export const Loader: FC<LoaderProps> = ({ className }) => (
	<BiLoaderAlt
		size={128}
		className={cn("animate-spin text-violet-200", className)}
	/>
);
