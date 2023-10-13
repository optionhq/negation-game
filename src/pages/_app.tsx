// frontend/src/pages/_app.tsx
import './globals.css';
import type { AppProps } from 'next/app';
import { NeynarProvider } from 'neynar-next'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NeynarProvider>
      <Component {...pageProps} />
    </NeynarProvider>
  );
}

export default MyApp;