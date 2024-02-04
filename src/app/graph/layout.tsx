import Header from "@/components/header/Header";
import MobileBottomHeader from "@/components/header/MobileBottomHeader";
import { SignerProvider } from "@/contexts/SignerContext";
import "@/pages/globals.css";
import { Metadata } from "next";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
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
							<div className="flex-1">{children}</div>
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