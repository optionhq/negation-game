import { Login } from "@/components";
import HeaderNav from "@/components/header/HeaderNav";
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
		process.env.VERCEL_URL ?
			`https://${process.env.VERCEL_URL}`
		:	`http://localhost:${process.env.PORT || 3000}`,
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
				<body className={cn("h-full font-sans", inter.variable)}>
					<SignerProvider>
						<div className="flex h-full min-h-screen flex-col">
							<header className="sticky top-0 z-50 flex w-full flex-col-reverse items-center justify-between gap-6 border bg-slate-50 px-2 py-2 md:flex-row">
								<HeaderNav className="hidden md:flex" />
								<div className="flex w-full flex-1 justify-end">
									<Login />
								</div>
							</header>

							<div className="flex-grow overflow-clip">
								<div className="h-full w-full overflow-scroll">{children}</div>
							</div>
							<MobileBottomHeader className="md:hidden" />
						</div>
					</SignerProvider>
				</body>
			</html>
		</CytoscapeProvider>
	);
}
