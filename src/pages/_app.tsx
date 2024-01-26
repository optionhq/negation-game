import { SignerProvider } from "@/contexts/SignerContext";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
// frontend/src/pages/_app.tsx
import Header from "../components/header/Header";
import MobileBottomHeader from "../components/header/MobileBottomHeader";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<div className={`${inter.className} h-full`}>
			{/* <AuthKitProvider config={config}> */}
			{/* <NeynarProvider> */}
			<SignerProvider>
				<div className="flex flex-col min-h-screen">
					<Header />
					<div className="flex-1">
						<Component {...pageProps} />
					</div>
					<MobileBottomHeader />
				</div>
			</SignerProvider>
			{/* </NeynarProvider> */}
			{/* </AuthKitProvider> */}
		</div>
	);
}

export default MyApp;
