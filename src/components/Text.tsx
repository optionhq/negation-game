export default function Text({ text }: { text: string | undefined }) {
	// Regular expression to detect URLs
	// const urlRegex = /((https?:\/\/)|(www\.)[^\s])+/g;
	// const urlRegex = /(https?:\/\/[^\s]+)/g;
	if (!text) return <></>;

	const urlRegex =
		/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g;

	// Split text into parts based on URLs
	const parts = text.split(urlRegex);
	// Map each part to either plain text or a link
	const content = parts?.map((part, index) => {
		if (part?.match(urlRegex)) {
			// If part is a URL, return it wrapped in an anchor tag
			return (
				<a
					key={index}
					href={part}
					target="_blank"
					rel="noopener noreferrer"
					className=" text-blue-600 underline "
				>
					{part}
				</a>
			);
		} else {
			// Otherwise, return plain text
			return <span key={index}>{part}</span>;
		}
	});

	return <p className="table-cell text-ellipsis">{content}</p>;
}
