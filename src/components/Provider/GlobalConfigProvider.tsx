import React from 'react';
import { GlobalConfigContext } from '@/components/Provider/GlobalConfigContext';
import { ConfigProvider, theme } from 'antd';
import useTheme from '@/hooks/useTheme';
import useLocale from '@/hooks/useLocale';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

export interface GlobalConfigProviderProps {
  children: React.ReactNode;
}

export function GlobalConfigProvider(props: GlobalConfigProviderProps) {
  const [value, toggleTheme] = useTheme();
  const [locale, toggleLocale] = useLocale();
  dayjs.locale(locale);

  return (
    <GlobalConfigContext.Provider
      value={{ theme: value, toggleTheme, locale, toggleLocale }}
    >
      <ConfigProvider
        locale={locale === 'zh-cn' ? zhCN : enUS}
        theme={{
          algorithm:
            value === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm,
        }}
      >
        {props.children}
      </ConfigProvider>
    </GlobalConfigContext.Provider>
  );
}
