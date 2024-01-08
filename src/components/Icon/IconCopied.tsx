import React, { memo } from 'react';

export const IconCopied = memo<JSX.IntrinsicElements['svg']>(
  function IconCopied(props) {
    return (
      <svg
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
        xmlns='http://www.w3.org/2000/svg'
        width='1.1em'
        height='1.1em'
        {...props}
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M5 13l4 4L19 7'
        />
      </svg>
    );
  }
);
