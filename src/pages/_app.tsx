import React from 'react';
import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ConfigProvider, theme } from 'antd';
import { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import {AuthProvider} from "@/components/Provider/AuthProvider";
import useTheme from "@/hooks/useTheme";

export default function App({
  Component,
  pageProps: { ...pageProps },
}: AppProps) {
  const [value] = useTheme();
  return (
    <>
      <ConfigProvider theme={{algorithm: value === "default" ? theme.defaultAlgorithm : theme.darkAlgorithm}}>
        <AuthProvider>
          <ToastContainer closeButton={false} pauseOnFocusLoss={false}
            toastClassName={() =>
              'relative bg-white dark:bg-zinc-900 text-neutral-800 dark:text-white flex p-1 min-h-15 rounded-md justify-between overflow-hidden cursor-pointer p-5 border-2 dark:border-zinc-800 :dark:fill:slate-50 mb-4'
            }
          />
          <Component {...pageProps} />
        </AuthProvider>
      </ConfigProvider>
    </>
  );
}
