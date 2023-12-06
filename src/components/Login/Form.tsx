import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { currentUser, login } from '@/services/login';
import { useAuthContext } from '@/components/Provider/AuthContext';
import { generateUUID } from '@/lib/utils';
import { setAccessToken } from '@/lib/cache';
import { getFakeImageCaptcha } from '@/services/captcha';
import { toast } from 'react-toastify';
import PasswordInput from '@/components/PasswordInput';

const deviceId = generateUUID();
const FormLogin = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [captcha, setCaptcha] = useState('');
  const { setUser } = useAuthContext();

  const router = useRouter();

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    try {
      const response: any = await login({
        username,
        password,
        deviceId,
        captcha,
        type: 'account',
      });
      setAccessToken(response.accessToken);
      const user = await currentUser();
      if (user) {
        setUser(user);
        await router.replace('/');
      }
    } catch (error) {
      toast.error(`登录失败:${error}`);
    }
  };

  const onGetImageCaptcha = useCallback(async () => {
    getFakeImageCaptcha({ deviceId: deviceId })
      .then((result: any) => {
        if (result && result.success)
          setImageUrl(`data:image/jpeg;base64,${result.imageCode}`);
      })
      .catch((error) => {
        toast.error(`获取验证码失败:${error}`);
      });
  }, []);

  useEffect(() => {
    const getImageCaptcha = () => {
      onGetImageCaptcha().then();
    };
    getImageCaptcha();
  }, []);

  return (
    <>
      <form
        className='space-y-6'
        onSubmit={handleSubmit}
      >
        <div>
          <label
            htmlFor='email'
            className='block text-sm font-semibold leading-6 text-gray-900 dark:text-white'
          >
            邮箱
          </label>
          <div className='mt-2'>
            <input
              id='email'
              name='username'
              type='text'
              autoComplete='username'
              required
              placeholder='john.xyz@example.com'
              onChange={(e) => setUsername(e.target.value)}
              className='block h-10 w-full rounded-md border-0 bg-wash px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-wash-dark dark:text-wash sm:text-sm sm:leading-6'
            />
          </div>
        </div>

        <div>
          <div className='flex items-center justify-between'>
            <label
              htmlFor='password'
              className='block text-sm font-semibold leading-6 text-gray-900 dark:text-white'
            >
              密码
            </label>
            <div className='text-sm'>
              <span
                onClick={() => toast.error('暂未支持，敬请期待')}
                className='cursor-pointer font-semibold text-indigo-600 hover:text-indigo-500'
              >
                Forgot password?
              </span>
            </div>
          </div>

          <PasswordInput
            id='password'
            divClassName='mt-2'
            inputClassName='block h-10 w-full rounded-md border-0 px-3 py-1.5 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-wash-dark dark:text-wash sm:text-sm sm:leading-6'
            onChange={(value) => setPassword(value)}
          />
        </div>

        <div>
          <div className='flex items-center justify-between'>
            <label
              htmlFor='captcha'
              className='block text-sm font-semibold leading-6 text-gray-900 dark:text-white'
            >
              验证码
            </label>
          </div>
          <div className='mt-2 flex'>
            <input
              id='captcha'
              name='captcha'
              type='text'
              autoComplete='captcha'
              required
              onChange={(e) => setCaptcha(e.target.value)}
              className='block h-10 w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-wash-dark dark:text-wash sm:text-sm sm:leading-6'
            />
            <div className='ml-2.5 h-10 rounded-md border border-gray-500'>
              <img
                onClick={onGetImageCaptcha}
                className='h-full rounded-md'
                src={imageUrl}
                alt='验证码'
              />
            </div>
          </div>
        </div>

        <div>
          <button
            type='submit'
            className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          >
            Sign in
          </button>
        </div>
      </form>
    </>
  );
};

export default FormLogin;
