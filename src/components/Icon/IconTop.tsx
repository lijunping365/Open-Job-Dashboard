import { memo } from 'react';

export const IconTop = memo<JSX.IntrinsicElements['svg']>(
  function IconTop(props) {
    return (
      <svg
        viewBox='0 0 1024 1024'
        version='1.1'
        xmlns='http://www.w3.org/2000/svg'
        {...props}
      >
        <path d='M160 96c0-19.2 12.8-32 32-32h640c19.2 0 32 12.8 32 32s-12.8 32-32 32h-640c-19.2 0-32-12.8-32-32z m384 208v624c0 19.2-12.8 32-32 32s-32-12.8-32-32v-624l-262.4 262.4c-12.8 12.8-32 12.8-44.8 0-12.8-12.8-12.8-32 0-44.8l316.8-316.8c6.4-6.4 16-9.6 22.4-9.6s16 3.2 22.4 9.6l316.8 316.8c12.8 12.8 12.8 32 0 44.8-12.8 12.8-32 12.8-44.8 0l-262.4-262.4z'></path>
      </svg>
    );
  }
);
