import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Select, Statistic } from 'antd';
import { fetchAnalysisNumber, fetchAnalysisChart } from '@/services/api';
import BaseLayout from '@/components/Layout';
import { AnalysisChart, StatisticNumber, TimeType } from '@/types/typings';
import {
  AlertOutlined,
  CloudServerOutlined,
  CoffeeOutlined,
  FlagOutlined,
} from '@ant-design/icons';
import Chart, {
  BubbleDataPoint,
  ChartTypeRegistry,
  Point,
} from 'chart.js/auto';
import { useConfigContext } from '@/components/Provider/GlobalConfigContext';

const options = [
  { value: '7d', label: '最近7天' },
  { value: '30d', label: '最近30天' },
  { value: '90d', label: '最近90天' },
];

const TableList: React.FC = () => {
  const { theme } = useConfigContext();
  const [statisticLoading, setStatisticLoading] = useState<boolean>(true);
  const [chartLoading, setChartLoading] = useState<boolean>(true);
  const [statisticNumber, setStatisticNumber] = useState<StatisticNumber>();
  const [selectDate, setSelectDate] = useState<TimeType>('7d');
  const [data, setChartData] = useState<AnalysisChart>();
  const color = theme === 'light' ? '#000' : '#fff';
  const getAnalysisNumber = async () => {
    try {
      const res: any = await fetchAnalysisNumber();
      if (res) setStatisticNumber(res);
    } finally {
      setStatisticLoading(false);
    }
  };

  const getAnalysisChart = async () => {
    try {
      const res: any = await fetchAnalysisChart({ period: selectDate });
      if (res) setChartData(res);
    } finally {
      setChartLoading(false);
    }
  };

  useEffect(() => {
    getAnalysisNumber().then();
    getAnalysisChart().then();
  }, []);

  useEffect(() => {
    getAnalysisChart().then();
  }, [selectDate]);

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
              label: '执行总次数',
              borderColor: '#3080d0',
              data: data.totalCount,
              backgroundColor: '#9abde0',
              pointRadius: 5,
              fill: false,
            },
            {
              label: '成功总次数',
              borderColor: '#ed64a6',
              data: data.successCount,
              backgroundColor: '#de98ba',
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
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              loading={statisticLoading}
              title='任务数量'
              value={statisticNumber?.taskTotalNum || 0}
              prefix={<CoffeeOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              loading={statisticLoading}
              title='调度次数'
              value={statisticNumber?.taskExecuteTotalNum}
              prefix={<FlagOutlined />}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              loading={statisticLoading}
              title='执行器数量'
              value={statisticNumber?.executorTotalNum}
              prefix={<CloudServerOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              loading={statisticLoading}
              title='今日报警次数'
              value={statisticNumber?.alarmNum}
              prefix={<AlertOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card
        loading={chartLoading}
        bordered={false}
        title='任务调度报表'
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
};

export default TableList;
