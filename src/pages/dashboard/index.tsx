import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Select, Statistic } from 'antd';
import {
  fetchAnalysisNumber,
  fetchAnalysisChart,
  fetchOpenJobAppList,
} from '@/services/api';
import {
  AlertOutlined,
  BarChartOutlined,
  CloudServerOutlined,
  CoffeeOutlined,
  DashboardOutlined,
  FlagOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import BaseLayout from '@/components/Layout';
import { handlerChartData } from '@/lib/utils';
import { AnalysisChart, OpenJobApp, StatisticNumber } from '@/types/typings';

const TableList: React.FC = () => {
  const [appId, setAppId] = useState<number>();
  const [appSet, setAppSet] = useState<OpenJobApp[]>([]);
  const [statisticLoading, setStatisticLoading] = useState<boolean>(true);
  const [chartLoading, setChartLoading] = useState<boolean>(true);
  const [statisticNumber, setStatisticNumber] = useState<StatisticNumber>();
  const [chartData, setChartData] = useState<AnalysisChart[]>([]);

  useEffect(() => {
    const getAnalysisNumber = () => {
      fetchAnalysisNumber()
        .then((res) => {
          if (res) setStatisticNumber(res);
        })
        .catch()
        .finally(() => setStatisticLoading(false));
    };
    getAnalysisNumber();
  }, []);

  useEffect(() => {
    const getAppSet = () => {
      fetchOpenJobAppList()
        .then((res: any) => {
          if (res) {
            setAppSet(res);
            setAppId(res[0].id);
          }
        })
        .catch();
    };
    getAppSet();
  }, []);

  useEffect(() => {
    const getAnalysisChart = () => {
      if (!appId) {
        return;
      }
      fetchAnalysisChart({ appId })
        .then((res: any) => {
          if (res) {
            setChartData(handlerChartData(res));
          }
        })
        .catch()
        .finally(() => setChartLoading(false));
    };
    getAnalysisChart();
  }, [appId]);

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
              value={statisticNumber?.appNum}
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
        extra={
          <div>
            <Select
              style={{ width: '200px' }}
              defaultValue={appId}
              onChange={(id: any) => setAppId(id)}
              options={(appSet || []).map((d) => ({
                value: d.id,
                label: d.appName,
              }))}
            />
          </div>
        }
      ></Card>
    </BaseLayout>
  );
};

export default TableList;
