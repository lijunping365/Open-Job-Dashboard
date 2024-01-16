import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Select, Statistic } from 'antd';
import { fetchJobAnalysisNumber, fetchJobTimeChart } from '@/services/api';
import {
  BarChartOutlined,
  DashboardOutlined,
  FlagOutlined,
} from '@ant-design/icons';
import BaseLayout from '@/components/Layout';
import { JobTimeChart, StatisticNumber, TimeType } from '@/types/typings';
import { InferGetServerSidePropsType } from 'next';
import { useConfigContext } from '@/components/Provider/GlobalConfigContext';
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
  const { theme } = useConfigContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [statisticLoading, setStatisticLoading] = useState<boolean>(true);
  const [statisticNumber, setStatisticNumber] = useState<StatisticNumber>();
  const [selectDate, setSelectDate] = useState<TimeType>('1m');
  const [data, setChartData] = useState<JobTimeChart>();
  const color = theme === 'light' ? '#000' : '#fff';
  const getJobAnalysisNumber = async () => {
    try {
      const res: any = await fetchJobAnalysisNumber(jobId);
      if (res) setStatisticNumber(res);
    } finally {
      setStatisticLoading(false);
    }
  };

  const onFetchJobChartData = async () => {
    try {
      const res: any = await fetchJobTimeChart({ jobId, period: selectDate });
      if (res) setChartData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getJobAnalysisNumber().then();
    onFetchJobChartData().then();
  }, [jobId]);

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
      <Row
        gutter={16}
        style={{ marginTop: '20px' }}
      >
        <Col span={6}>
          <Card>
            <Statistic
              loading={statisticLoading}
              title='下次执行时间'
              value={statisticNumber?.taskNextExecuteTime || ''}
              prefix={<DashboardOutlined />}
              valueStyle={{ fontSize: '20px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              loading={statisticLoading}
              title='调度次数'
              value={statisticNumber?.taskExecuteTotalNum || ''}
              prefix={<FlagOutlined />}
              valueStyle={{ fontSize: '20px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              loading={statisticLoading}
              title='任务状态'
              value={
                statisticNumber?.status === '1' ? '运行中' : '已停止' || ''
              }
              prefix={<BarChartOutlined />}
              valueStyle={{ fontSize: '20px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              loading={statisticLoading}
              title='今日报警次数'
              value={statisticNumber?.alarmNum}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card
        loading={loading}
        bordered={false}
        title='任务耗时统计'
        style={{ marginTop: '20px' }}
        extra={
          <Select
            defaultValue='1m'
            options={options}
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
