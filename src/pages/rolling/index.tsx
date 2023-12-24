import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { InferGetServerSidePropsType } from 'next';
import { catTaskLog } from '@/services/api';

export default function RollingLog({
  logId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [logContent, setLogContent] = useState<string>('');
  const [fromLineNum, setFromLineNum] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const loadRollingLog = async () => {
    setLoading(true);
    try {
      const res: any = await catTaskLog(logId, fromLineNum);
      if (res && res.fromLineNum !== res.toLineNum) {
        setLogContent((prev) => {
          return prev + res.logContent;
        });
        setFromLineNum(res.toLineNum);
      }
    } catch (error) {
      message.error('加载任务日志失败' + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRollingLog().then();
  }, [fromLineNum]);

  return (
    <div>
      <section className='content'>
        <pre style={{ fontSize: '14px' }}>
          <div>{logContent}</div>
          <div>{loading}</div>
        </pre>
      </section>
    </div>
  );
}

export const getServerSideProps = (context: any) => {
  const logId = context.query?.logId as string;

  if (!logId) {
    return { redirect: { destination: '/404', permanent: false } };
  }

  return {
    props: {
      logId: logId,
    },
  };
};
