import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Tabs } from 'antd';
import Link from 'next/link';
import { IconLogo } from '@/components/Icon/IconLogo';

const Login: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState<string>('account');
  const [imageUrl, setImageUrl] = useState('');
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'auto',
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(15 23 42 / 0.04)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
      }}
    >
      <div style={{ flex: 1, padding: '32px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h1>
            <Link
              href='/'
              style={{
                height: '64px',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
              }}
            >
              <IconLogo style={{ width: 48, height: 48, color: '#149eca' }} />
              <span
                style={{
                  marginLeft: 10,
                  color: '#080e29',
                }}
              >
                Open-Job
              </span>
            </Link>

            <div
              style={{
                marginTop: '12px',
                marginBottom: '40px',
                color: '#5e637a',
                fontSize: '16px',
              }}
            >
              分布式调度平台
            </div>
          </h1>
        </div>
        <div style={{ width: '328px', margin: '0 auto' }}>
          <Form
            name='normal_login'
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Tabs
              activeKey={type}
              onChange={setType}
              centered
            >
              <Tabs.TabPane
                key='account'
                tab={'账户密码登录'}
              />
              <Tabs.TabPane
                key='mobile'
                tab={'手机号登录'}
              />
            </Tabs>

            {type === 'account' && (
              <>
                <Form.Item
                  name='username'
                  rules={[
                    { required: true, message: 'Please input your Username!' },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className='site-form-item-icon' />}
                    placeholder='Username'
                  />
                </Form.Item>
                <Form.Item
                  name='password'
                  rules={[
                    { required: true, message: 'Please input your Password!' },
                  ]}
                >
                  <Input
                    prefix={<LockOutlined className='site-form-item-icon' />}
                    type='password'
                    placeholder='Password'
                  />
                </Form.Item>
                <Form.Item>
                  <Form.Item
                    name='remember'
                    valuePropName='checked'
                    noStyle
                  >
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>

                  <a
                    className='login-form-forgot'
                    href=''
                  >
                    Forgot password
                  </a>
                </Form.Item>
              </>
            )}

            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                className='login-form-button'
              >
                Log in
              </Button>
              Or <a href=''>register now!</a>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
