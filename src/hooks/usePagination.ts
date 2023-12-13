import { useEffect, useState } from 'react';
import { message, TablePaginationConfig } from 'antd';
import { TableParams } from '@/types/LoginTyping';
import { PageQuery, PageResult } from '@/lib/request';

const usePaginationRequest = <T>(
  request: (params: PageQuery) => Promise<PageResult<T>>
): [
  T[],
  boolean,
  TableParams,
  (pagination: TablePaginationConfig) => void,
  () => Promise<void>,
] => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response: PageResult<T> = await request({
        current: tableParams.pagination?.current,
        pageSize: tableParams.pagination?.pageSize,
      });

      setData(response?.records);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: response.total,
        },
      });
    } catch (error) {
      message.error('服务繁忙，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const onTableChange = (pagination: TablePaginationConfig) => {
    setTableParams({
      pagination,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  useEffect(() => {
    fetchData().then();
  }, [JSON.stringify(tableParams)]);

  return [data, loading, tableParams, onTableChange, fetchData];
};

export default usePaginationRequest;
