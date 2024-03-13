import React, { useContext } from 'react';
import { ChatConfigType, ChatItem, OpenJobPrompt } from '@/types/typings';

export interface AIChatContextValue {
  openConfig?: boolean;
  setOpenConfig?: (status: boolean) => void;
  prompt?: OpenJobPrompt;
  chatList: ChatItem[];
  setChatList?: (chatItems: ChatItem[]) => void;
  chatConfig: ChatConfigType;
  handleSaveConfig?: (values: ChatConfigType) => Promise<any>;
  onApply?: (chatItem: ChatItem) => void;
  applyChatItem?: ChatItem;
}

export const AIChatContext = React.createContext<AIChatContextValue>({
  chatList: [],
  chatConfig: {},
});

export const useAIContext = () => {
  return useContext(AIChatContext);
};
