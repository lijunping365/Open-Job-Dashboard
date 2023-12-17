import { ColumnsType } from 'antd/lib/table';
import { Descriptions, DescriptionsProps } from 'antd';

interface Props<T> {
  columns: ColumnsType<T>;
  values: any;
}

const ProDescriptions = <T,>({ columns, values }: Props<T>) => {
  const items: DescriptionsProps['items'] = columns.map((column: any) => {
    return {
      key: column.key,
      label: column.title,
      children: values[column?.dataIndex],
    };
  });

  return (
    <Descriptions
      title='详情'
      column={1}
      items={items}
    />
  );
};

export default ProDescriptions;
