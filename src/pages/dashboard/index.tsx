import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Select, Statistic } from 'antd';
import { Chart, LineAdvance } from 'bizcharts';
import {
  fetchAnalysisNumber,
  fetchAnalysisChart,
  fetchOpenJobAppList,
} from '@/services/api';
import { BarChartOutlined, DashboardOutlined } from '@ant-design/icons';
import Link from 'next/link';
import BaseLayout from '@/components/Layout';
import { handlerChartData } from '@/lib/utils';

const TableList: React.FC = () => {
  const [appId, setAppId] = useState<number>();
  const [appSet, setAppSet] = useState<API.OpenJobApp[]>([]);
  const [statisticLoading, setStatisticLoading] = useState<boolean>(true);
  const [chartLoading, setChartLoading] = useState<boolean>(true);
  const [statisticNumber, setStatisticNumber] = useState<API.StatisticNumber>();
  const [chartData, setChartData] = useState<API.AnalysisChart[]>([]);

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
      <Row
        gutter={16}
        style={{ marginTop: '20px' }}
      >
        <Col span={6}>
          <Card>
            <Statistic
              loading={statisticLoading}
              title='应用数量'
              value={statisticNumber?.appNum}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              loading={statisticLoading}
              title='任务总数'
              value={statisticNumber?.taskRunningNum}
              prefix={<DashboardOutlined />}
              suffix={`/ ${statisticNumber?.taskTotalNum}`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              loading={statisticLoading}
              title='执行器总数'
              value={statisticNumber?.executorOnlineNum}
              prefix={<BarChartOutlined />}
              suffix={`/ ${statisticNumber?.executorTotalNum}`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Link
              href={{
                pathname: '/alarm',
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

      <Card
        loading={chartLoading}
        bordered={false}
        title='任务调度次数'
        style={{
          height: '100%',
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
      >
        <Chart
          padding={[10, 20, 50, 40]}
          autoFit
          height={400}
          data={chartData}
        >
          <LineAdvance
            shape='smooth'
            point
            area
            position='date*value'
            color='name'
          />
        </Chart>
      </Card>
    </BaseLayout>
  );
};

export default TableList;
