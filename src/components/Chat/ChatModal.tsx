import { FloatButton, notification } from 'antd';
import AIChat from '@/components/Chat/index';
import * as React from 'react';
import { CommentOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { ChatItem } from '@/types/typings';

interface ChatModalProps {
  chatList: ChatItem[];
  setChatList: any;
}

const ChatModal = ({ chatList, setChatList }: ChatModalProps) => {
  const [api, contextHolder] = notification.useNotification({ top: 88 });
  const [open, setOpen] = useState(false);
  const openModal = () => {
    api.open({
      key: 'chat',
      message: 'AI Chat',
      description: (
        <AIChat
          cacheChatList={chatList}
          setCacheChatList={setChatList}
        />
      ),
      duration: null,
      style: {
        width: 500,
        height: 480,
      },
      onClose: () => setOpen(false),
    });
  };

  const closeModal = () => {
    api.destroy('chat');
  };

  const handlerOpen = () => {
    setOpen((prevState) => {
      if (prevState) {
        closeModal();
      } else {
        openModal();
      }
      return !prevState;
    });
  };

  return (
    <>
      {contextHolder}
      <FloatButton.Group
        open={open}
        trigger='click'
        type='primary'
        style={{ right: 24, zIndex: 9999 }}
        icon={<CommentOutlined />}
        onClick={() => handlerOpen()}
      >
        {''}
      </FloatButton.Group>
    </>
  );
};

export default ChatModal;
