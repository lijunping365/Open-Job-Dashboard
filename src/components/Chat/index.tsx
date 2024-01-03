import { Button, Input } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { ChatItem, ChatRequest } from '@/types/typings';
import ChatList from '@/components/Chat/ChatList';
import { IconPush } from '@/components/Icon/IconPush';
import { openAi } from '@/services/chat';

const { TextArea } = Input;

const AIChat = () => {
  const [generateLoading, setGenerateLoading] = useState<boolean>(false);
  const [inputText, setInputText] = useState('');
  const [chatList, setChatList] = useState<ChatItem[]>([]);
  const textareaRef = useRef<any>(null);
  const messageRef = useRef<any>(null);

  const msgToBottom = () => {
    setTimeout(() => {
      messageRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 0);
  };

  const onSubmit = async (inputTextValue: string) => {
    const date = new Date();

    const askData: ChatItem = {
      chatId: (date.getTime() / 1000) * Math.random(),
      content: inputTextValue,
      date: date.toLocaleString(),
      type: 'user',
    };

    const answerData: ChatItem = {
      chatId: (date.getTime() / 1000) * Math.random(),
      content: '',
      date: date.toLocaleString(),
      type: 'assistant',
    };

    setChatList((chatList: any) => [...chatList, askData, answerData]);

    const paramsData: ChatRequest = {
      prompt: inputTextValue,
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

  const onWheel = (event: any) => {
    if (event.deltaY !== 0) {
      messageRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  };

  const handleKeyUp = async (event: any) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      await onSubmit(inputText);
    }
  };

  useEffect(() => {
    msgToBottom();
  }, [chatList]);

  return (
    <div className=' h-full flex flex-col shadow bg-[#f0f0f0]/30'>
      <div
        onWheel={onWheel}
        className='flex flex-col flex-1 center relative grow  overflow-scroll'
      >
        <div
          ref={messageRef}
          className='bg-white '
        >
          <ChatList chatList={chatList} />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          position: 'relative',
          flexDirection: 'column',
        }}
      >
        <TextArea
          size={'large'}
          ref={textareaRef}
          value={inputText}
          autoSize={{ minRows: 1, maxRows: 8 }}
          onPressEnter={handleKeyUp}
          onChange={(e) => {
            setInputText(e?.target?.value);
          }}
          placeholder='请输入问题，可通过shift+回车换行'
        />
        <div style={{ position: 'absolute', bottom: '2px', right: '2px' }}>
          <Button
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            icon={<IconPush />}
            disabled={generateLoading}
            onClick={() => onSubmit(inputText)}
            type={'text'}
          />
        </div>
      </div>
    </div>
  );
};

export default AIChat;
