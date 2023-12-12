import React from 'react';
import '@/styles/globals.css';
import { AppProps } from 'next/app';
import { AuthProvider } from '@/components/Provider/AuthProvider';
import NoSSR from '@/components/NoSSR';

export default function App({
  Component,
  pageProps: { ...pageProps },
}: AppProps) {
  return (
    <>
      <NoSSR>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </NoSSR>
    </>
  );
}
