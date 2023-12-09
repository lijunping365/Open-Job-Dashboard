import { Layout, Menu, ConfigProvider, theme } from 'antd';
import { useState } from 'react';
import { useRouter } from 'next/router';
import useTheme from '@/hooks/useTheme';
import { MenuProps } from 'antd';
import menuItems from '@/config/menus';
import { IconFolder } from '@/components/Icon/IconFolder';
import Header from '@/components/Header';
import { IconLogo } from '@/components/Icon/IconLogo';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(item: any): MenuItem {
  return {
    key: item.path,
    icon: <IconFolder style={{ width: 24, height: 24 }} />,
    label: item.name,
  } as MenuItem;
}

const items: MenuItem[] = menuItems.map((item) => getItem(item));

const { Content, Footer, Sider } = Layout;

const BaseLayout = ({ children }: any) => {
  const router = useRouter();
  const cleanedPath = router.asPath.split(/[\?\#]/)[0];
  const [collapsed, setCollapsed] = useState(false);
  const [value, setValue] = useTheme();

  // 收起的宽度
  const collapsedWidth = 64;

  const siderWidth = 208;

  return (
    <ConfigProvider
      theme={{
        algorithm:
          value === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm,
      }}
    >
      <Layout style={{ minHeight: '100%' }}>
        <div
          style={{
            width: collapsed ? collapsedWidth : siderWidth,
            overflow: 'hidden',
            flex: `0 0 ${collapsed ? collapsedWidth : siderWidth}px`,
            maxWidth: collapsed ? collapsedWidth : siderWidth,
            minWidth: collapsed ? collapsedWidth : siderWidth,
            transition: 'all 0.2s ease 0s',
          }}
        >
          <Sider
            theme='light'
            collapsible
            collapsed={collapsed}
            collapsedWidth={collapsedWidth}
            width={siderWidth}
            onCollapse={(value) => setCollapsed(value)}
            style={{
              overflow: 'auto',
              height: '100vh',
              position: 'fixed',
              left: 0,
              top: 0,
              bottom: 0,
              borderRight:
                value !== 'light' ? '1px solid #343A46' : '1px solid #EBECF0',
              boxShadow:
                '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            }}
            trigger={null}
          >
            <h1
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconLogo style={{ width: 32, height: 32, color: '#149eca' }} />
              <span
                style={{
                  marginLeft: 10,
                  color: '#080e29',
                }}
              >
                Open-Job
              </span>
            </h1>
            <Menu
              selectedKeys={[cleanedPath]}
              mode='inline'
              items={items}
              onClick={({ keyPath }) => router.push(keyPath[0])}
              style={{
                border: 'none',
                padding: '5px 0',
              }}
            />
          </Sider>
        </div>
        <Layout>
          <Header
            theme={value}
            setTheme={setValue}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
          <Content
            style={{
              padding: 24,
              background: value === 'light' ? '#f5f5f5' : '#000',
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default BaseLayout;
