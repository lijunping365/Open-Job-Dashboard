import React, { useState } from 'react';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Divider,
  Dropdown,
  Form,
  MenuProps,
  message,
  Space,
} from 'antd';
import {
  addScheduleTask,
  fetchScheduleTaskPage,
  removeScheduleTask,
  runScheduleTask,
  startScheduleTask,
  stopScheduleTask,
  updateScheduleTask,
} from '@/services/api';
import { confirmModal } from '@/components/ConfirmModel';
import CreateForm from '../../components/Job/CreateForm';
import BaseLayout from '@/components/Layout';
import { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import ProTable from '@/components/ProTable';
import usePaginationRequest from '@/hooks/usePagination';
import SearchForm from '@/components/Job/SearchForm';
import PageParams = API.PageParams;

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
  try {
    await removeScheduleTask({ ids: selectedRows });
    hide();
    message.success('删除成功，即将刷新');
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
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
const updateStatus = async (jobId: number, status: number) => {
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

const JobTableList: React.FC = () => {
  const [form] = Form.useForm();
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});

  const request = async (params: PageParams) => {
    const values = await form.validateFields();
    return await fetchScheduleTaskPage({
      ...values,
      current: params.current,
      pageSize: params.pageSize,
    });
  };

  const [tableData, loading, tableParams, onTableChange, fetchData] =
    usePaginationRequest<API.OpenJob>((params) => request(params));

  const getItems = (record: any): MenuProps['items'] => {
    return [
      {
        key: '1',
        label: (
          <a
            onClick={() => {
              setUpdateModalVisible(true);
              setUpdateFormValues(record);
            }}
          >
            修改
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
                await handleRemove([record.id]);
                fetchData().then();
              }
            }}
          >
            删除
          </a>
        ),
      },
      {
        key: '3',
        label: (
          <Link
            href={{
              pathname: '/logger',
              search: `?id=${record.id}`,
              hash: '#the-hash',
            }}
          >
            查看日志
          </Link>
        ),
      },
      {
        key: '4',
        label: (
          <Link
            href={{
              pathname: '/job/monitor',
              search: `?appId=${record.appId}&jobId=${record.id}`,
              hash: '#the-hash',
            }}
          >
            任务监控
          </Link>
        ),
      },
    ];
  };

  const columns: ColumnsType<API.OpenJob> = [
    {
      title: '任务ID',
      dataIndex: 'id',
    },
    {
      title: '应用ID',
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
      title: '状态',
      dataIndex: 'status',
      render: (_, record) => (
        <Badge
          status={record.status === 1 ? 'success' : 'processing'}
          text={record.status === 1 ? '启动' : '停止'}
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '创建人ID',
      dataIndex: 'createUser',
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (_, record) => (
        <Space size='middle'>
          <a
            onClick={async () => {
              await updateStatus(record.id, record.status);
              fetchData().then();
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
          <Dropdown menu={{ items: getItems(record) }}>
            <a>
              更多 <DownOutlined />
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <BaseLayout>
      <Card bordered={false}>
        <div className='search-form-wrapper'>
          <SearchForm
            form={form}
            fetchData={fetchData}
          />
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            新建
          </Button>
        </div>

        <ProTable<API.OpenJob>
          columns={columns}
          tableData={tableData}
          loading={loading}
          tableParams={tableParams}
          onTableChange={onTableChange}
          onBatchDelete={(rows) => handleRemove(rows.map((e) => e.id))}
        />
      </Card>

      <CreateForm
        onSubmit={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            setCreateModalVisible(false);
            fetchData().then();
          }
        }}
        onCancel={() => setCreateModalVisible(false)}
        modalVisible={createModalVisible}
      />

      {updateFormValues && Object.keys(updateFormValues).length ? (
        <CreateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              setUpdateModalVisible(false);
              setUpdateFormValues({});
              fetchData().then();
            }
          }}
          onCancel={() => {
            setUpdateModalVisible(false);
            setUpdateFormValues({});
          }}
          modalVisible={updateModalVisible}
          values={updateFormValues}
        />
      ) : null}
    </BaseLayout>
  );
};

export default JobTableList;
