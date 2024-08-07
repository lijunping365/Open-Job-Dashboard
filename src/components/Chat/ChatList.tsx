import ChatUser from '@/components/Chat/ChatUser';
import ChatAI from '@/components/Chat/ChatAI';
import * as React from 'react';
import { ChatItem } from '@/types/typings';

interface Props {
  loading: boolean;
  chatList: ChatItem[];
  scrollRef: React.Ref<HTMLDivElement>;
  onChange: (value: boolean) => void;
  onReply: (index: number) => void;
  onApply: (index: number) => void;
}
const ChatList = ({
  chatList,
  scrollRef,
  onChange,
  onReply,
  loading,
  onApply,
}: Props) => {
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
        {chatList.map((e, index) => {
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
                data={e}
                loading={loading}
                latest={index === chatList.length - 1}
                onReply={() => onReply(index)}
                onApply={() => onApply(index)}
              />
            );
          }
        })}
      </div>
    </main>
  );
};

export default ChatList;
