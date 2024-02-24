'use client';

import React, { useEffect, useState } from 'react';
import { Card, message } from 'antd';
import { catTaskLog } from '@/services/api';
import BaseLayout from '@/components/Layout';
import { useSearchParams } from 'next/navigation';

export default function RollingLog() {
  const searchParams = useSearchParams();
  const logId = searchParams.get('logId');
  const [logContent, setLogContent] = useState<string>('');
  const [fromLineNum, setFromLineNum] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const loadRollingLog = async (logId: string) => {
    setLoading(true);
    try {
      const res: any = await catTaskLog(logId, fromLineNum);
      if (!res || res.fromLineNum === res.toLineNum) {
        return;
      }
      setLogContent((prev) => {
        return prev + res.logContent;
      });
      setFromLineNum(res.toLineNum);
    } catch (error) {
      message.error('加载任务日志失败' + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (logId) {
      loadRollingLog(logId).then();
    }
  }, [logId, fromLineNum]);

  return (
    <BaseLayout>
      <Card bordered={false}>
        <section>
          <pre style={{ fontSize: '14px' }}>
            <div>{logContent}</div>
            <div>{loading}</div>
          </pre>
        </section>
      </Card>
    </BaseLayout>
  );
}
