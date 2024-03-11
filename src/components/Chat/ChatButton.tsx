import { Button, FloatButton, message, notification, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { ChatConfigType, ChatItem, OpenJobPrompt } from '@/types/typings';
import useLocalStorage from '@/hooks/useLocalStorage';
import { queryPrompt, updatePrompt } from '@/services/api';
import ChatConfig from '@/components/Chat/ChatConfig';
import AIChat from '@/components/Chat/ChatMain';
import {
  ClearOutlined,
  CommentOutlined,
  SettingOutlined,
  SyncOutlined,
} from '@ant-design/icons';

const ChatButton = () => {
  const [open, setOpen] = useState(false);
  const [openConfig, setOpenConfig] = useState(false);
  const [api, contextHolder] = notification.useNotification({ top: 88 });
  const [prompt, setPrompt] = useState<OpenJobPrompt>();

  const [chatList, setChatList] = useLocalStorage<ChatItem[]>(
    'open-job-ai',
    []
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
      setOpenConfig(false);
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
    if (openConfig) {
      onFetchPromptConfig().then();
    }
  }, [open, openConfig]);

  const openModal = () => {
    api.open({
      key: 'chat',
      message: <Header />,
      description: <ChatModal />,
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

  const Header = () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '12px',
        marginRight: '12px',
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
          onClick={() => setOpenConfig(!openConfig)}
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
      </div>
    </div>
  );

  const ChatModal = () => {
    return openConfig ? (
      <ChatConfig
        values={{ ...chatConfig, prompt: prompt?.prompt }}
        onSubmit={handleSaveConfig}
        onCancel={() => setOpenConfig(false)}
      />
    ) : (
      <AIChat
        onApply={() => console.log('ddddddddddd')}
        chatConfig={chatConfig}
        cacheChatList={chatList}
        setCacheChatList={setChatList}
      />
    );
  };

  return (
    <>
      {contextHolder}
      <FloatButton.Group
        open={open}
        trigger='click'
        type='primary'
        style={{ right: 24 }}
        icon={<CommentOutlined />}
        onClick={() => handlerOpen()}
      >
        {''}
      </FloatButton.Group>
    </>
  );
};

export default ChatButton;
