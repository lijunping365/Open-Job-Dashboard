import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  Table,
} from 'antd';
import React, { useRef, useState } from 'react';
import UpdateForm from './components/UpdateForm';
import {
  addScheduleTask,
  fetchInstancePage,
  fetchOpenJobAppList,
  fetchScheduleTaskPage,
  removeScheduleTask,
  runScheduleTask,
  startScheduleTask,
  stopScheduleTask,
  updateScheduleTask,
} from '@/services/api';
import { confirmModal } from '@/components/ConfirmModel';
import CreateForm from './components/CreateForm';
import BaseLayout from '@/components/Layout';
import { TableParams } from '@/types/LoginTyping';
import { ColumnsType } from 'antd/es/table';
import Link from 'next/link';

const FormItem = Form.Item;
/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: Partial<API.OpenJob>) => {
  const hide = message.loading('正在添加');
  try {
    await addScheduleTask(fields);
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: Partial<API.OpenJob>) => {
  const hide = message.loading('正在配置');
  try {
    await updateScheduleTask(fields);
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 * 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: any[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeScheduleTask({ ids: selectedRows });
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
 * 启动任务
 *
 * @param jobId
 */
const handleStart = async (jobId: number) => {
  const hide = message.loading('正在启动');
  if (!jobId) return true;
  try {
    await startScheduleTask(jobId);
    hide();
    message.success('启动成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('启动失败，请重试');
    return false;
  }
};

/**
 * 运行任务
 *
 * @param jobId
 */
const handleRun = async (jobId: number) => {
  const hide = message.loading('正在运行');
  if (!jobId) return true;
  try {
    await runScheduleTask(jobId);
    hide();
    message.success('运行完成，请查看');
    return true;
  } catch (error) {
    hide();
    message.error('运行失败，请重试');
    return false;
  }
};

/**
 * 停止任务
 *
 * @param jobId
 */
const handleStop = async (jobId: number) => {
  const hide = message.loading('正在停止');
  if (!jobId) return true;
  try {
    await stopScheduleTask(jobId);
    hide();
    message.success('停止成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('停止失败，请重试');
    return false;
  }
};

const TableList: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [tableData, setTableData] = useState([]);
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleCreateModalVisible] =
    useState<boolean>(false);
  /** 更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const [selectedRowsState, setSelectedRows] = useState<API.OpenJob[]>([]);
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
      const response = await fetchScheduleTaskPage({
        current: tableParams.pagination?.current,
        pageSize: tableParams.pagination?.pageSize,
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

  const searchApp = async () => {
    const res = await fetchOpenJobAppList();
    if (res) {
      return res.map((item: any) => {
        return { label: item.appName, value: item.id };
      });
    }
  };

  const columns: ColumnsType<API.OpenJob> = [
    {
      title: '任务编号',
      dataIndex: 'id',
    },
    {
      title: '应用名称',
      dataIndex: 'appId',
    },
    {
      title: '任务名称',
      dataIndex: 'jobName',
    },
    {
      title: 'Cron 表达式',
      dataIndex: 'cronExpression',
    },
    {
      title: 'Handler 名称',
      dataIndex: 'handlerName',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (_, record) => (
        <span>{record.status === 1 ? '启动' : '停止'}</span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={async () => {
              if (record.status === 0) {
                await handleStart(record.id);
              } else {
                await handleStop(record.id);
              }
              actionRef.current?.reloadAndRest?.();
            }}
          >
            {record.status === 0 ? '启动' : '停止'}
          </a>
          <Divider type='vertical' />
          <a
            onClick={async () => {
              await handleRun(record.id);
            }}
          >
            运行
          </a>
          <Divider type='vertical' />
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setUpdateFormValues(record);
            }}
          >
            修改
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
          <Divider type='vertical' />
          <Link
            href={{
              pathname: '/logger',
              search: `?id=${record.id}`,
              hash: '#the-hash',
            }}
          >
            查看日志
          </Link>
          <Divider type='vertical' />
          <Link
            href={{
              pathname: '/job/monitor',
              search: `?appId=${record.appId}&jobId=${record.id}`,
              hash: '#the-hash',
            }}
          >
            任务监控
          </Link>
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
      <CreateForm
        onSubmit={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            handleCreateModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleCreateModalVisible(false)}
        modalVisible={createModalVisible}
      ></CreateForm>

      {updateFormValues && Object.keys(updateFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              setUpdateFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setUpdateFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={updateFormValues}
        />
      ) : null}
    </BaseLayout>
  );
};

export default TableList;