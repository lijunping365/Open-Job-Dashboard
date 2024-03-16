import React from 'react';
import '@/styles/globals.css';
import '@/styles/sandpack.css';
import '@/styles/prism.css';
import { AppProps } from 'next/app';
import { AuthProvider } from '@/components/Provider/AuthProvider';
import { GlobalConfigProvider } from '@/components/Provider/GlobalConfigProvider';
import { AIChatProvider } from '@/components/Provider/AIChatProvider';
import { AIApplyProvider } from '@/components/Provider/AIApplyProvider';

export default function App({
  Component,
  pageProps: { ...pageProps },
}: AppProps) {
  return (
    <>
      <GlobalConfigProvider>
        <AuthProvider>
          <AIApplyProvider>
            <AIChatProvider>
              <Component {...pageProps} />
            </AIChatProvider>
          </AIApplyProvider>
        </AuthProvider>
      </GlobalConfigProvider>
    </>
  );
}
