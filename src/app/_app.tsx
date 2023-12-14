// frontend/src/pages/_app.tsx
import Header from '@/components/header/Header';
import './globals.css';
import type { AppProps } from 'next/app';
import { NeynarProvider } from 'neynar-next'
import MobileBottomHeader from '@/components/header/MobileBottomHeader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Negation Game',
  description: "How extraterrestrials do governance.",
};


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NeynarProvider>
      <div className='flex flex-col min-h-screen'>
        <Header />
        <div className='flex-1'>
          <Component {...pageProps} />
        </div>
        <MobileBottomHeader />
      </div>
    </NeynarProvider>
  );
}

export default MyApp;