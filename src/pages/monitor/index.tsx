import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { fetchJobAnalysisNumber, fetchJobTimeChart } from '@/services/api';
import { BarChartOutlined, DashboardOutlined } from '@ant-design/icons';
import { TimeChartCard } from '@/components/TimeChartCard';
import BaseLayout from '@/components/Layout';
import { AnalysisChart, StatisticNumber, TimeType } from '@/types/typings';
import { InferGetServerSidePropsType } from 'next';
import Chart, {
  BubbleDataPoint,
  ChartTypeRegistry,
  Point,
} from 'chart.js/auto';

export default function MonitorPage({
  jobId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [loading, setLoading] = useState<boolean>(true);
  const [statisticLoading, setStatisticLoading] = useState<boolean>(true);
  const [statisticNumber, setStatisticNumber] = useState<StatisticNumber>();
  const [selectDate, setSelectDate] = useState<TimeType>('today');
  const [data, setChartData] = useState<AnalysisChart[]>([]);

  const getJobAnalysisNumber = async () => {
    try {
      const res: any = await fetchJobAnalysisNumber(jobId);
      if (res) setStatisticNumber(res);
    } finally {
      setStatisticLoading(false);
    }
  };

  useEffect(() => {
    getJobAnalysisNumber().then();
  }, [jobId]);

  const onFetchJobChartData = async () => {
    try {
      const res = await fetchJobTimeChart({ jobId, period: 4 });
      if (res) {
        res.value = Number(res.value);
        let charts = res.charts;
        if (charts) {
          charts.forEach((e: any) => {
            e.value = Number(e.value);
          });
        }
        setChartData(res);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onFetchJobChartData().then();
  }, [jobId]);

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
              label: '执行耗时',
              backgroundColor: '#4c51bf',
              borderColor: '#4c51bf',
              data: data.visitorData,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: '任务执行耗时统计',
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
              prefix={<BarChartOutlined />}
              suffix={'ms'}
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

      <Card>
        <Card
          loading={loading}
          bordered={false}
          title='任务耗时统计'
          style={{
            height: '100%',
            marginTop: '20px',
            marginBottom: '20px',
          }}
          extra={
            <div className={styles.salesExtraWrap}>
              <div className={styles.salesExtra}>
                <a
                  style={{ color: selectDate === 'today' ? '' : '' }}
                  onClick={() => setSelectDate('today')}
                >
                  最近一分钟
                </a>
                <a
                  className={selectDate === 'week' ? styles.currentDate : ''}
                  onClick={() => setSelectDate('week')}
                >
                  最近30分钟
                </a>
                <a
                  className={selectDate === 'month' ? styles.currentDate : ''}
                  onClick={() => setSelectDate('month')}
                >
                  最近1小时
                </a>
                <a
                  className={selectDate === 'year' ? styles.currentDate : ''}
                  onClick={() => setSelectDate('year')}
                >
                  今天
                </a>
              </div>
            </div>
          }
        >
          {/* Chart */}
          <div className='h-350-px relative'>
            <canvas id='line-chart'></canvas>
          </div>
        </Card>
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
