import { memo } from 'react';

export const IconReload = memo<JSX.IntrinsicElements['svg']>(
  function IconReload(props) {
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
          d='M18.537 19.567A9.961 9.961 0 0 1 12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10c0 2.136-.67 4.116-1.81 5.74L17 12h3a8 8 0 1 0-2.46 5.772l.997 1.795Z'
        />
      </svg>
    );
  }
);
