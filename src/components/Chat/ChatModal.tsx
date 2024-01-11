import { Button, Modal, Tag, Typography } from 'antd';
import AIChat from '@/components/Chat/index';
import * as React from 'react';
import { useState } from 'react';
import { ChatItem } from '@/types/typings';
const { Paragraph } = Typography;
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
}

const ChatModal = ({
  chatList,
  setChatList,
  modalVisible,
  onClose,
}: ChatModalProps) => {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('This is an editable text.');

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
      title={null}
      width={500}
      open={modalVisible}
      onCancel={() => onClose()}
      closeIcon={null}
      footer={null}
    >
      {open ? (
        <Paragraph editable={{ onChange: setPrompt }}>{prompt}</Paragraph>
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
