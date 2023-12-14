import usePaginationRequest from '@/hooks/usePagination';
import { Alert, Button, Table } from 'antd';
import React, { useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { PageQuery, PageResult } from '@/lib/request';

interface Props<T> {
  columns: ColumnsType<T>;
  request: (params: PageQuery) => Promise<PageResult<T>>;
  onBatchDelete: (rows: T[]) => Promise<void>;
}
const ProTable = <T,>({ columns, request, onBatchDelete }: Props<T>) => {
  const [selectedRowsState, setSelectedRows] = useState<T[]>([]);

  const handlerBatchDelete = async () => {
    if (!selectedRowsState) return;
    await onBatchDelete(selectedRowsState);
    setSelectedRows([]);
    fetchData().then();
  };

  return (
    <>
      {selectedRowsState?.length > 0 && (
        <Alert
          type='info'
          showIcon
          message={
            <div>
              已选择{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              项&nbsp;&nbsp;
            </div>
          }
          action={
            <Button onClick={() => handlerBatchDelete()}>批量删除</Button>
          }
        />
      )}
      <Table
        loading={loading}
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={tableData}
        pagination={tableParams.pagination}
        onChange={(pagination) => onTableChange(pagination)}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
    </>
  );
};

export default ProTable;
