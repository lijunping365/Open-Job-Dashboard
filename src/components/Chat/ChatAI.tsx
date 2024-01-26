import { IconChatGPT } from '@/components/Icon/IconChatGPT';
import { IconReload } from '@/components/Icon/IconReload';
import * as React from 'react';
import { Markdown } from '@/components/Chat/Markdown';
import { useConfigContext } from '@/components/Provider/GlobalConfigContext';
import { Button, Spin } from 'antd';
import { ChatItem } from '@/types/typings';
import { CheckOutlined } from '@ant-design/icons';

interface ChatBotProps {
  loading: boolean;
  data: ChatItem;
  onReply: () => void;
  onApply: () => void;
  latest: boolean;
}

const ChatAI = ({ data, onReply, loading, latest, onApply }: ChatBotProps) => {
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
              {loading && latest && <Spin size={'small'} />}
            </div>

            {!loading && (
              <div
                style={{ display: 'flex', flexDirection: 'row', gap: '4px' }}
              >
                <Button
                  type={'text'}
                  size={'small'}
                  icon={<CheckOutlined />}
                  onClick={() => onApply()}
                />

                <Button
                  type={'text'}
                  size={'small'}
                  icon={<IconReload />}
                  onClick={() => onReply()}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatAI;
