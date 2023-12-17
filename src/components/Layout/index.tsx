import { Layout, Menu } from 'antd';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { MenuProps } from 'antd';
import menuItems from '@/config/menus';
import Header from '@/components/Header';
import { IconLogo } from '@/components/Icon/IconLogo';
import {
  AlertOutlined,
  AppstoreOutlined,
  CoffeeOutlined,
  DashboardOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import Footer from '@/components/Footer';
import { useThemeContext } from '@/components/Provider/ThemeContext';

type MenuItem = Required<MenuProps>['items'][number];

function getIcon(icon: string) {
  switch (icon) {
    case 'dashboard':
      return <DashboardOutlined />;
    case 'user':
      return <SmileOutlined />;
    case 'app':
      return <AppstoreOutlined />;
    case 'alarm':
      return <AlertOutlined />;
    case 'job':
      return <CoffeeOutlined />;
  }
}
function getItem(item: any): MenuItem {
  return {
    key: item.path,
    icon: getIcon(item.icon),
    label: item.name,
  } as MenuItem;
}

const items: MenuItem[] = menuItems.map((item) => getItem(item));

const { Content, Sider } = Layout;

const BaseLayout = ({ children }: any) => {
  const router = useRouter();
  const cleanedPath = router.asPath.split(/[\?\#]/)[0];
  const [collapsed, setCollapsed] = useState(false);
  const { theme, setTheme } = useThemeContext();

  // 收起的宽度
  const collapsedWidth = 64;
  const siderWidth = 208;

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
        onCollapse={(value) => setCollapsed(value)}
        className='layout-side'
        style={{
          borderRight:
            theme !== 'light' ? '1px solid #343A46' : '1px solid #EBECF0',
          boxShadow:
            '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        }}
        trigger={null}
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
          theme={theme}
          setTheme={setTheme}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
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
