import { memo } from 'react';

export const IconFolder = memo<JSX.IntrinsicElements['svg']>(
  function IconFolder(props) {
    return (
      <svg
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth='2'
        {...props}
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
        ></path>
      </svg>
    );
  }
);
