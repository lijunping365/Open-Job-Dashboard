import { IconFace } from '@/components/Icon/IconFace';
import * as React from 'react';
import { useAuthContext } from '@/components/Provider/AuthContext';
import { Avatar } from 'antd';
import { useConfigContext } from '@/components/Provider/GlobalConfigContext';

interface ChatMeProps {
  text: string;
  date: string;
}

const ChatUser = ({ text, date }: ChatMeProps) => {
  const { theme } = useConfigContext();
  const { user } = useAuthContext();
  return (
    <>
      <div className='chat-completion-user-box'>
        <div>
          {user?.avatar ? (
            <Avatar
              size={32}
              src={user.avatar}
              alt='profile picture'
            />
          ) : (
            <IconFace className='chat-completion-icon' />
          )}
        </div>

        <div style={{ marginRight: '10px' }}>
          <p className='chat-completion-user-date'>{date}</p>
          <div className='chat-completion-user-wrapper'>
            <div
              style={{
                backgroundColor: theme === 'light' ? '#d2f9d1' : '#a1dc95',
                borderRadius: '8px',
                padding: '8px',
                color: '000',
              }}
            >
              <div style={{ overflowWrap: 'break-word' }}>
                <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatUser;
