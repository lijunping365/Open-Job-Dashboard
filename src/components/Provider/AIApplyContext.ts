import React, { useContext } from 'react';
import { ChatItem } from '@/types/typings';

export interface AIApplyContextValue {
  applyChatItem?: ChatItem;
  onApply?: (chatItem: ChatItem) => void;
}

export const AIApplyContext = React.createContext<AIApplyContextValue>({});

export const useAIApplyContext = () => {
  return useContext(AIApplyContext);
};
