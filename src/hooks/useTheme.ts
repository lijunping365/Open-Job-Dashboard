import { useState } from 'react';

const useTheme = () => {
  const [value, setValue] = useState<string>('default');
  return [value, setValue];
}

export default useTheme;