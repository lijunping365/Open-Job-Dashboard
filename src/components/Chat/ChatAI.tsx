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
      <div className='chat-completion-ai-box'>
        <div>
          <IconChatGPT className='chat-completion-icon' />
        </div>

        <div style={{ marginLeft: '10px' }}>
          <p className='chat-completion-ai-date'>{date}</p>
          <div className='chat-completion-ai-wrapper'>
            <div
              style={{
                backgroundColor: theme === 'light' ? '#f4f6f8' : '#081f33',
                borderRadius: '8px',
                padding: '8px',
              }}
            >
              <Markdown content={content || ''} />
            </div>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
            >
              <Button
                type={'text'}
                size={'small'}
                icon={<IconReload />}
              ></Button>
              <Button
                type={'text'}
                size={'small'}
                icon={<IconSetting />}
              ></Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatAI;
