import Header from "@/components/header/Header";
import MobileBottomHeader from "@/components/header/MobileBottomHeader";
import { CytoscapeProvider } from "@/contexts/CytoscapeContext";
import { SignerProvider } from "@/contexts/SignerContext";
import "@/globals.css";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { Inter } from "next/font/google";
("../components/header/MobileBottomHeader");
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

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
		<CytoscapeProvider>
			<html lang="en" className="h-full">
				<body className={cn("font-sans h-full", inter.variable)}>
					<SignerProvider>
						<div className="flex flex-col h-full min-h-screen">
							<Header />
							<div className="flex-grow overflow-clip">
								<div className="w-full h-full overflow-scroll">{children}</div>
							</div>
							<MobileBottomHeader />
						</div>
					</SignerProvider>
				</body>
			</html>
		</CytoscapeProvider>
	);
}
