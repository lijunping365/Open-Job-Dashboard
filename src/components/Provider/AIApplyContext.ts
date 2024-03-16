import React, { useContext } from 'react';
import { ChatItem } from '@/types/typings';

export interface AIApplyContextValue {
  openChatModal: boolean;
  setOpenChatModal?: (status: boolean) => void;
  applyChatItem?: ChatItem;
  onApply?: (chatItem: ChatItem) => void;
}

export const AIApplyContext = React.createContext<AIApplyContextValue>({
  openChatModal: false,
});

export const useAIApplyContext = () => {
  return useContext(AIApplyContext);
};
