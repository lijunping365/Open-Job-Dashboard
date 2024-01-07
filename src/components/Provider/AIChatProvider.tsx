import React, { useEffect, useState } from 'react';
import { AIChatContext } from '@/components/Provider/AIChatContext';
import ChatModal from '@/components/Chat/ChatModal';
import { useRouter } from 'next/router';

export interface AIChatProviderProps {
  children: React.ReactNode;
}

const excludePath = ['/login'];

export function AIChatProvider(props: AIChatProviderProps) {
  const router = useRouter();
  const cleanedPath = router.asPath.split(/[\?\#]/)[0];
  const [chatList, setChatList] = useState<any>();

  const initAIChat = async () => {
    try {
      // 初始化聊天数据
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    initAIChat().then();
  }, []);

  return (
    <AIChatContext.Provider value={{ chatList, setChatList }}>
      {!excludePath.includes(cleanedPath) && <ChatModal />}
      {props.children}
    </AIChatContext.Provider>
  );
}
