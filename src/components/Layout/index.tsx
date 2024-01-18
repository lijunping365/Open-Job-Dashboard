import { Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { MenuProps } from 'antd';
import menuItems from '@/config/menus';
import Header from '@/components/Header';
import { IconLogo } from '@/components/Icon/IconLogo';
import Footer from '@/components/Footer';
import { useConfigContext } from '@/components/Provider/GlobalConfigContext';
import i18n from '@/i18n';
import { LangType } from '@/types/typings';
import {
  AlertOutlined,
  AppstoreOutlined,
  CloudServerOutlined,
  CoffeeOutlined,
  DashboardOutlined,
  FileTextOutlined,
  SmileOutlined,
} from '@ant-design/icons';

export type MenuItem = Required<MenuProps>['items'][number];

export function getIcon(icon: string) {
  switch (icon) {
    case 'dashboard':
      return <DashboardOutlined />;
    case 'user':
      return <SmileOutlined />;
    case 'app':
      return <AppstoreOutlined />;
    case 'cluster':
      return <CloudServerOutlined />;
    case 'alarm':
      return <AlertOutlined />;
    case 'job':
      return <CoffeeOutlined />;
    case 'logger':
      return <FileTextOutlined />;
  }
}
export function getMenuItems(currentLang: LangType): MenuItem[] {
  return menuItems.map((item) => {
    return {
      key: item.path,
      icon: getIcon(item.icon),
      label: i18n(item.name, currentLang),
    } as MenuItem;
  });
}

// 收起的宽度
const collapsedWidth = 64;
const siderWidth = 208;

const { Content, Sider } = Layout;

interface Props {
  children: React.ReactNode;
  onCollapse?: (collapsed: boolean) => void;
}
const BaseLayout = ({ children, onCollapse }: Props) => {
  const router = useRouter();
  const { theme, locale } = useConfigContext();
  const cleanedPath = router.asPath.split(/[\?\#]/)[0];
  const [collapsed, setCollapsed] = useState(false);
  const items: MenuItem[] = getMenuItems(locale as LangType);

  const handleCollapse = (value: boolean) => {
    setCollapsed(value);
    onCollapse && onCollapse(value);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <div
        style={{
          width: collapsed ? collapsedWidth : siderWidth,
          overflow: 'hidden',
          flex: `0 0 ${collapsed ? collapsedWidth : siderWidth}px`,
          maxWidth: collapsed ? collapsedWidth : siderWidth,
          minWidth: collapsed ? collapsedWidth : siderWidth,
          transition: 'all 0.2s ease 0s',
        }}
      />
      <Sider
        theme='light'
        collapsible
        collapsed={collapsed}
        collapsedWidth={collapsedWidth}
        width={siderWidth}
        onCollapse={(value) => handleCollapse(value)}
        className='layout-side'
        trigger={null}
        style={{
          borderRight:
            theme !== 'light' ? '1px solid #343A46' : '1px solid #EBECF0',
          boxShadow:
            '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        }}
      >
        <h1 className='layout-title'>
          {collapsed ? (
            <IconLogo className='layout-logo' />
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                flex: `0 0 ${collapsed ? collapsedWidth : siderWidth}px`,
                color: theme === 'light' ? '#080e29' : '#ccc',
              }}
            >
              <IconLogo
                className='layout-logo'
                style={{ marginRight: 10 }}
              />
              Open-Job
            </div>
          )}
        </h1>
        <Menu
          selectedKeys={[cleanedPath]}
          mode='inline'
          items={items}
          className='layout-menu'
          onClick={({ keyPath }) => router.push(keyPath[0])}
        />
      </Sider>

      <Layout>
        <Header
          collapsed={collapsed}
          onCollapse={(collapsed) => handleCollapse(collapsed)}
        />
        <Content
          className='layout-content'
          style={{
            backgroundColor: theme === 'light' ? '#f5f5f5' : '#000',
          }}
        >
          {children}
        </Content>
        <Footer theme={theme} />
      </Layout>
    </Layout>
  );
};

export default BaseLayout;
