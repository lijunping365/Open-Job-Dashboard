import {
  message,
  Divider,
  Form,
  Card,
  Drawer,
  MenuProps,
  Dropdown,
  Space,
} from 'antd';
import React, { useState } from 'react';
import {
  fetchTaskLogPage,
  killScheduleTask,
  removeTaskLog,
} from '@/services/api';
import { confirmModal } from '@/components/ConfirmModel';
import { ColumnsType } from 'antd/es/table';
import BaseLayout from '@/components/Layout';
import PageParams = API.PageParams;
import usePaginationRequest from '@/hooks/usePagination';
import SearchForm from '@/components/Logger/SearchForm';
import ProTable from '@/components/ProTable';
import ProDescriptions from '@/components/ProDescriptions';
import Link from 'next/link';
import { DownOutlined } from '@ant-design/icons';

/**
 * 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: any[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeTaskLog({ ids: selectedRows });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

/**
 * 杀死任务
 *
 * @param logId
 */
const handleKillTask = async (logId: number) => {
  const hide = message.loading('正在杀死任务');
  if (!logId) return true;
  try {
    const res = await killScheduleTask(logId);
    console.log('ddddddddddddd', res);
    hide();
    message.success('杀死成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('杀死失败，请重试');
    return false;
  }
};

const TableList: React.FC = () => {
  const jobId = 1;
  const [form] = Form.useForm();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.OpenJobLog>();

  const request = async (params: PageParams) => {
    const values = await form.validateFields();
    return await fetchTaskLogPage({
      ...values,
      jobId,
      current: params.current,
      pageSize: params.pageSize,
    });
  };

  const [tableData, loading, tableParams, onTableChange, fetchData] =
    usePaginationRequest<API.OpenJobLog>((params) => request(params));

  const getItems = (record: any): MenuProps['items'] => {
    return [
      {
        key: '1',
        label: (
          <a
            onClick={() => {
              setShowDetail(true);
              setCurrentRow(record);
            }}
          >
            实时日志
          </a>
        ),
      },
      {
        key: '2',
        label: (
          <a
            onClick={async () => {
              const confirm = await confirmModal();
              if (confirm) {
                await handleKillTask(record.id);
                fetchData().then();
              }
            }}
          >
            杀死任务
          </a>
        ),
      },
      {
        key: '3',
        label: (
          <a
            onClick={async () => {
              const confirm = await confirmModal();
              if (confirm) {
                await handleRemove([record.id]);
                fetchData().then();
              }
            }}
          >
            删除任务
          </a>
        ),
      },
    ];
  };

  const columns: ColumnsType<API.OpenJobLog> = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '任务ID',
      dataIndex: 'jobId',
    },
    {
      title: '调度节点',
      dataIndex: 'serverId',
    },
    {
      title: '调度结果',
      dataIndex: 'status',
      render: (_, record) => (
        <span>{record.status === 1 ? '执行成功' : '执行失败'}</span>
      ),
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
    },
    {
      title: '结束时间',
      dataIndex: 'finishTime',
    },
    {
      title: '执行时长',
      dataIndex: 'takeTime',
    },
    {
      title: '异常信息',
      dataIndex: 'cause',
      ellipsis: true,
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
            详情
          </a>
          <Divider type='vertical' />
          <Dropdown menu={{ items: getItems(record) }}>
            <a>
              更多 <DownOutlined />
            </a>
          </Dropdown>
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

        <ProTable<API.OpenJobLog>
          columns={columns}
          tableData={tableData}
          loading={loading}
          tableParams={tableParams}
          onTableChange={onTableChange}
          onBatchDelete={(rows) => handleRemove(rows.map((e) => e.id))}
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
          <ProDescriptions<API.OpenJobLog>
            columns={columns}
            values={currentRow}
          />
        )}
      </Drawer>
    </BaseLayout>
  );
};

export default TableList;
