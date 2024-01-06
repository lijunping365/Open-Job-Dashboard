import { Button, Input } from 'antd';
import { useState } from 'react';
import { ChatItem, ChatRequest } from '@/types/typings';
import ChatList from '@/components/Chat/ChatList';
import { IconPush } from '@/components/Icon/IconPush';
import { openAi } from '@/services/chat';
import useScrollToBottom from '@/hooks/useScrollToBottom';
import { IconLogo } from '@/components/Icon/IconLogo';

const { TextArea } = Input;

const AIChat = () => {
  const [generateLoading, setGenerateLoading] = useState<boolean>(false);
  const [inputText, setInputText] = useState('');
  const [chatList, setChatList] = useState<ChatItem[]>([]);
  const [hitBottom, setHitBottom] = useState(true);
  const { scrollRef, setAutoScroll, scrollDomToBottom } = useScrollToBottom();

  const onSubmit = async () => {
    if (!inputText) return;

    if (!hitBottom) scrollDomToBottom();

    const date = new Date();

    const askData: ChatItem = {
      chatId: (date.getTime() / 1000) * Math.random(),
      content: inputText,
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
    setChatList((chatList: any) => [...chatList, askData, answerData]);

    const paramsData: ChatRequest = {
      prompt: inputText,
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

  const handleKeyUp = async (event: any) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      await onSubmit();
    }
  };

  const onScrollChange = (value: boolean) => {
    setHitBottom(value);
    setAutoScroll(value);
  };

  return (
    <div className='chat-box'>
      <ChatList
        scrollRef={scrollRef}
        chatList={chatList}
        onChange={onScrollChange}
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
            onClick={() => onSubmit()}
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
