import React from 'react';
import { useAuthContext } from '@/components/Provider/AuthContext';
import { Avatar, Button, Dropdown, Layout, MenuProps, Space } from 'antd';
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { IconDark } from '@/components/Icon/IconDark';
import { IconLight } from '@/components/Icon/IconLight';
import { useConfigContext } from '@/components/Provider/GlobalConfigContext';
import { useRouter } from 'next/router';
import { IconLocale } from '@/components/Icon/IconLocale';

interface Props {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Header: React.FC<Props> = ({ collapsed, setCollapsed }: Props) => {
  const router = useRouter();
  const { user } = useAuthContext();
  const { theme, toggleTheme, locale, toggleLocale } = useConfigContext();

  const optionItems: MenuProps['items'] = [
    {
      key: '1',
      label: <a onClick={() => router.replace('/login')}>退出登录</a>,
      icon: <LogoutOutlined />,
    },
  ];

  const localeItems: MenuProps['items'] = [
    {
      key: 'zh-cn',
      label: '简体中文',
      icon: <span>🇨🇳 </span>,
    },
    {
      key: 'en',
      label: 'English',
      icon: <span>🇺🇸 </span>,
    },
  ];

  return (
    <Layout.Header
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px 0 16px',
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

      <Space size='middle'>
        <Dropdown
          placement='bottomRight'
          menu={{
            items: localeItems,
            selectedKeys: [locale],
            onClick: () => toggleLocale && toggleLocale(),
            mode: 'inline',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconLocale style={{ height: 20, width: 20 }} />
          </div>
        </Dropdown>

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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => toggleTheme && toggleTheme()}
        />

        <Dropdown menu={{ items: optionItems }}>
          <Avatar
            src={user?.avatar || 'logo.png'}
            alt='avatar'
          />
        </Dropdown>
      </Space>
    </Layout.Header>
  );
};

export default Header;
