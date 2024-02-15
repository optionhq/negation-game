import { Login } from "@/components";
import Navigation from "@/components/header/Navigation";
import { Toaster } from "@/components/ui/sonner";
import { CytoscapeProvider } from "@/contexts/CytoscapeContext";
import { SignerProvider } from "@/contexts/SignerContext";
import "@/globals.css";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
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

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<CytoscapeProvider>
			<html lang="en" className="h-full overscroll-contain">
				<body className={cn("h-full  font-sans", inter.variable)}>
					<SignerProvider>
						<div className="flex h-full min-h-screen flex-col ">
							<header className="md: sticky top-0 z-50 grid w-full grid-cols-2 items-center justify-center gap-6 border bg-slate-50 px-4 py-2 md:grid-cols-[auto_1fr_auto]">
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
								<Navigation className="hidden gap-1 text-sm md:flex lg:gap-4 lg:text-base" />
								<div className="flex w-full flex-1 justify-end">
									<Login />
								</div>
							</header>

							<div className="min-h-0 flex-grow overflow-clip">{children}</div>
							<Navigation className=" w-full gap-0 border bg-slate-50 p-1 text-sm md:hidden" />
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
