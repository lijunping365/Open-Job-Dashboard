import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, FloatButton, message, notification, Tag } from 'antd';
import { ChatConfigType, ChatItem, OpenJobPrompt } from '@/types/typings';
import useLocalStorage from '@/hooks/useLocalStorage';
import { queryPrompt, updatePrompt } from '@/services/api';
import {
  AIChatContext,
  AIChatContextValue,
} from '@/components/Provider/AIChatContext';
import {
  ClearOutlined,
  CommentOutlined,
  SettingOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import ChatConfig from '@/components/Chat/ChatConfig';
import AIChat from '@/components/Chat/ChatMain';
import { useAIApplyContext } from '@/components/Provider/AIApplyContext';

export interface AIChatProviderProps {
  children: React.ReactNode;
}

const excludePath = ['/login', '/404'];

export function AIChatProvider(props: AIChatProviderProps) {
  const router = useRouter();
  const cleanedPath = router.asPath.split(/[\?\#]/)[0];

  const [openConfig, setOpenConfig] = useState(false);
  const [api, contextHolder] = notification.useNotification({ top: 88 });
  const [prompt, setPrompt] = useState<OpenJobPrompt>();
  const { openChatModal, setOpenChatModal, onApply } = useAIApplyContext();

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

  const closeModal = () => {
    api.destroy('chat');
  };

  const openModal = () => {
    api.open({
      key: 'chat',
      message: <Header />,
      description: (
        <AIChatContext.Consumer>
          {(value) => <ChatModal {...value} />}
        </AIChatContext.Consumer>
      ),
      duration: null,
      style: {
        width: 480,
        height: 500,
      },
      onClose: () => setOpenChatModal && setOpenChatModal(false),
    });
  };

  const onFetchPromptConfig = async () => {
    const result = await queryPrompt();
    if (result) {
      setPrompt(result);
    }
  };

  const handlerOpenConfig = () => {
    setOpenConfig((prevState) => {
      return !prevState;
    });
  };

  useEffect(() => {
    onFetchPromptConfig().then();
  }, [openConfig]);

  useEffect(() => {
    if (openChatModal) {
      openModal();
    } else {
      closeModal();
    }
  }, [openChatModal]);

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
          onClick={() => handlerOpenConfig()}
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

  const ChatModal = ({
    openConfig,
    setOpenConfig,
    chatList,
    setChatList,
    chatConfig,
    handleSaveConfig,
    prompt,
  }: AIChatContextValue) => {
    return openConfig ? (
      <ChatConfig
        values={{ ...chatConfig, prompt: prompt?.prompt }}
        onSubmit={(values) => handleSaveConfig && handleSaveConfig(values)}
        onCancel={() => setOpenConfig && setOpenConfig(false)}
      />
    ) : (
      <AIChat
        onApply={(chatItem) => onApply && onApply(chatItem)}
        chatConfig={chatConfig}
        cacheChatList={chatList}
        setCacheChatList={setChatList}
      />
    );
  };

  return (
    <>
      {props.children}
      {!excludePath.includes(cleanedPath) && (
        <AIChatContext.Provider
          value={{
            openConfig,
            setOpenConfig,
            prompt,
            chatList,
            setChatList,
            chatConfig,
            handleSaveConfig,
          }}
        >
          {contextHolder}
          <FloatButton.Group
            open={openChatModal}
            trigger='click'
            type='primary'
            style={{ right: 24 }}
            icon={<CommentOutlined />}
            onClick={() => setOpenChatModal && setOpenChatModal(!openChatModal)}
          >
            {''}
          </FloatButton.Group>
        </AIChatContext.Provider>
      )}
    </>
  );
}
