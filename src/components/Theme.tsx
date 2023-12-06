import { useEffect, useState } from 'react';
import cn from 'classnames';
import { IconLight } from '@/components/Icon/IconLight';
import { IconDark } from '@/components/Icon/IconDark';
import useTheme from '@/hooks/useTheme';

interface Props {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeSwitch = ({ theme, setTheme }: Props) => {
  const [mounted, setMounted] = useState(false);

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  return (
    <button
      className='h-10 w-10 flex items-center justify-center rounded-full text-2xl text-link transition-colors duration-200 hover:bg-highlight focus:outline-none dark:text-link-dark dark:hover:bg-highlight-dark md:text-3xl'
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <span className='sr-only'>Enable dark mode</span>
      {mounted && theme === 'dark' ? (
        <IconDark className='h-5 w-5' />
      ) : (
        <IconLight className='h-7 w-7' />
      )}
    </button>
  );
};

export default ThemeSwitch;
