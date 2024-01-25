import { Button, Modal, Tag } from 'antd';
import AIChat from '@/components/Chat/ChatMain';
import * as React from 'react';
import { useState } from 'react';
import { ChatConfigType, ChatItem } from '@/types/typings';
import ChatConfig from '@/components/Chat/ChatConfig';
import {
  ClearOutlined,
  CloseOutlined,
  SettingOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import useLocalStorage from '@/hooks/useLocalStorage';

interface ChatModalProps {
  modalVisible: boolean;
  onClose: () => void;
  onChatComplete: (chatList: ChatItem[]) => void;
}

const ChatModal = ({
  modalVisible,
  onClose,
  onChatComplete,
}: ChatModalProps) => {
  const [open, setOpen] = useState(false);

  const [chatList, setChatList] = useLocalStorage<ChatItem[]>(
    'open-job-ai',
    [],
    onChatComplete
  );

  const [chatConfig, saveChatConfig] = useLocalStorage<ChatConfigType>(
    'chat-config',
    { usingContext: true }
  );

  const handleSaveConfig = async (values: ChatConfigType) => {
    saveChatConfig(values);
    setOpen(false);
  };

  const Header = () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '12px',
      }}
    >
      <h2 style={{ fontSize: '20px', lineHeight: '22px', margin: 0 }}>
        OpenJobGPT
      </h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Tag color='green'>connected</Tag>

        <Button
          type={'text'}
          size={'small'}
          icon={<SettingOutlined />}
          onClick={() => setOpen(!open)}
        />

        <Button
          type={'text'}
          size={'small'}
          icon={<SyncOutlined />}
        />

        <Button
          type={'text'}
          size={'small'}
          icon={<ClearOutlined />}
          onClick={() => setChatList([])}
        />

        <Button
          type={'text'}
          size={'small'}
          icon={<CloseOutlined />}
          onClick={() => onClose()}
        />
      </div>
    </div>
  );

  return (
    <Modal
      title={<Header />}
      width={500}
      open={modalVisible}
      onCancel={() => onClose()}
      closeIcon={null}
      footer={null}
    >
      {open ? (
        <ChatConfig
          values={chatConfig}
          onSubmit={handleSaveConfig}
          onCancel={() => setOpen(false)}
        />
      ) : (
        <AIChat
          chatConfig={chatConfig}
          cacheChatList={chatList}
          setCacheChatList={setChatList}
        />
      )}
    </Modal>
  );
};

export default ChatModal;
