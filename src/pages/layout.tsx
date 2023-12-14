import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={inter.className}>
      {/* <Head>
        <title>{metadata.title as string}</title>
        <meta name="description" content={metadata.description as string} />
      </Head> */}
      {children}
    </div>
  );
}