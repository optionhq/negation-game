import { Login } from "@/components";
import Navigation from "@/components/header/Navigation";
import { Toaster } from "@/components/ui/sonner";
import { CytoscapeProvider } from "@/contexts/CytoscapeContext";
import { SignerProvider } from "@/contexts/SignerContext";
import "@/globals.css";
import { cn } from "@/lib/utils";
import { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { IoArrowRedo } from "react-icons/io5";
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

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1.0,
	height: "device-height",
	interactiveWidget: "resizes-content",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<CytoscapeProvider>
			<html lang="en" className="h-[100dvh] overscroll-contain">
				<body className={cn("h-[100dvh]  font-sans", inter.variable)}>
					<SignerProvider>
						<div className="flex h-[100dvh] min-h-[100dvh] flex-col ">
							<header className=" sticky top-0 z-50 grid w-full grid-cols-2 items-center justify-center gap-3 border bg-slate-50 px-4 py-2 md:grid-cols-[1fr_3fr_1fr] ">
								<Link
									href={"/"}
									className="flex w-fit select-none flex-col text-xl font-black leading-[0.85] text-violet-700"
								>
									<p>Negation</p>
									<div className="flex items-center gap-0">
										<p>Game </p>
										<IoArrowRedo className="rotate-180" />
									</div>
								</Link>
								<Navigation className="text-md hidden justify-center gap-16 md:flex" />
								<div className="flex w-fit justify-self-end">
									<Login />
								</div>
							</header>

							<div className="min-h-0 flex-grow overflow-clip">{children}</div>
							<Navigation className="text-md w-full justify-evenly border bg-slate-50 p-1 md:hidden" />
						</div>
						<Toaster
							position="bottom-right"
							theme="light"
							className="!bottom-32"
						/>
					</SignerProvider>
				</body>
			</html>
		</CytoscapeProvider>
	);
}
