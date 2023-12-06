import React, { useState } from 'react';
import { useAuthContext } from '@/components/Provider/AuthContext';
import ThemeSwitch from '@/components/Theme';

const menus = [
  {
    name: 'AI资讯',
    path: 'https://openbytecode.com/project/open-idea/docs/quick-start',
  },
  {
    name: 'AI应用',
    path: 'https://openbytecode.com/project/open-idea/docs/quick-start',
  },
  {
    name: 'AI实验室',
    path: 'https://openbytecode.com/project/open-idea/access',
  },
  {
    name: 'AI工具箱',
    path: 'https://openbytecode.com/project/open-idea/changelog',
  },
];

interface Props {
  theme: string;
  setTheme: (theme: string) => void;
}

const Header: React.FC<Props> = ({ theme, setTheme }: Props) => {
  const { user } = useAuthContext();
  const [menu, setMenu] = useState<boolean>(false);

  return (
    <header className='sticky inset-x-0 top-0 z-40 h-16 w-full border-b bg-white dark:border-border-dark dark:bg-wash-dark'>
      <div className='mx-auto flex items-center justify-between gap-4 px-4 py-3'>
        <ThemeSwitch
          theme={theme}
          setTheme={setTheme}
        />
      </div>
    </header>
  );
};

export default Header;
