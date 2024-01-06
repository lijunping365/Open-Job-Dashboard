import React, { useContext } from 'react';
import { ChatItem } from '@/types/typings';

export interface AIContextValue {
  chatList: ChatItem[] | [];
  setChatList?: any;
}

export const AIChatContext = React.createContext<AIContextValue>({
  chatList: [],
});

export const useAIChatContext = () => {
  const aiChatContext = useContext(AIChatContext);
  return { ...aiChatContext };
};
