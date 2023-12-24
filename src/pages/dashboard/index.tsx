import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { fetchAnalysisNumber, fetchAnalysisChart } from '@/services/api';
import BaseLayout from '@/components/Layout';
import { handlerChartData } from '@/lib/utils';
import { AnalysisChart, StatisticNumber } from '@/types/typings';
import {
  AlertOutlined,
  CloudServerOutlined,
  CoffeeOutlined,
  FlagOutlined,
} from '@ant-design/icons';

const TableList: React.FC = () => {
  const [statisticLoading, setStatisticLoading] = useState<boolean>(true);
  const [chartLoading, setChartLoading] = useState<boolean>(true);
  const [statisticNumber, setStatisticNumber] = useState<StatisticNumber>();
  const [chartData, setChartData] = useState<AnalysisChart[]>([]);

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
      const res = await fetchAnalysisChart({});
      if (res) {
        setChartData(handlerChartData(res));
      }
    } finally {
      setChartLoading(false);
    }
  };

  useEffect(() => {
    getAnalysisNumber().then();
    getAnalysisChart().then();
  }, []);

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
        style={{
          marginTop: '20px',
        }}
      ></Card>
    </BaseLayout>
  );
};

export default TableList;
