import React, { useState } from 'react';
import { useAuthContext } from '@/components/Provider/AuthContext';
import ThemeSwitch from '@/components/Theme';
import { Button, Layout } from 'antd';
import { IconUnCollapsed } from '@/components/Icon/IconUnCollapsed';
import { IconCollapsed } from '@/components/Icon/IconCollapsed';
import cn from 'classnames';

const menus = [
  {
    name: 'AI资讯',
    path: 'https://openbytecode.com/project/open-idea/docs/quick-start',
  },
  {
    name: 'AI应用',
    path: 'https://openbytecode.com/project/open-idea/docs/quick-start',
  },
  {
    name: 'AI实验室',
    path: 'https://openbytecode.com/project/open-idea/access',
  },
  {
    name: 'AI工具箱',
    path: 'https://openbytecode.com/project/open-idea/changelog',
  },
];

interface Props {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  theme: string;
  setTheme: (theme: string) => void;
}

const Header: React.FC<Props> = ({
  collapsed,
  setCollapsed,
  theme,
  setTheme,
}: Props) => {
  const { user } = useAuthContext();

  return (
    <Layout.Header
      style={{ padding: 0, background: theme === 'light' ? '#fff' : '#141414' }}
      className={cn('flex items-center justify-between gap-4', {
        'border-b border-stone-600 shadow-xl': theme !== 'light',
      })}
    >
      <Button
        type='text'
        icon={collapsed ? <IconUnCollapsed /> : <IconCollapsed />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />
      <div className='px-4'>
        <ThemeSwitch
          theme={theme}
          setTheme={setTheme}
        />
      </div>
    </Layout.Header>
  );
};

export default Header;
