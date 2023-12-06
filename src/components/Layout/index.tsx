import { Layout, Menu, ConfigProvider, theme } from 'antd';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { IconCollapsed } from '@/components/Icon/IconCollapsed';
import { IconUnCollapsed } from '@/components/Icon/IconUnCollapsed';
import useTheme from '@/hooks/useTheme';
import cn from 'classnames';
import Header from '@/components/Header';

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
    <div>
      <ConfigProvider
        theme={{
          algorithm:
            value === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm,
        }}
      >
        <Layout
          style={{
            minHeight: '100%',
          }}
        >
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
              trigger={
                <div className='hover:text-blue-500 text-left pl-6 bg-[#F2F8FF]'>
                  {collapsed ? (
                    <IconCollapsed className='w-7 h-7' />
                  ) : (
                    <IconUnCollapsed className='w-7 h-7' />
                  )}
                </div>
              }
            >
              <Menu
                selectedKeys={[cleanedPath]}
                mode='inline'
                // items={items}
                // onClick={({ keyPath }) => handlerChangeRoute(keyPath[0])}
                style={{
                  border: 'none',
                  padding: '10px 0',
                  backgroundColor: '#F2F8FF',
                }}
              />
            </Sider>
          </div>

          <Layout style={{ backgroundColor: '#F2F8FF' }}>
            <Content className='p-4'>
              <Header
                theme={value}
                setTheme={setValue}
              />
              {children}
              <Footer />
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </div>
  );
};

export default BaseLayout;
