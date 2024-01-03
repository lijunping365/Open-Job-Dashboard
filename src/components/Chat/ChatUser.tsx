import { IconFace } from '@/components/Icon/IconFace';
import { IconSetting } from '@/components/Icon/IconSetting';
import * as React from 'react';
import Image from 'next/image';
import { useAuthContext } from '@/components/Provider/AuthContext';

interface ChatMeProps {
  text: string;
  date: string;
}

const ChatUser = ({ text, date }: ChatMeProps) => {
  const { user } = useAuthContext();
  return (
    <>
      <div className='mb-6 flex w-full flex-row-reverse overflow-hidden'>
        <div className='ml-2 flex h-8 shrink-0 basis-8 items-center justify-center overflow-hidden rounded-full'>
          <span>
            {user?.avatar ? (
              <div className='aspect-square h-full w-full'>
                <Image
                  className='rounded-full object-contain'
                  height={32}
                  width={32}
                  src={user.avatar}
                  alt='profile picture'
                  referrerPolicy='no-referrer'
                />
              </div>
            ) : (
              <IconFace />
            )}
          </span>
        </div>
        <div className='items-end overflow-hidden text-sm'>
          <p className='text-right text-xs text-[#b4bbc4]'>{date}</p>
          <div className='mt-2 flex flex-row-reverse items-end gap-1'>
            <div className='min-w-[20px] rounded-md bg-[#d2f9d1] px-3 py-2 text-base text-black dark:bg-[#a1dc95]'>
              <div className='break-words leading-relaxed'>
                <div className='whitespace-pre-wrap'>{text}</div>
              </div>
            </div>
            <div className='flex flex-col'>
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

export default ChatUser;
