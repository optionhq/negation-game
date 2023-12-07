import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Head from 'next/head'; // Import the Head component

const inter = Inter({ subsets: ['latin'] });

const metadata: Metadata = {
  title: 'Negation Game',
  description: "We're all wrong, find out faster",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={inter.className}>
      <Head>
        <title>{metadata.title as string}</title>
        <meta name="description" content={metadata.description as string} />
      </Head>
      {children}
    </div>
  );
}