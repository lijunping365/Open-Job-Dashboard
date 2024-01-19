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

interface ChatModalProps {
  modalVisible: boolean;
  chatList: ChatItem[];
  setChatList: any;
  onClose: () => void;
  chatConfig: ChatConfigType;
  saveChatConfig: any;
}

const ChatModal = ({
  chatList,
  setChatList,
  chatConfig,
  saveChatConfig,
  modalVisible,
  onClose,
}: ChatModalProps) => {
  const [open, setOpen] = useState(false);

  const handleSaveConfig = (values: any) => {
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
          onCancel={() => setOpen(false)}
          onSubmit={handleSaveConfig}
          values={chatConfig}
        />
      ) : (
        <AIChat
          cacheChatList={chatList}
          setCacheChatList={setChatList}
        />
      )}
    </Modal>
  );
};

export default ChatModal;
