import React from 'react';
import { Layout } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import Link from 'next/link';

interface Props {
  theme: string;
}
const Header: React.FC<Props> = ({ theme }: Props) => {
  return (
    <Layout.Footer
      style={{
        background: theme === 'light' ? '#fff' : '#141414',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Link href='https://github.com/lijunping365/Open-Job'>
          <GithubOutlined /> Open-Job
        </Link>
        <Link href='https://github.com/lijunping365/Open-Job-Dashboard'>
          <GithubOutlined /> Open-Job-Dashboard
        </Link>
      </div>
      <div
        style={{ marginTop: 10 }}
      >{`Copyright © ${new Date().getFullYear()} OpenByteCode`}</div>
    </Layout.Footer>
  );
};

export default Header;
