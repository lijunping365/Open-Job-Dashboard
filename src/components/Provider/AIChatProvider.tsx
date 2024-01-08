import React, { useEffect, useState } from 'react';
import { AIChatContext } from '@/components/Provider/AIChatContext';
import ChatModal from '@/components/Chat/ChatModal';
import { useRouter } from 'next/router';
import useLocalStorage from '@/hooks/useLocalStorage';
import { ChatItem } from '@/types/typings';

export interface AIChatProviderProps {
  children: React.ReactNode;
}

const excludePath = ['/login', '/404'];

export function AIChatProvider(props: AIChatProviderProps) {
  const router = useRouter();
  const cleanedPath = router.asPath.split(/[\?\#]/)[0];
  const [chatList, setChatList] = useLocalStorage<ChatItem[]>(
    'open-job-ai',
    []
  );

  return (
    <AIChatContext.Provider value={{ chatList, setChatList }}>
      {!excludePath.includes(cleanedPath) && <ChatModal />}
      {props.children}
    </AIChatContext.Provider>
  );
}
