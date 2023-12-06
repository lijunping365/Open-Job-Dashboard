import React from 'react';
import { useAuthContext } from '@/components/Provider/AuthContext';
import Image from 'next/image';
import cn from 'classnames';

interface Props {
  className?: string;
}

export default function Avatar({ className = 'h-10 w-10' }: Props) {
  const { user } = useAuthContext();

  return (
    <div className={cn('aspect-square', className)}>
      <Image
        className='rounded-full object-contain'
        alt='profile picture'
        referrerPolicy='no-referrer'
        height={40}
        width={40}
        src={
          user?.avatar
            ? user.avatar
            : `${process.env.NEXT_PUBLIC_BASE_PATH}/common/avatar.png`
        }
      />
    </div>
  );
}
