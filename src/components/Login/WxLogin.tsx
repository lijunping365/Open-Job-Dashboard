import Image from 'next/image';
import { getWxLoginCode, scanLoginCode } from '@/services/login';
import { setAccessToken } from '@/lib/cache';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { currentUser } from '@/services/login';
import { useAuthContext } from '@/components/Provider/AuthContext';
import { toast } from 'react-toastify';

const WxLogin = () => {
  const { setUser } = useAuthContext();
  const router = useRouter();
  const [code, setCode] = useState('');
  const [expired, setExpired] = useState(false);

  const fetchCode = useCallback(async () => {
    try {
      const result: any = await getWxLoginCode();
      setExpired(false);
      setCode(result.code);
    } catch (error) {
      setExpired(true);
      toast.error(`获取验证码失败:${error}`);
    }
  }, []);

  const loginSuccess = async (id: any, accessToken: string) => {
    try {
      setAccessToken(accessToken);
      const user = await currentUser();
      if (user) {
        setUser(user);
        await router.replace('/');
      }
      setExpired(true);
      return window.clearInterval(id);
    } catch (error) {
      toast.error(`登录失败:${error}`);
    }
  };

  useEffect(() => {
    fetchCode().then();
  }, []);

  useEffect(() => {
    if (!expired) {
      const id = window.setInterval(async () => {
        try {
          const res: any = await scanLoginCode(code);
          if (res) {
            loginSuccess(id, res.accessToken).then();
          }
        } catch (error) {
          return window.clearInterval(id);
        }
      }, 2000);
      return () => window.clearInterval(id);
    }
  }, [code, expired]);

  useEffect(() => {
    if (!expired) {
      const id = window.setTimeout(() => {
        setExpired(true);
      }, 1000 * 65);
      return () => window.clearTimeout(id);
    }
  }, [expired]);

  return (
    <>
      <div className='flex flex-col items-center justify-center'>
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_PATH}/common/qrcode.png`}
          alt='OpenByteCode'
          width={280}
          height={280}
        />

        <div className='mt-4 text-center'>
          {expired ? (
            <span>
              验证码已失效，&nbsp;
              <RefreshCode fetchCode={fetchCode} />
            </span>
          ) : (
            <span>
              微信扫一扫，关注 OpenByteCode 公众号
              <div>
                输入验证码 &nbsp;
                <Code code={code} />
                &nbsp; 登录
              </div>
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default WxLogin;

const Code = (props: { code: string }) => {
  return <span className='text-sky-500 dark:text-sky-400'>{props.code}</span>;
};

const RefreshCode = (props: { fetchCode: () => void }) => {
  return (
    <span
      className='cursor-pointer text-link dark:text-link-dark '
      onClick={() => props.fetchCode()}
    >
      点击刷新
    </span>
  );
};
