import React, { useEffect, useState } from 'react';
import { Card, Select } from 'antd';
import { fetchJobTimeChart } from '@/services/api';
import BaseLayout from '@/components/Layout';
import { ChartTimeType, JobTimeChart } from '@/types/typings';
import { InferGetServerSidePropsType } from 'next';
import Chart, {
  BubbleDataPoint,
  ChartTypeRegistry,
  Point,
} from 'chart.js/auto';

const options = [
  { value: 30, label: '最近30次运行' },
  { value: 60, label: '最近60次运行' },
  { value: 180, label: '最近180次运行' },
];

export default function MonitorPage({
  jobId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectDate, setSelectDate] = useState<ChartTimeType>(30);
  const [data, setChartData] = useState<JobTimeChart>();

  const onFetchJobChartData = async () => {
    try {
      const res: any = await fetchJobTimeChart({ jobId, count: selectDate });
      if (res) setChartData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onFetchJobChartData().then();
  }, [jobId, selectDate]);

  const footer = (tooltipItems: any) => {
    let index = 0;
    tooltipItems.forEach(function (tooltipItem: any) {
      index = tooltipItem.parsed.x;
    });
    return '执行状态: ' + (data?.status[index] === 1 ? '成功' : '失败');
  };

  useEffect(() => {
    let chart: Chart<
      keyof ChartTypeRegistry,
      (number | Point | [number, number] | BubbleDataPoint | null)[],
      unknown
    >;

    if (data) {
      const colors: string[] = data.status.map((e) =>
        e === 1 ? '#279747' : '#ed64a6'
      );
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
              fill: true,
              tension: 0.4,
              pointBackgroundColor: colors,
            },
          ],
        },
        options: {
          animation: false,
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                footer: footer,
              },
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
