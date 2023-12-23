import { message, Divider, Card, Form, Drawer } from 'antd';
import React, { useState } from 'react';
import { fetchAlarmRecordPage, removeAlarmRecord } from '@/services/api';
import { confirmModal } from '@/components/ConfirmModel';
import { ColumnsType } from 'antd/es/table';
import BaseLayout from '@/components/Layout';
import usePaginationRequest from '@/hooks/usePagination';
import ProTable from '@/components/ProTable';
import SearchForm from '@/components/Logger/SearchForm';
import ProDescriptions from '@/components/ProDescriptions';
import { OpenJobAlarm, PageParams } from '@/types/typings';
import { processTime } from '@/lib/utils';

const AlarmTable = () => {
  const [form] = Form.useForm();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<OpenJobAlarm>();

  const request = async (params: PageParams) => {
    const values = form.getFieldsValue();
    const searchForm: any = {};
    if (values.jobId) {
      searchForm.jobId = values.jobId;
    }
    processTime(searchForm, values);
    return await fetchAlarmRecordPage({
      ...searchForm,
      current: params.current,
      pageSize: params.pageSize,
    });
  };

  const handleRemove = async (selectedRows: any[]) => {
    const hide = message.loading('正在删除');
    try {
      await removeAlarmRecord({ ids: selectedRows });
      hide();
      message.success('删除成功，即将刷新');
      fetchData().then();
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
    }
  };

  const [tableData, loading, tableParams, onTableChange, fetchData] =
    usePaginationRequest<OpenJobAlarm>((params) => request(params));

  const columns: ColumnsType<OpenJobAlarm> = [
    {
      title: '报警ID',
      dataIndex: 'id',
    },
    {
      title: '应用ID',
      dataIndex: 'appId',
    },
    {
      title: '任务ID',
      dataIndex: 'jobId',
    },
    {
      title: '执行节点',
      dataIndex: 'serverId',
    },
    {
      title: '报警消息',
      dataIndex: 'message',
      ellipsis: true,
    },
    {
      title: '报警时间',
      dataIndex: 'createTime',
    },
    {
      title: '报警接收人',
      dataIndex: 'receiver',
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              setShowDetail(true);
              setCurrentRow(record);
            }}
          >
            查看详情
          </a>
          <Divider type='vertical' />
          <a
            onClick={async () => {
              const confirm = await confirmModal();
              if (confirm) {
                await handleRemove([record.id]);
              }
            }}
          >
            删除
          </a>
        </>
      ),
    },
  ];

  return (
    <BaseLayout>
      <Card bordered={false}>
        <SearchForm
          form={form}
          fetchData={fetchData}
        />

        <ProTable<OpenJobAlarm>
          columns={columns}
          tableData={tableData}
          loading={loading}
          tableParams={tableParams}
          onTableChange={onTableChange}
          onBatchDelete={(rows) => handleRemove(rows)}
        />
      </Card>
      <Drawer
        width={400}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.id && (
          <ProDescriptions<OpenJobAlarm>
            columns={columns}
            values={currentRow}
          />
        )}
      </Drawer>
    </BaseLayout>
  );
};

export default AlarmTable;
