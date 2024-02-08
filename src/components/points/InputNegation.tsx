import { useSigner } from "@/contexts/SignerContext";
import { cn } from "@/lib/utils";
import { Node } from "@/types/Points";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

const MAX_CHAR_PER_CAST = 320;

export default function InputNegation({
	pointBg = "bg-white ",
	placeHolder,
	onPublish,
	onClose,
	className,
}: {
	pointBg?: string;
	placeHolder: string;
	onPublish: (text: string) => void;
	onClose: () => void;
	setParentChildren?: Dispatch<
		SetStateAction<{
			relevance: Node[];
			conviction: Node[];
			comment: Node[];
		}>
	>;
	className?: string;
}) {
	const [text, setText] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const { signer } = useSigner();

	useEffect(() => {
		const listener = (event: KeyboardEvent) => {
			if (
				(event.ctrlKey || event.metaKey) &&
				(event.key === "Enter" || event.key === "Return")
			) {
				// Click the publish button
				text && onPublish(text);
			}
		};
		document.addEventListener("keydown", listener);
		return () => {
			document.removeEventListener("keydown", listener);
		};
	}, [text, onPublish]);

	async function handlePublish() {
		if (!signer) {
			window.alert("Must be logged in to publish. farcasterUser is null");
			return;
		}
		onPublish(text);
		onClose();
	}

	useEffect(() => {
		textareaRef.current?.focus();
	}, []);

	return (
		<div
			className={cn(
				"relative order-first flex w-full cursor-pointer list-none flex-col gap-3 rounded-md border px-5 py-3 font-medium",
				pointBg,
				className,
			)}
			onClick={(e) => e.stopPropagation()}
		>
			<textarea
				ref={textareaRef}
				placeholder={placeHolder}
				className="border-1 h-36 w-full caret-purple-900"
				value={text}
				onChange={(e) => setText(e.target.value)}
			/>
			<div className="flex w-full justify-between">
				<p className="text-sm text-black/60">
					<span
						className={`${
							text.length > MAX_CHAR_PER_CAST ? "text-red-500" : ""
						}`}
					>
						{text.length}
					</span>
					/{MAX_CHAR_PER_CAST}
				</p>
				<div className="flex gap-2">
					<button type="button" className="secondary-button" onClick={onClose}>
						Cancel
					</button>
					<button
						type="submit"
						className="button"
						onClick={() => {
							text && handlePublish();
						}}
						disabled={text.length === 0 || text.length > MAX_CHAR_PER_CAST}
					>
						Publish
					</button>
				</div>
			</div>
		</div>
	);
}
