import React from 'react';
import '@/styles/globals.css';
import { AppProps } from 'next/app';
import { AuthProvider } from '@/components/Provider/AuthProvider';
import { GlobalConfigProvider } from '@/components/Provider/GlobalConfigProvider';

export default function App({
  Component,
  pageProps: { ...pageProps },
}: AppProps) {
  return (
    <>
      <GlobalConfigProvider>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </GlobalConfigProvider>
    </>
  );
}
