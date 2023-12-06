'use client';

import React, { FC, ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/components/Provider/AuthProvider';

interface LayoutProps {
  children: ReactNode;
}

const Providers: FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
    >
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
};

export default Providers;
