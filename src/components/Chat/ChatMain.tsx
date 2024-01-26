import { Button, Input } from 'antd';
import { useEffect, useState } from 'react';
import { ChatConfigType, ChatItem, ChatRequest } from '@/types/typings';
import ChatList from '@/components/Chat/ChatList';
import { IconPush } from '@/components/Icon/IconPush';
import { openAi } from '@/services/chat';
import useScrollToBottom from '@/hooks/useScrollToBottom';
import { IconLogo } from '@/components/Icon/IconLogo';

const { TextArea } = Input;

interface AIChatProps {
  chatConfig: ChatConfigType;
  cacheChatList: ChatItem[];
  setCacheChatList: any;
  onApply: (chatItem: ChatItem) => void;
}

const AIChat = ({
  cacheChatList,
  setCacheChatList,
  chatConfig,
  onApply,
}: AIChatProps) => {
  const [generateLoading, setGenerateLoading] = useState<boolean>(false);
  const [chatConfigure, setChatConfigure] = useState(chatConfig);
  const [inputText, setInputText] = useState('');
  const [chatList, setChatList] = useState<ChatItem[]>(cacheChatList);
  const [hitBottom, setHitBottom] = useState(true);
  const { scrollRef, setAutoScroll, scrollDomToBottom } = useScrollToBottom();

  const onSubmit = async (askContent: string) => {
    if (!askContent) return;

    if (!hitBottom) scrollDomToBottom();

    const date = new Date();

    const askData: ChatItem = {
      chatId: (date.getTime() / 1000) * Math.random(),
      content: askContent,
      date: date.toLocaleString(),
      type: 'user',
    };

    const answerData: ChatItem = {
      chatId: (date.getTime() / 1000) * Math.random(),
      content: '',
      date: date.toLocaleString(),
      type: 'assistant',
    };

    setInputText('');
    setGenerateLoading(true);
    setChatList((chatList: any) => [...chatList, askData, answerData]);

    const paramsData: ChatRequest = {
      prompt: askContent,
      usingContext: chatConfigure.usingContext,
    };

    const options = {
      onMessage(content: any, done: boolean) {
        if (done) {
          setGenerateLoading(false);
          return;
        }

        setChatList((prevChatList: ChatItem[]) => {
          prevChatList[prevChatList.length - 1].content = content;
          return [...prevChatList];
        });
      },
      onError(error: Error, statusCode: any) {
        setGenerateLoading(false);
        setChatList((prevChatList: ChatItem[]) => {
          prevChatList[prevChatList.length - 1].content = error.message;
          return [...prevChatList];
        });
      },
    };

    try {
      openAi(paramsData, options);
    } catch {
      setGenerateLoading(false);
    }
  };

  useEffect(() => {
    setCacheChatList(chatList);
  }, [generateLoading]);

  useEffect(() => {
    setChatList(cacheChatList);
  }, [cacheChatList]);

  useEffect(() => {
    setChatConfigure(chatConfig);
  }, [chatConfig]);

  const handleKeyUp = async (event: any) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      await onSubmit(inputText);
    }
  };

  const onScrollChange = (value: boolean) => {
    setHitBottom(value);
    setAutoScroll(value);
  };

  const onReply = async (index: number) => {
    const askContent = chatList[index - 1].content;
    if (generateLoading) return;
    if (askContent) {
      await onSubmit(askContent);
    }
  };

  return (
    <div className='chat-box'>
      <ChatList
        loading={generateLoading}
        scrollRef={scrollRef}
        chatList={chatList}
        onChange={onScrollChange}
        onReply={(index) => onReply(index)}
        onApply={(index) => onApply(chatList[index])}
      />
      <div className='chat-input-box'>
        <TextArea
          size={'large'}
          value={inputText}
          autoSize={{ minRows: 1, maxRows: 8 }}
          onPressEnter={handleKeyUp}
          onChange={(e) => {
            setInputText(e?.target?.value);
          }}
          placeholder='请输入问题，可通过shift+回车换行'
        />
        <div className='chat-send-btn-box'>
          <Button
            className='chat-send-btn'
            icon={<IconPush />}
            disabled={generateLoading}
            onClick={() => onSubmit(inputText)}
            type={'text'}
          />
        </div>
      </div>

      <div className='chat-footer-box'>
        Powered By <IconLogo className='chat-footer-logo' />
        <span style={{ color: '#000' }}>OpenByteCode</span>
      </div>
    </div>
  );
};

export default AIChat;
