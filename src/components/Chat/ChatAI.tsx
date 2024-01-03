import { IconChatGPT } from '@/components/Icon/IconChatGPT';
import { IconReload } from '@/components/Icon/IconReload';
import { IconSetting } from '@/components/Icon/IconSetting';
import * as React from 'react';
import { Markdown } from '@/components/Chat/Markdown';
import { useConfigContext } from '@/components/Provider/GlobalConfigContext';

interface ChatBotProps {
  content: string;
  date: string;
}

const ChatAI = ({ content, date }: ChatBotProps) => {
  const { theme } = useConfigContext();

  return (
    <>
      <div
        style={{
          marginBottom: '24px',
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        <div>
          <IconChatGPT style={{ width: '32px', height: '32px' }} />
        </div>

        <div style={{ marginLeft: '10px' }}>
          <p
            style={{
              lineHeight: '32px',
              margin: '0px',
            }}
          >
            {date}
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginTop: '8px',
              alignItems: 'end',
              gap: '4px',
            }}
          >
            <div
              style={{
                backgroundColor: theme === 'light' ? '#f4f6f8' : '#081f33',
                borderRadius: '8px',
                padding: '8px',
              }}
            >
              <div style={{ overflowWrap: 'break-word' }}>
                <Markdown content={content || ''} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <button className='mb-2 text-neutral-300 transition hover:text-neutral-800 dark:hover:text-neutral-300'>
                <IconReload />
              </button>
              <button className='text-neutral-300 transition hover:text-neutral-800 dark:hover:text-neutral-200'>
                <IconSetting />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatAI;
