import React from 'react';
import { useRouter } from 'next/router';
import ChatButton from '@/components/Chat/ChatButton';
import { AIChatContext } from '@/components/Provider/AIChatContext';

export interface AIChatProviderProps {
  children: React.ReactNode;
}

const excludePath = ['/login', '/404'];

export function AIChatProvider(props: AIChatProviderProps) {
  const router = useRouter();
  const cleanedPath = router.asPath.split(/[\?\#]/)[0];

  return (
    <AIChatContext.Provider value={{}}>
      {!excludePath.includes(cleanedPath) && <ChatButton />}
      {props.children}
    </AIChatContext.Provider>
  );
}
