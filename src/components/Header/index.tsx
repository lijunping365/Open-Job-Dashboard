import React, { useState } from 'react';
import { useAuthContext } from '@/components/Provider/AuthContext';
import { Button, Layout } from 'antd';
import cn from 'classnames';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { IconDark } from '@/components/Icon/IconDark';
import { IconLight } from '@/components/Icon/IconLight';

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
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        justifyContent: 'space-between',
        background: theme === 'light' ? '#fff' : '#141414',
        borderBottom:
          theme !== 'light' ? '1px solid #343A46' : '1px solid #EBECF0',
      }}
    >
      <Button
        type='text'
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          width: 36,
          height: 36,
        }}
      />
      <Button
        type='text'
        icon={
          theme === 'dark' ? (
            <IconDark style={{ height: 20, width: 20 }} />
          ) : (
            <IconLight style={{ height: 24, width: 24 }} />
          )
        }
        style={{
          width: 36,
          height: 36,
        }}
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      />
    </Layout.Header>
  );
};

export default Header;
