import React, { useRef, useState } from 'react';
import { IconOpenEye } from '@/components/Icon/IconOpenEye';
import { IconCloseEye } from '@/components/Icon/IconCloseEye';
import cn from 'classnames';

interface Props {
  id: string;
  divClassName?: string;
  inputClassName?: string;
  onChange: (value: any) => void;
}

const PasswordInput = ({
  id,
  divClassName,
  inputClassName,
  onChange,
}: Props) => {
  const [isShow, setShow] = useState(false);
  const inputRef = useRef<any>(null);

  const changeIcon = () => {
    if (inputRef.current) {
      setShow((prevState) => {
        if (!prevState) {
          inputRef.current.type = 'input';
        } else {
          inputRef.current.type = 'password';
        }
        return !prevState;
      });
    }
  };
  return (
    <div className={cn('relative', divClassName)}>
      <input
        ref={inputRef}
        id={id}
        name='password'
        type='password'
        autoComplete='current-password'
        required
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputClassName)}
      />
      {isShow ? (
        <IconOpenEye
          className='absolute right-3 top-2 h-6 w-6 cursor-pointer text-slate-400 group-focus-within:text-blue-500'
          onClick={() => changeIcon()}
        />
      ) : (
        <IconCloseEye
          className='absolute right-3 top-2 h-6 w-6 cursor-pointer text-slate-400 group-focus-within:text-blue-500'
          onClick={() => changeIcon()}
        />
      )}
    </div>
  );
};

export default PasswordInput;
