import ChatUser from '@/components/Chat/ChatUser';
import ChatAI from '@/components/Chat/ChatAI';
import * as React from 'react';
import { ChatItem } from '@/types/typings';

interface Props {
  chatList: ChatItem[];
}
const ChatList = ({ chatList }: Props) => {
  return (
    <main className='relative flex-1'>
      <div className='no-bg-scrollbar absolute inset-0 overflow-y-scroll'>
        <div className='m-auto h-full w-full max-w-screen-xl p-4'>
          {chatList.map((e) => {
            if (e.type === 'user') {
              return (
                <ChatUser
                  key={e.chatId}
                  text={e.content}
                  date={e.date}
                />
              );
            } else {
              return (
                <ChatAI
                  key={e.chatId}
                  content={e.content}
                  date={e.date}
                />
              );
            }
          })}
        </div>
      </div>
    </main>
  );
};

export default ChatList;
