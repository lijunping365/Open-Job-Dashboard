import React, { useContext } from 'react';

export interface ThemeContextValue {
  theme: string;
  setTheme?: (theme: string) => void;
}

export const ThemeContext = React.createContext<ThemeContextValue>({
  theme: 'light',
});

export const useThemeContext = () => {
  return useContext(ThemeContext);
};
