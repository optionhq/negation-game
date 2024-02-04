import { SignerProvider } from "@/contexts/SignerContext";
import "@/pages/globals.css";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "../components/header/Header";
import MobileBottomHeader from "../components/header/MobileBottomHeader";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	metadataBase: new URL(
		process.env.VERCEL_URL
			? `https://${process.env.VERCEL_URL}`
			: `http://localhost:${process.env.PORT || 3000}`,
	),
	title: "Negation Game",
	description: "The way extraterrestrials do governance.",
	openGraph: {
		title: "Negation Game",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<div className={`${inter.className} h-full`}>
					{/* <AuthKitProvider config={config}> */}
					{/* <NeynarProvider> */}
					<SignerProvider>
						<div className="flex flex-col h-full min-h-screen">
							<Header />
							<div className="flex-grow overflow-clip">{children}</div>
							<MobileBottomHeader />
						</div>
					</SignerProvider>
					{/* </NeynarProvider> */}
					{/* </AuthKitProvider> */}
				</div>
			</body>
		</html>
	);
}
