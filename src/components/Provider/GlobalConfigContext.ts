import React, { useContext } from 'react';

export interface GlobalConfigContextValue {
  theme: string;
  toggleTheme?: () => void;
  locale: string;
  toggleLocale?: () => void;
}

export const GlobalConfigContext =
  React.createContext<GlobalConfigContextValue>({
    theme: 'light',
    locale: 'zh-cn',
  });

export const useConfigContext = () => {
  return useContext(GlobalConfigContext);
};
