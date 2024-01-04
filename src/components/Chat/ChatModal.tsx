import { FloatButton, Modal, notification } from 'antd';
import AIChat from '@/components/Chat/index';
import * as React from 'react';
import { CommentOutlined } from '@ant-design/icons';

const ChatModal = () => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = () => {
    api.open({
      message: 'Notification Title',
      description: <AIChat />,
      duration: 0,
      style: {
        width: 500,
        height: 380,
      },
    });
  };

  return (
    <>
      {contextHolder}
      <FloatButton.Group
        trigger='click'
        type='primary'
        style={{ right: 24 }}
        icon={<CommentOutlined />}
        onClick={() => openNotification()}
      >
        {''}
      </FloatButton.Group>
    </>
  );
};

export default ChatModal;
