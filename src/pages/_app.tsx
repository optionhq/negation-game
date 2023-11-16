// frontend/src/pages/_app.tsx
import Header from '@/components/header/Header';
import './globals.css';
import type { AppProps } from 'next/app';
import { NeynarProvider } from 'neynar-next'
import MobileBottomHeader from '@/components/header/MobileBottomHeader';
import { FarcasterSignerContext } from '@/contexts/UserContext';

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <NeynarProvider>
        <div className='flex flex-col h-screen max-h-screen'>
          <Header />
          <Component {...pageProps} />
          <MobileBottomHeader />
        </div>
    </NeynarProvider>
  );
}

export default MyApp;