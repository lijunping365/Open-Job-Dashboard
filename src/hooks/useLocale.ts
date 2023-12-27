import { useEffect, useState } from 'react';

const useLocale = (): [string, () => void] => {
  const [locale, setLocale] = useState('zh-cn');

  useEffect(() => {
    const storeLocale = window.localStorage.getItem('locale');
    if (storeLocale) setLocale(storeLocale);
  }, []);

  const toggleLocale = () => {
    setLocale((prevLocale) => {
      const value = prevLocale === 'zh-cn' ? 'en-us' : 'zh-cn';
      window.localStorage.setItem('locale', value);
      return value;
    });
  };

  return [locale, toggleLocale];
};

export default useLocale;
