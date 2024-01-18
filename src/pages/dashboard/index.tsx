import React, { useEffect, useRef, useState } from 'react';
import { Card, Col, Row, Select, Statistic } from 'antd';
import {
  fetchAnalysisNumber,
  fetchAnalysisChart,
  fetchByJobName,
} from '@/services/api';
import BaseLayout from '@/components/Layout';
import { AnalysisChart, StatisticNumber, TimeType } from '@/types/typings';
import {
  AlertOutlined,
  CloudServerOutlined,
  CoffeeOutlined,
  FlagOutlined,
} from '@ant-design/icons';
import DebounceSelect, {
  SelectOptionsProps,
} from '@/components/DebounceSelect';
import * as echarts from 'echarts';

const options = [
  { value: '7d', label: '最近7天' },
  { value: '30d', label: '最近30天' },
  { value: '90d', label: '最近90天' },
];

const TableList: React.FC = () => {
  const chartRefLine = useRef<any>(null);
  const chartLine = useRef<any>(null);
  const [statisticLoading, setStatisticLoading] = useState<boolean>(true);
  const [chartLoading, setChartLoading] = useState<boolean>(true);
  const [statisticNumber, setStatisticNumber] = useState<StatisticNumber>();
  const [selectedJobId, setSelectedJobId] = useState<any>();
  const [selectDate, setSelectDate] = useState<TimeType>('7d');
  const [data, setChartData] = useState<AnalysisChart>();

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
      const res: any = await fetchAnalysisChart({
        jobId: selectedJobId === 'all' ? '' : selectedJobId,
        period: selectDate,
      });
      if (res) setChartData(res);
    } finally {
      setChartLoading(false);
    }
  };

  const fetchJobList = async (name: string) => {
    const res = await fetchByJobName(name);
    const options: SelectOptionsProps[] = [];
    options.push({ label: '全部', value: 'all' });
    if (res) {
      res.forEach((item) => {
        options.push({ label: item.jobName, value: item.id });
      });
    }
    return options;
  };

  useEffect(() => {
    getAnalysisNumber().then();
  }, []);

  useEffect(() => {
    getAnalysisChart().then();
  }, [selectDate, selectedJobId]);

  useEffect(() => {
    if (!data || !chartRefLine.current) return;

    const myChartLine = echarts.init(chartRefLine.current);
    const optionLine = {
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        containLabel: true,
      },
      legend: {
        data: ['执行次数', '成功次数'],
      },
      xAxis: {
        type: 'category',
        data: data.labels,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '执行次数',
          data: data.totalCount,
          type: 'line',
          color: '#3080d0',
        },
        {
          name: '成功次数',
          data: data.successCount,
          type: 'line',
          color: '#ed64a6',
        },
      ],
    };
    myChartLine.setOption(optionLine);
    chartLine.current = myChartLine;

    const handleResizeListener = () => {
      console.log('eeeeeeeeeee', myChartLine);
      myChartLine.resize();
    };

    window.addEventListener('resize', handleResizeListener);

    return () => {
      window.removeEventListener('resize', handleResizeListener);
    };
  }, [data]);

  const triggerResizeEvent = () => {
    console.log('ssssssssssssss');
    if (!chartRefLine.current || !chartLine.current) {
      return;
    }
    const width = chartRefLine.current.offsetWidth;
    console.log('wwwwwwwwwwwwwwww', width);

    chartLine.current && chartLine.current.resize();
  };

  return (
    <BaseLayout onCollapse={triggerResizeEvent}>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              loading={statisticLoading}
              title='任务总数量'
              value={statisticNumber?.taskTotalNum || 0}
              prefix={<CoffeeOutlined />}
              suffix={`/ ${statisticNumber?.taskStartedNum}`}
              valueStyle={{ fontSize: '20px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              loading={statisticLoading}
              title='执行器总数量'
              value={statisticNumber?.executorTotalNum}
              prefix={<CloudServerOutlined />}
              suffix={`/ ${statisticNumber?.executorOnlineNum}`}
              valueStyle={{ fontSize: '20px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              loading={statisticLoading}
              title='今日调度总次数'
              value={statisticNumber?.taskExecuteTotalNum}
              prefix={<FlagOutlined />}
              suffix={`/ ${statisticNumber?.taskExecuteSuccessNum}`}
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
              prefix={<AlertOutlined />}
              valueStyle={{ fontSize: '20px' }}
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
          <div style={{ display: 'flex', flexDirection: 'row', gap: '15px' }}>
            <DebounceSelect
              defaultValue={[{ label: '全部', value: 'all' }]}
              placeholder='选择一个任务'
              fetchOptions={fetchJobList}
              style={{ minWidth: 200 }}
              onChange={(newValue) => setSelectedJobId(newValue)}
            />

            <Select
              options={options}
              defaultValue={selectDate}
              onChange={(value: any) => setSelectDate(value)}
            />
          </div>
        }
      >
        <div
          ref={chartRefLine}
          style={{ minHeight: '450px' }}
        ></div>
      </Card>
    </BaseLayout>
  );
};

export default TableList;
