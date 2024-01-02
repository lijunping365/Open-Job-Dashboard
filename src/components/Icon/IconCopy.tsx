import React, { memo } from 'react';

export const IconCopy = memo<JSX.IntrinsicElements['svg']>(
  function IconCopy(props) {
    return (
      <svg
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
        xmlns='http://www.w3.org/2000/svg'
        {...props}
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='1.6px'
          d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
        />
      </svg>
    );
  }
);
