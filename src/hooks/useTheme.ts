import { useState } from 'react';

const useTheme = () => {
  const [theme, setTheme] = useState('light');
  const setValue = (value: string) => {
    setTheme(value);
  };
  return [theme, setValue] as const;
};

export default useTheme;
