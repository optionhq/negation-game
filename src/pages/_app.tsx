// frontend/src/pages/_app.tsx
import Header from '../components/header/Header';
import './globals.css';
import type { AppProps } from 'next/app';
import { NeynarProvider } from 'neynar-next'
import MobileBottomHeader from '../components/header/MobileBottomHeader';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.className}>
      <NeynarProvider>
      <div className='flex flex-col min-h-screen'  >
        <Header />
        <div className='flex-1'>
          <Component {...pageProps} />
        </div>
        <MobileBottomHeader />
      </div>
    </NeynarProvider>

    </div>
  );
}

export default MyApp;

