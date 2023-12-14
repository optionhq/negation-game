import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
import MobileBottomHeader from '@/components/header/MobileBottomHeader';
import { NeynarProvider } from 'neynar-next';
import Header from '@/components/header/Header';
import Head from 'next/head';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className={inter.className}>
      <Head>
        <title>Negation Game</title>
        <meta name="description" content="How extraterrestrials do governance." />
      </Head>
      <NeynarProvider>
        <div className='flex flex-col min-h-screen'>
          <Header />
          <div className='flex-1'>
            {children}

          </div>
          <MobileBottomHeader />
        </div>
      </NeynarProvider>
    </main>
  );
}