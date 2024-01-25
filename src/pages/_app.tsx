// frontend/src/pages/_app.tsx
import Header from '../components/header/Header';
import './globals.css';
import type { AppProps } from 'next/app';
import MobileBottomHeader from '../components/header/MobileBottomHeader';
import { Inter } from 'next/font/google';
import { SignerProvider } from '@/contexts/SignerContext';
const inter = Inter({ subsets: ['latin'] });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.className}>
      {/* <AuthKitProvider config={config}> */}
      {/* <NeynarProvider> */}
      <SignerProvider>
        <div className='flex flex-col min-h-screen'  >
          <Header />
          <div className='flex-1'>
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

