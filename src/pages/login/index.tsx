import React, { useCallback, useEffect, useState } from 'react';
import {
  HourglassOutlined,
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, Tabs, Image, message, TabsProps } from 'antd';
import Link from 'next/link';
import { IconLogo } from '@/components/Icon/IconLogo';
import { getFakeImageCaptcha } from '@/services/api';
import { getDeviceId } from '@/lib/cache';

const items: TabsProps['items'] = [
  {
    key: 'account',
    label: '账户密码登录',
  },
  {
    key: 'mobile',
    label: '手机号登录',
  },
];
const Login: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState<string>('account');
  const [imageUrl, setImageUrl] = useState('');
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  const onGetImageCaptcha = useCallback(async () => {
    getFakeImageCaptcha({ deviceId: getDeviceId() })
      .then((result: any) => {
        if (result && result.success)
          setImageUrl(`data:image/jpeg;base64,${result.imageCode}`);
      })
      .catch((error) => {
        message.error(`获取验证码失败: ${error}`);
      });
  }, []);

  useEffect(() => {
    if (type === 'account') {
      onGetImageCaptcha().then();
    }
  }, []);

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
              defaultActiveKey='account'
              items={items}
              onChange={setType}
              centered
            />

            {type === 'account' && (
              <>
                <Form.Item
                  name='username'
                  rules={[{ required: true, message: '请输入用户名!' }]}
                >
                  <Input
                    size={'large'}
                    placeholder='用户名'
                    prefix={<UserOutlined />}
                  />
                </Form.Item>
                <Form.Item
                  name='password'
                  rules={[{ required: true, message: '请输入密码!' }]}
                >
                  <Input.Password
                    size={'large'}
                    placeholder='密码'
                    prefix={<LockOutlined />}
                  />
                </Form.Item>
                <Form.Item
                  name='captcha'
                  rules={[{ required: true, message: '请输入验证码!' }]}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Input
                      size={'large'}
                      placeholder='验证码'
                      prefix={<HourglassOutlined />}
                    />
                    <Image
                      style={{
                        marginLeft: '20px',
                        width: '100%',
                        height: '100%',
                      }}
                      alt='captcha'
                      preview={false}
                      src={imageUrl}
                      onClick={onGetImageCaptcha}
                    />
                  </div>
                </Form.Item>
              </>
            )}

            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                className='login-form-button'
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
