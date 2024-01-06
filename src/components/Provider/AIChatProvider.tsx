import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AIChatContext } from '@/components/Provider/AIChatContext';
import ChatModal from '@/components/Chat/ChatModal';

export interface AIChatProviderProps {
  children: React.ReactNode;
}

export function AIChatProvider(props: AIChatProviderProps) {
  const router = useRouter();
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
      <ChatModal />
      {props.children}
    </AIChatContext.Provider>
  );
}
