import { IconChatGPT } from '@/components/Icon/IconChatGPT';
import { IconReload } from '@/components/Icon/IconReload';
import { IconSetting } from '@/components/Icon/IconSetting';
import * as React from 'react';
import { Markdown } from '@/components/Chat/Markdown';

interface ChatBotProps {
  content: string;
  date: string;
}

const ChatAI = ({ content, date }: ChatBotProps) => {
  return (
    <>
      <div className='mb-6 flex w-full overflow-hidden'>
        <div className='mr-2 flex h-8 shrink-0 basis-8 items-center justify-center overflow-hidden rounded-full'>
          <span className='dark:text-white'>
            <IconChatGPT className='h-7 w-7' />
          </span>
        </div>
        <div className='items-start overflow-hidden text-sm'>
          <p className='text-left text-xs text-[#b4bbc4]'>{date}</p>
          <div className='mt-2 flex flex-row items-end gap-1'>
            <div className='min-w-[20px] rounded-md bg-[#f4f6f8] px-3 py-2 text-base text-black dark:bg-slate-800 dark:text-slate-300'>
              <div className='break-words leading-relaxed'>
                <div className='flex items-end'>
                  <div className='w-full'>
                    <Markdown content={content || ''} />
                  </div>
                </div>
              </div>
            </div>
            <div className='flex flex-col'>
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
