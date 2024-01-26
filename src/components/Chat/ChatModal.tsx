import { Button, message, Modal, Tag } from 'antd';
import AIChat from '@/components/Chat/ChatMain';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ChatConfigType, ChatItem, OpenJobPrompt } from '@/types/typings';
import ChatConfig from '@/components/Chat/ChatConfig';
import {
  ClearOutlined,
  CloseOutlined,
  SettingOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import useLocalStorage from '@/hooks/useLocalStorage';
import { queryPrompt, updatePrompt } from '@/services/api';

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
  const [prompt, setPrompt] = useState<OpenJobPrompt>();

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
    const hide = message.loading('正在保存，请稍等');
    try {
      await updatePrompt({ id: prompt?.id, prompt: values.prompt });
      hide();
      message.success('配置保存成功');
      setOpen(false);
    } catch (error) {
      hide();
      message.error('配置保存失败，请重试！');
    }
  };

  const onFetchPromptConfig = async () => {
    const result = await queryPrompt();
    if (result) {
      setPrompt(result);
    }
  };

  useEffect(() => {
    onFetchPromptConfig().then();
  }, [open]);

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
          values={{ ...chatConfig, ...prompt }}
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
