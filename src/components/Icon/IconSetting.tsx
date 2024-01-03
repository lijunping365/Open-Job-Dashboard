import { memo } from 'react';

export const IconSetting = memo<JSX.IntrinsicElements['svg']>(
  function IconSetting(props) {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        xmlnsXlink='http://www.w3.org/1999/xlink'
        aria-hidden='true'
        role='img'
        width='1em'
        height='1em'
        viewBox='0 0 24 24'
      >
        <path
          fill='currentColor'
          d='M12 3c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2Zm0 14c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2Zm0-7c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2Z'
        />
      </svg>
    );
  }
);
