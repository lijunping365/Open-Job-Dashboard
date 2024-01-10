import { Modal } from 'antd';
import AIChat from '@/components/Chat/index';
import * as React from 'react';
import { useState } from 'react';
import { ChatItem } from '@/types/typings';

interface ChatModalProps {
  modalVisible: boolean;
  chatList: ChatItem[];
  setChatList: any;
  onClose: () => void;
}

const ChatModal = ({
  chatList,
  setChatList,
  modalVisible,
  onClose,
}: ChatModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      title='AI Chat'
      width={500}
      open={modalVisible}
      onCancel={() => onClose()}
      footer={null}
    >
      <AIChat
        cacheChatList={chatList}
        setCacheChatList={setChatList}
      />
    </Modal>
  );
};

export default ChatModal;
