import React, { useCallback, useEffect, useState } from 'react';
import { Card, Col, message, Row, Statistic } from 'antd';
import {
  fetchJobAnalysisNumber,
  fetchInstanceTok,
  fetchAnalysisChart,
  fetchJobTimeChart,
} from '@/services/api';
import { BarChartOutlined, DashboardOutlined } from '@ant-design/icons';
import { ChartCard } from '@/components/ChartCard';
import { TopCard } from '@/components/TopCard';
import { getTopCount, handlerChartData, handlerTokData } from '@/lib/utils';
import { TimeChartCard } from '@/components/TimeChartCard';
import Link from 'next/link';
import BaseLayout from '@/components/Layout';
import {
  AnalysisChart,
  JobTimeChart,
  StatisticNumber,
  TimeType,
} from '@/types/typings';

const TableList: React.FC = () => {
  const { query }: any = location;
  const [appId] = useState<number>(query ? query.appId : 1);
  const [jobId] = useState<number>(query ? query.jobId : 1);
  const [loading, setLoading] = useState<boolean>(true);
  const [statisticLoading, setStatisticLoading] = useState<boolean>(true);
  const [tokLoading, setTokLoading] = useState<boolean>(true);
  const [jobLoading, setJobLoading] = useState<boolean>(true);
  const [statisticNumber, setStatisticNumber] = useState<StatisticNumber>();
  const [instanceTok, setInstanceTok] = useState<any[]>([]);
  const [selectDate, setSelectDate] = useState<TimeType>('today');
  const [chartData, setChartData] = useState<AnalysisChart[]>([]);
  const [jobChartData, setJobChartData] = useState<JobTimeChart>();

  const onFetchInstanceTokData = useCallback(async () => {
    const count = getTopCount(selectDate);
    fetchInstanceTok({ appId, jobId, count })
      .then((res) => {
        if (res) setInstanceTok(handlerTokData(res));
      })
      .catch()
      .finally(() => setTokLoading(false));
  }, [appId, jobId, selectDate]);

  useEffect(() => {
    onFetchInstanceTokData().then();
  }, [appId, jobId, selectDate]);

  const onFetchJobChartData = useCallback(async () => {
    fetchJobTimeChart({ appId, jobId, period: 4 })
      .then((res) => {
        if (res) {
          res.value = Number(res.value);
          let charts = res.charts;
          if (charts) {
            charts.forEach((e: any) => {
              e.value = Number(e.value);
            });
          }
          setJobChartData(res);
        }
      })
      .catch()
      .finally(() => setJobLoading(false));
  }, [appId, jobId, selectDate]);

  useEffect(() => {
    onFetchJobChartData().then();
  }, [appId, jobId, selectDate]);

  useEffect(() => {
    const getAnalysisNumber = () => {
      fetchJobAnalysisNumber(appId, jobId)
        .then((res) => {
          if (res) setStatisticNumber(res);
        })
        .catch()
        .finally(() => setStatisticLoading(false));
    };
    getAnalysisNumber();
  }, [appId, jobId]);

  useEffect(() => {
    const getAnalysisChart = () => {
      fetchAnalysisChart({ appId, jobId })
        .then((res: any) => {
          if (res) {
            setChartData(handlerChartData(res));
          }
        })
        .catch((reason) => message.error(reason))
        .finally(() => setLoading(false));
    };
    getAnalysisChart();
  }, [appId, jobId]);

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
              title='上一次执行时间'
              value={statisticNumber?.lastRunTime || ''}
              prefix={<DashboardOutlined />}
              valueStyle={{ fontSize: '20px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              loading={statisticLoading}
              title='上一次执行耗时'
              value={statisticNumber?.taskTakeTime || ''}
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
            <Link
              href={{
                pathname: '/alarm',
                search: `?appId=${appId}&jobId=${jobId}`,
                hash: '#the-hash',
              }}
            >
              <Statistic
                loading={statisticLoading}
                title='今日报警次数'
                value={statisticNumber?.alarmNum}
                prefix={<BarChartOutlined />}
              />
            </Link>
          </Card>
        </Col>
      </Row>

      <ChartCard
        loading={loading}
        chartData={chartData}
      />

      <TimeChartCard
        loading={jobLoading}
        chartData={jobChartData}
        selectDate={selectDate}
        onChange={(value) => setSelectDate(value)}
      />

      <TopCard
        title={'节点执行任务次数排行榜TOP10'}
        data={instanceTok}
        loading={tokLoading}
        selectDate={selectDate}
        onChange={(value) => setSelectDate(value)}
      />
    </BaseLayout>
  );
};

export default TableList;
