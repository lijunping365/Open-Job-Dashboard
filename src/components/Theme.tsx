import { useEffect, useState } from 'react';
import cn from 'classnames';
import { IconLight } from '@/components/Icon/IconLight';
import { IconDark } from '@/components/Icon/IconDark';
import { Button } from 'antd';

interface Props {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeSwitch = ({ theme, setTheme }: Props) => {
  const [mounted, setMounted] = useState(false);

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  return (
    <Button
      type='text'
      style={{ display: 'flex', alignItems: 'center', justifyItems: 'center' }}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {mounted && theme === 'dark' ? (
        <IconDark style={{ height: 24, width: 24 }} />
      ) : (
        <IconLight style={{ height: 28, width: 28 }} />
      )}
    </Button>
  );
};

export default ThemeSwitch;
