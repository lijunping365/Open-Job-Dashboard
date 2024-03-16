import React, { useState } from 'react';
import { ChatItem } from '@/types/typings';
import { AIApplyContext } from '@/components/Provider/AIApplyContext';

export interface AuthProviderProps {
  children: React.ReactNode;
}

export function AIApplyProvider(props: AuthProviderProps) {
  const [applyChatItem, setApplyChatItem] = useState<ChatItem>();
  const [openChatModal, setOpenChatModal] = useState<boolean>(false);

  return (
    <AIApplyContext.Provider
      value={{
        applyChatItem: applyChatItem,
        onApply: setApplyChatItem,
        openChatModal,
        setOpenChatModal,
      }}
    >
      {props.children}
    </AIApplyContext.Provider>
  );
}
