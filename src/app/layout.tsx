import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
import type { Metadata } from 'next';
import MobileBottomHeader from '@/components/header/MobileBottomHeader';
import { NeynarProvider } from 'neynar-next';
import Header from '@/components/header/Header';

export const metadata: Metadata = {
  title: 'Negation Game',
  description: "How extraterrestrials do governance.",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className={inter.className}>
      <head>
        <title>Negation Game</title>
        <meta name="description" content="How extraterrestrials do governance." />
      </head>
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