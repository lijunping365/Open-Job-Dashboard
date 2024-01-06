import React from 'react';
import '@/styles/globals.css';
import { AppProps } from 'next/app';
import { AuthProvider } from '@/components/Provider/AuthProvider';
import { GlobalConfigProvider } from '@/components/Provider/GlobalConfigProvider';
import { AIChatProvider } from '@/components/Provider/AIChatProvider';

export default function App({
  Component,
  pageProps: { ...pageProps },
}: AppProps) {
  return (
    <>
      <GlobalConfigProvider>
        <AuthProvider>
          <AIChatProvider>
            <Component {...pageProps} />
          </AIChatProvider>
        </AuthProvider>
      </GlobalConfigProvider>
    </>
  );
}
