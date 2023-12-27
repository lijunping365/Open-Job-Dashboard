import React from 'react';
import enUS from '@/i18n/en-us';
import zhCN from '@/i18n/zh-cn';
import { LangType } from '@/types/typings';

const locale = {
  'en-us': enUS,
  'zh-cn': zhCN,
};

export default function i18n(key: string, currentLang: LangType) {
  const langSet: Record<string, string> = locale[currentLang];
  return langSet[key];
}
