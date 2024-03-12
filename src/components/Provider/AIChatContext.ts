import React from 'react';

export interface AIChatContextValue {
  openConfig?: boolean;
  setOpenConfig?: any;
  prompt?: any;
  setPrompt?: any;
  chatList?: any;
  setChatList?: any;
  chatConfig?: any;
  saveChatConfig?: any;
}

export const AIChatContext = React.createContext<AIChatContextValue>({});
