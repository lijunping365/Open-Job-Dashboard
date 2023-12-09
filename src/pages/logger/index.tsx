import {
  Button,
  message,
  Divider,
  Form,
  Card,
  Input,
  Alert,
  Table,
} from 'antd';
import React, { useState, useRef } from 'react';
import {
  fetchTaskLogPage,
  killScheduleTask,
  removeTaskLog,
} from '@/services/api';
import { confirmModal } from '@/components/ConfirmModel';
import { ColumnsType } from 'antd/es/table';
import BaseLayout from '@/components/Layout';
import { TableParams } from '@/types/LoginTyping';
import { SearchOutlined } from '@ant-design/icons';

const FormItem = Form.Item;

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
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [tableData, setTableData] = useState([]);
  const actionRef = useRef();
  const [selectedRowsState, setSelectedRows] = useState<API.OpenJobLog[]>([]);
  const { query }: any = location;
  const [jobId] = useState<number>(query ? query.id : 0);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.OpenJobLog>();

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const fetchData = async () => {
    const name = form.getFieldValue('name');
    let order = 1;
    if (tableParams?.order) {
      order = tableParams?.order === 'descend' ? 1 : 0;
    }

    setLoading(true);
    try {
      const response = await fetchTaskLogPage({
        current: tableParams.pagination?.current,
        pageSize: tableParams.pagination?.pageSize,
        jobId,
      });

      setTableData(response.records);
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

  const columns: ColumnsType<API.OpenJobLog> = [
    {
      title: '编号',
      dataIndex: 'id',
    },
    {
      title: '任务编号',
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
    },
    {
      title: '开始时间',
      dataIndex: 'beginTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
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
            onClick={() => {
              setShowDetail(true);
              setCurrentRow(record);
            }}
          >
            查看日志
          </a>
          <Divider type='vertical' />
          <a
            onClick={async () => {
              const confirm = await confirmModal();
              if (confirm) {
                await handleKillTask(record.id);
                actionRef.current?.reloadAndRest?.();
              }
            }}
          >
            杀死
          </a>
          <Divider type='vertical' />
          <a
            onClick={async () => {
              const confirm = await confirmModal();
              if (confirm) {
                await handleRemove([record.id]);
                actionRef.current?.reloadAndRest?.();
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
      <Card
        bordered={false}
        className='mt-4'
      >
        <Form
          layout='inline'
          form={form}
          onValuesChange={() => fetchData()}
        >
          <div className='w-full p-2'>
            <div className='flex items-center justify-between'>
              <h2 className='text-2xl'>报警记录</h2>
              <div className='flex gap-4'>
                <FormItem name='name'>
                  <Input
                    placeholder='查询'
                    prefix={<SearchOutlined />}
                  />
                </FormItem>
                <Button
                  type='primary'
                  icon={<SearchOutlined />}
                  onClick={fetchData}
                >
                  查询
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </Card>

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
            <Button
              onClick={async () => {
                await handleRemove(selectedRowsState.map((e) => e.id));
                setSelectedRows([]);
                fetchData().then();
              }}
            >
              批量删除
            </Button>
          }
        />
      )}

      <Table
        loading={loading}
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={tableData}
        pagination={tableParams.pagination}
        //@ts-ignore
        onChange={onTableChange}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
    </BaseLayout>
  );
};

export default TableList;
