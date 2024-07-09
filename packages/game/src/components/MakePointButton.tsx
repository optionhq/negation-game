"use client";
import { ROOT_CAST_ID } from "@/config";
import { useSigner } from "@/contexts/SignerContext";
import { usePointIds } from "@/lib/hooks/usePointIds";
import { cn } from "@/lib/utils";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";
import { BiSolidPencil } from "react-icons/bi";
import { toast } from "sonner";
import publish from "../lib/publish";
import { PointForm } from "./points/PointForm";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger,
} from "./ui/dialog";

export default function MakePointButton({
	conversation,
	refreshThread,
	classNames,
}: {
	classNames?: { button?: string; dialog?: string };
	conversation?: string;
	refreshThread: () => Promise<void>;
}) {
	const [isOpen, setOpen] = useState(false);
	const { signer } = useSigner();
	const { setIds } = usePointIds();

	if (!signer) return <></>;

	return (
		<Dialog open={isOpen} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className={cn("text-md flex gap-2", classNames?.button)}>
					<BiSolidPencil />
					<p className="hidden sm:flex">Make a point</p>
				</Button>
			</DialogTrigger>
			<DialogContent className={classNames?.dialog}>
				<DialogHeader>
					<DialogTitle>Make your point</DialogTitle>
				</DialogHeader>
				<PointForm
					onSubmit={async ({ content }) => {
						const toastId = toast.loading("Making a point.", {
							description: content,
						});

						publish(content, signer, conversation || ROOT_CAST_ID)
							.then((response) => {
								const castHash = response?.data.cast.hash;
								if (!castHash) {
									throw new Error("Failed to make a point.", {
										cause: response?.statusText,
									});
								}

								toast.success("Point made.", {
									id: toastId,
									description: content,
									action: {
										label: "Open",
										onClick: () => {
											setIds(castHash);
										},
									},
								});
								refreshThread();
								return response;
							})
							.catch(() => {
								toast.error(`Failed to make point.`, {
									id: toastId,
									description: content,
								});
							});
						setOpen(false);
					}}
					onCancel={() => setOpen(false)}
				/>
			</DialogContent>
		</Dialog>
	);
}
