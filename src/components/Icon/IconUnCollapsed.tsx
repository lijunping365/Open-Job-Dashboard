import { memo } from 'react';
import * as React from 'react';

export const IconUnCollapsed = memo<JSX.IntrinsicElements['svg']>(
  function IconUnCollapsed(props) {
    return (
      <svg
        viewBox='0 0 1024 1024'
        version='1.1'
        xmlns='http://www.w3.org/2000/svg'
        fill='currentColor'
        {...props}
      >
        <path d='M192.037 287.953h640.124c17.673 0 32-14.327 32-32s-14.327-32-32-32H192.037c-17.673 0-32 14.327-32 32s14.327 32 32 32zM192.028 543.17h393.608c17.673 0 32-14.327 32-32s-14.327-32-32-32H192.028c-17.673 0-32 14.327-32 32s14.327 32 32 32zM832.161 735.802H192.037c-17.673 0-32 14.327-32 32s14.327 32 32 32h640.124c17.673 0 32-14.327 32-32s-14.327-32-32-32zM705.162 671.594l160-160-160-160z'></path>
      </svg>
    );
  }
);
