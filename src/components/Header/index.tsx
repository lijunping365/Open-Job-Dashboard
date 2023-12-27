import React from 'react';
import { useAuthContext } from '@/components/Provider/AuthContext';
import { IconDark } from '@/components/Icon/IconDark';
import { IconLight } from '@/components/Icon/IconLight';
import { useConfigContext } from '@/components/Provider/GlobalConfigContext';
import { useRouter } from 'next/router';
import { IconLocale } from '@/components/Icon/IconLocale';
import { getBreadcrumbs } from '@/lib/utils';
import { LangType } from '@/types/typings';
import { getMenuItems, MenuItem } from '@/components/Layout';
import {
  Avatar,
  Breadcrumb,
  Button,
  Dropdown,
  Layout,
  MenuProps,
  Space,
} from 'antd';
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

interface Props {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Header: React.FC<Props> = ({ collapsed, setCollapsed }: Props) => {
  const router = useRouter();
  const { user } = useAuthContext();
  const cleanedPath = router.asPath.split(/[\?\#]/)[0];
  const { theme, toggleTheme, locale, toggleLocale } = useConfigContext();
  const items: MenuItem[] = getMenuItems(locale as LangType);
  const breadcrumbs: any[] = [];
  getBreadcrumbs(cleanedPath, items, breadcrumbs);

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
      key: 'en-us',
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
      <Space size='middle'>
        <Button
          type='text'
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ width: 36, height: 36 }}
        />

        <Breadcrumb
          style={{ fontSize: '16px', lineHeight: '64px' }}
          items={breadcrumbs}
        />
      </Space>

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
