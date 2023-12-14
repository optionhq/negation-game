import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className={inter.className}>
      <head>
        <title>Negation Game</title>
        <meta name="description" content="How extraterrestrials do governance."/>
      </head>
      {/* <Head>
        <title>{metadata.title as string}</title>
        <meta name="description" content={metadata.description as string} />
      </Head> */}
      {children}
    </main>
  );
}