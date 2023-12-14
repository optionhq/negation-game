import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
import MobileBottomHeader from '../components/header/MobileBottomHeader';
import { NeynarProvider } from 'neynar-next';
import Header from '../components/header/Header';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body className={inter.className}>
        <NeynarProvider>
          <div className='flex flex-col min-h-screen'>
            <Header />
            <div className='flex-1'>
              {children}
            </div>
            <MobileBottomHeader />
          </div>
        </NeynarProvider>
      </body>

    </html>
  );
}