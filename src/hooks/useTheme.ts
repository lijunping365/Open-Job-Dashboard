import { useEffect, useState } from 'react';

const useTheme = (): [string, (value: string) => void] => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const storeTheme = window.localStorage.getItem('theme');
    if (storeTheme) setTheme(storeTheme);
  }, []);

  const setValue = (value: string) => {
    setTheme(value);
    window.localStorage.setItem('theme', value);
  };

  return [theme, setValue];
};

export default useTheme;
