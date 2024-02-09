import { Loader } from "@/components/Loader";

export default function LoadingPane() {
	return (
		<div className="flex h-full w-full flex-grow items-center justify-center bg-gray-100">
			<Loader />
		</div>
	);
}
