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
  updateScheduleTask,
  startScheduleTask,
  stopScheduleTask,
} from '@/services/api';
import { confirmModal } from '@/components/ConfirmModel';
import CreateForm from '../../components/Job/CreateForm';
import BaseLayout from '@/components/Layout';
import { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import ProTable from '@/components/ProTable';
import usePaginationRequest from '@/hooks/usePagination';
import SearchForm from '@/components/Job/SearchForm';
import { OpenJob, PageParams } from '@/types/typings';

const JobTableList: React.FC = () => {
  const [form] = Form.useForm();
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});

  const request = async (params: PageParams) => {
    const values = form.getFieldsValue();
    return await fetchScheduleTaskPage({
      ...values,
      current: params.current,
      pageSize: params.pageSize,
    });
  };

  const [tableData, loading, tableParams, onTableChange, fetchData] =
    usePaginationRequest<OpenJob>((params) => request(params));

  const handleAdd = async (fields: Partial<OpenJob>) => {
    const hide = message.loading('正在添加');
    try {
      await addScheduleTask(fields);
      hide();
      message.success('添加成功');
      setCreateModalVisible(false);
      fetchData().then();
    } catch (error) {
      hide();
      message.error('添加失败请重试！');
    }
  };

  const handleUpdate = async (fields: Partial<OpenJob>) => {
    const hide = message.loading('正在修改');
    try {
      await updateScheduleTask(fields);
      hide();
      message.success('修改成功');
      setUpdateModalVisible(false);
      setUpdateFormValues({});
      fetchData().then();
    } catch (error) {
      hide();
      message.error('修改失败请重试！');
    }
  };

  const handleRemove = async (selectedRows: any[]) => {
    const hide = message.loading('正在删除');
    try {
      await removeScheduleTask({ ids: selectedRows });
      hide();
      message.success('删除成功，即将刷新');
      fetchData().then();
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
    }
  };

  const handleRun = async (jobId: number) => {
    const hide = message.loading('正在运行');
    try {
      await runScheduleTask(jobId);
      hide();
      message.success('运行成功');
    } catch (error) {
      hide();
      message.error('运行失败，请重试');
    }
  };

  const handleStartStop = async (jobId: number, status: number) => {
    const ms = status === 1 ? '停止' : '启动';
    const hide = message.loading(`正在${ms}`);
    try {
      if (status === 1) {
        await stopScheduleTask(jobId);
      } else {
        await startScheduleTask(jobId);
      }
      hide();
      message.success(`${ms}成功，即将刷新`);
      fetchData().then();
    } catch (error) {
      hide();
      message.error(`${ms}失败，请重试`);
    }
  };

  const handleCancel = () => {
    setUpdateModalVisible(false);
    setUpdateFormValues({});
  };

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
              search: `?jobId=${record.id}`,
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
              pathname: '/monitor',
              search: `?jobId=${record.id}`,
            }}
          >
            任务监控
          </Link>
        ),
      },
    ];
  };

  const columns: ColumnsType<OpenJob> = [
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
          <a onClick={() => handleStartStop(record.id, record.status)}>
            {record.status === 0 ? '启动' : '停止'}
          </a>
          <Divider type='vertical' />
          <a onClick={() => handleRun(record.id)}>运行</a>
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

        <ProTable<OpenJob>
          columns={columns}
          tableData={tableData}
          loading={loading}
          tableParams={tableParams}
          onTableChange={onTableChange}
          onBatchDelete={(rows) => handleRemove(rows.map((e) => e.id))}
        />
      </Card>

      <CreateForm
        onSubmit={(value) => handleAdd(value)}
        onCancel={() => setCreateModalVisible(false)}
        modalVisible={createModalVisible}
      />

      {updateFormValues && Object.keys(updateFormValues).length ? (
        <CreateForm
          onSubmit={(value) => handleUpdate(value)}
          onCancel={handleCancel}
          modalVisible={updateModalVisible}
          values={updateFormValues}
        />
      ) : null}
    </BaseLayout>
  );
};

export default JobTableList;
