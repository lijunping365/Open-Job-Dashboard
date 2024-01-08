import { IconChatGPT } from '@/components/Icon/IconChatGPT';
import { IconReload } from '@/components/Icon/IconReload';
import { IconSetting } from '@/components/Icon/IconSetting';
import * as React from 'react';
import { Markdown } from '@/components/Chat/Markdown';
import { useConfigContext } from '@/components/Provider/GlobalConfigContext';
import { Button } from 'antd';

interface ChatBotProps {
  content: string;
  date: string;
}

const ChatAI = ({ content, date }: ChatBotProps) => {
  const { theme } = useConfigContext();

  return (
    <>
      <div className='chat-ai-box'>
        <div className='chat-icon-ai-wrapper'>
          <IconChatGPT className='chat-icon' />
          <p className='chat-date'>{date}</p>
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
              <Markdown content={content || ''} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', gap: '4px' }}>
              <Button
                type={'text'}
                size={'small'}
                icon={<IconReload />}
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
