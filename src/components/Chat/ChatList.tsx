import ChatUser from '@/components/Chat/ChatUser';
import ChatAI from '@/components/Chat/ChatAI';
import * as React from 'react';
import { ChatItem } from '@/types/typings';

interface Props {
  chatList: ChatItem[];
  scrollRef: React.Ref<HTMLDivElement>;
  onChange: (value: boolean) => void;
}
const ChatList = ({ chatList, scrollRef, onChange }: Props) => {
  const onChatBodyScroll = (e: HTMLElement) => {
    const bottomHeight = e.scrollTop + e.clientHeight;
    const isHitBottom = bottomHeight >= e.scrollHeight - 10;
    onChange(isHitBottom);
  };
  return (
    <main className='chat-list-box'>
      <div
        ref={scrollRef}
        onScroll={(e) => onChatBodyScroll(e.currentTarget)}
        className='chat-list-wrapper'
      >
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
    </main>
  );
};

export default ChatList;
