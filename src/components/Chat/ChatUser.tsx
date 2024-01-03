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
      <div
        style={{
          marginBottom: '24px',
          display: 'flex',
          flexDirection: 'row-reverse',
          overflow: 'hidden',
        }}
      >
        <div>
          {user?.avatar ? (
            <Avatar
              size={32}
              src={user.avatar}
              alt='profile picture'
            />
          ) : (
            <IconFace style={{ width: '32px', height: '32px' }} />
          )}
        </div>

        <div>
          <p
            style={{
              lineHeight: '32px',
              margin: '0px 10px',
              textAlign: 'right',
            }}
          >
            {date}
          </p>

          <div style={{ marginTop: '8px', gap: '4px' }}>
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
