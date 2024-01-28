import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<title>Negation Game</title>
				<meta property="og:title" content="Negation Game" key="title" />
				<meta
					name="description"
					content="How extraterrestrials do governance."
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
