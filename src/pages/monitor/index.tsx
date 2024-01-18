import React, { useEffect, useState } from 'react';
import { Card, Select } from 'antd';
import { fetchJobTimeChart } from '@/services/api';
import BaseLayout from '@/components/Layout';
import { JobTimeChart, TimeType } from '@/types/typings';
import { InferGetServerSidePropsType } from 'next';
import Chart, {
  BubbleDataPoint,
  ChartTypeRegistry,
  Point,
} from 'chart.js/auto';

const options = [
  { value: '1m', label: '最近一分钟' },
  { value: '30m', label: '最近30分钟' },
  { value: '1h', label: '最近1小时' },
  { value: '24h', label: '最近24小时' },
  { value: '30d', label: '最近30天' },
  { value: '90d', label: '最近90天' },
];

export default function MonitorPage({
  jobId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectDate, setSelectDate] = useState<TimeType>('1m');
  const [data, setChartData] = useState<JobTimeChart>();

  const onFetchJobChartData = async () => {
    try {
      const res: any = await fetchJobTimeChart({ jobId, period: selectDate });
      if (res) setChartData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onFetchJobChartData().then();
  }, [jobId, selectDate]);

  React.useEffect(() => {
    let chart: Chart<
      keyof ChartTypeRegistry,
      (number | Point | [number, number] | BubbleDataPoint | null)[],
      unknown
    >;

    if (data) {
      let config: any = {
        type: 'line',
        data: {
          labels: data.labels,
          datasets: [
            {
              label: '执行耗时(s)',
              borderColor: '#3080d0',
              data: data.takeTime,
              backgroundColor: '#9abde0',
              pointRadius: 5,
              fill: false,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
        },
      };
      let ctx = document.getElementById('line-chart') as HTMLCanvasElement;
      chart = new Chart(ctx, config);
    }
    return () => {
      chart && chart.destroy();
    };
  }, [data]);

  return (
    <BaseLayout>
      <Card
        loading={loading}
        bordered={false}
        title='任务耗时统计'
        extra={
          <Select
            options={options}
            defaultValue={selectDate}
            onChange={(value: any) => setSelectDate(value)}
          />
        }
      >
        <div style={{ minHeight: '550px' }}>
          <canvas id='line-chart'></canvas>
        </div>
      </Card>
    </BaseLayout>
  );
}

export const getServerSideProps = (context: any) => {
  const jobId = context.query?.jobId as string;

  if (!jobId) {
    return { redirect: { destination: '/404', permanent: false } };
  }

  return {
    props: {
      jobId: jobId,
    },
  };
};
