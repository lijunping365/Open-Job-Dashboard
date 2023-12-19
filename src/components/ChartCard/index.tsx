import { Chart, LineAdvance } from 'bizcharts';
import { Card } from 'antd';
import React from 'react';
import { AnalysisChart } from '@/types/typings';

interface ChartCardProps {
  loading: boolean;
  chartData: AnalysisChart[];
}

export const ChartCard = ({ loading, chartData }: ChartCardProps) => {
  return (
    <Card
      loading={loading}
      bordered={false}
      title='任务调度次数'
      style={{
        height: '100%',
        marginTop: '20px',
      }}
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
  );
};
