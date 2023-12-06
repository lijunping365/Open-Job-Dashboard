import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import cn from 'classnames';
import { IconLight } from '@/components/Icon/IconLight';
import { IconDark } from '@/components/Icon/IconDark';

const ThemeSwitch = ({ classes }: any) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  return (
    <button
      className={cn(
        classes,
        'flex items-center justify-center rounded-full text-2xl text-link transition-colors duration-200 hover:bg-highlight focus:outline-none dark:text-link-dark dark:hover:bg-highlight-dark md:text-3xl'
      )}
      onClick={() =>
        setTheme(
          theme === 'dark' || resolvedTheme === 'dark' ? 'light' : 'dark'
        )
      }
    >
      <span className='sr-only'>Enable dark mode</span>
      {mounted && (theme === 'dark' || resolvedTheme === 'dark') ? (
        <IconDark className='h-5 w-5' />
      ) : (
        <IconLight className='h-7 w-7' />
      )}
    </button>
  );
};

export default ThemeSwitch;
