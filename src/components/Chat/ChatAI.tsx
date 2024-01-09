import { IconChatGPT } from '@/components/Icon/IconChatGPT';
import { IconReload } from '@/components/Icon/IconReload';
import { IconSetting } from '@/components/Icon/IconSetting';
import * as React from 'react';
import { Markdown } from '@/components/Chat/Markdown';
import { useConfigContext } from '@/components/Provider/GlobalConfigContext';
import { Button, Spin } from 'antd';
import { ChatItem } from '@/types/typings';

interface ChatBotProps {
  loading: boolean;
  data: ChatItem;
  onReply: () => void;
}

const ChatAI = ({ data, onReply, loading }: ChatBotProps) => {
  const { theme } = useConfigContext();

  return (
    <>
      <div className='chat-ai-box'>
        <div className='chat-icon-ai-wrapper'>
          <IconChatGPT className='chat-icon' />
          <p className='chat-date'>{data.date}</p>
        </div>

        <div>
          <div className='chat-ai-wrapper'>
            <div
              style={{
                backgroundColor: theme === 'light' ? '#f4f6f8' : '#081f33',
                borderRadius: '8px',
                padding: '10px',
              }}
            >
              <Markdown content={data.content || ''} />
              {loading && <Spin size={'small'} />}
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', gap: '4px' }}>
              <Button
                type={'text'}
                size={'small'}
                icon={<IconReload />}
                onClick={() => onReply()}
              />
              <Button
                type={'text'}
                size={'small'}
                icon={<IconSetting />}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatAI;
