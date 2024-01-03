import { Button, Input } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { ChatItem } from '@/types/typings';
import ChatList from '@/components/Chat/ChatList';

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

  const onSubmit = async (inputTextValue: string) => {};

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
          <ChatList
            scrollRef={scrollRef}
            chatList={chatList}
            onChange={onScrollChange}
          />
        </div>
      </div>
      <div className='border-t box-border shrink-0	 flex items-center flex-col bg-[#ffffff]'>
        <div>
          <TextArea
            ref={textareaRef}
            value={inputText}
            autoSize={{ minRows: 2, maxRows: 8 }}
            onPressEnter={handleKeyUp}
            onChange={(e) => {
              setInputText(e?.target?.value);
            }}
            className='block h-[60px] md:h-[80px] p-2 md:p-5 md:leading-[25px] border-0 outline-0	box-border resize-none w-full text-lg font-[600] text-gray-900'
            placeholder='请输入问题，可通过shift+回车换行'
          />
        </div>
        <div className='w-full flex py-[10px] justify-between pr-[20px] items-center'>
          <div>
            <span className={'mr-[10px] text-[12px] text-[#333333]/50'}>
              enter发送/shift+enter换行
            </span>
            <Button
              disabled={generateLoading}
              onClick={() => onSubmit(inputText)}
              type='primary'
            >
              发送
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
