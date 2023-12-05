import { Layout, Menu } from 'antd';
import { useState } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { IconCollapsed } from '@/components/Icon/IconCollapsed';
import { IconUnCollapsed } from '@/components/Icon/IconUnCollapsed';

const { Content, Footer, Sider } = Layout;

const KnowledgeLayout = ({ children }: any) => {
  const router = useRouter();
  const cleanedPath = router.asPath.split(/[\?\#]/)[0];
  const [collapsed, setCollapsed] = useState(false);

  const baseClassName = `open-job-sider`;

  // 收起的宽度
  const collapsedWidth = 64;

  const siderWidth = 208;

  return (
    <div className={className}>
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
            style={{
              overflow: 'auto',
              height: '100vh',
              position: 'fixed',
              backgroundColor: '#F2F8FF',
              left: 0,
              top: 65,
              bottom: 0,
            }}
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
              items={items}
              onClick={({ keyPath }) => handlerChangeRoute(keyPath[0])}
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
            <div
              className='flex flex-col py-4 px-8 text-base'
              style={{
                backgroundImage: 'url("https://ew6.cn/251701348090_.pic.png")',
                backgroundSize: 'cover',
              }}
            ></div>
            {children}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default KnowledgeLayout;
