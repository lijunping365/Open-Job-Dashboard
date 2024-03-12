import React from 'react';
import { useRouter } from 'next/router';
import ChatButton from '@/components/Chat/ChatButton';

export interface AIChatProviderProps {
  children: React.ReactNode;
}

const excludePath = ['/login', '/404'];

export function AIChatProvider(props: AIChatProviderProps) {
  const router = useRouter();
  const cleanedPath = router.asPath.split(/[\?\#]/)[0];

  return (
    <>
      {!excludePath.includes(cleanedPath) && <ChatButton />}
      {props.children}
    </>
  );
}
