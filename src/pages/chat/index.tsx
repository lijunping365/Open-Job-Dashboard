import * as React from 'react';
import AIChat from '@/components/Chat';
import BaseLayout from '@/components/Layout';
import { Card } from 'antd';

export default function ChatPage() {
  return (
    <>
      <BaseLayout>
        <Card bordered={false}>
          <AIChat />
        </Card>
      </BaseLayout>
    </>
  );
}
