'use client';

import { message, Form, Card, Button } from 'antd';
import React, { useState } from 'react';
import CreateForm from '@/components/Node/CreateForm';
import { confirmModal } from '@/components/ConfirmModel';
import {
  fetchInstancePage,
  updateInstance,
  addInstance,
  removeInstance,
} from '@/services/api';
import { ColumnsType } from 'antd/es/table';
import BaseLayout from '@/components/Layout';
import usePaginationRequest from '@/hooks/usePagination';
import SearchForm from '@/components/Node/SearchForm';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@/components/ProTable';
import { Instance, PageParams } from '@/types/typings';
import { useSearchParams } from 'next/navigation';

export default function ClusterPage() {
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);

  const request = async (params: PageParams) => {
    const values = form.getFieldsValue();
    return await fetchInstancePage({
      appId: values.appId ? values.appId : searchParams.get('appId'),
      address: values.address,
      status: values.status,
      current: params.current,
      pageSize: params.pageSize,
    });
  };

  const [tableData, loading, tableParams, onTableChange, fetchData] =
    usePaginationRequest<Instance>((params) => request(params));

  const handleAdd = async (fields: Partial<Instance>) => {
    const hide = message.loading('正在添加');
    try {
      await addInstance(fields);
      hide();
      message.success('添加成功');
      setCreateModalVisible(false);
      fetchData().then();
    } catch (error) {
      hide();
      message.error('添加失败请重试！');
    }
  };

  const handleUpdate = async (fields: Partial<Instance>) => {
    const hide = message.loading('正在修改');
    try {
      await updateInstance(fields);
      hide();
      message.success('修改成功');
      fetchData().then();
    } catch (error) {
      hide();
      message.error('修改失败请重试！');
    }
  };

  const handlerChange = async (record: Instance) => {
    if (record.status === 1) {
      const confirm = await confirmModal('确定要下线吗？');
      if (confirm) await handleUpdate({ ...record, status: 0 });
    } else {
      await handleUpdate({ ...record, status: 1 });
    }
    fetchData().then();
  };

  const handleRemove = async (selectedRows: any[]) => {
    const hide = message.loading('正在删除');
    try {
      await removeInstance({ ids: selectedRows });
      hide();
      message.success('删除成功，即将刷新');
      fetchData().then();
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
    }
  };

  const columns: ColumnsType<Instance> = [
    {
      title: '实例地址',
      dataIndex: 'serverId',
    },
    {
      title: '最近上线时间',
      dataIndex: 'onlineTime',
    },
    {
      title: '运行时长',
      dataIndex: 'liveTime',
    },
    {
      title: 'CPU 占用',
      dataIndex: 'cpuInfo',
    },
    {
      title: '内存占用',
      dataIndex: 'memoryInfo',
    },
    {
      title: '磁盘占用',
      dataIndex: 'diskInfo',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (_, record) => (
        <span>{record.status === 1 ? '已上线' : '已下线'}</span>
      ),
    },
    {
      title: '权重',
      dataIndex: 'weight',
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (_, record) => (
        <>
          <a onClick={() => handlerChange(record)}>
            {record.status === 1 ? '下线' : '上线'}
          </a>
        </>
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

        <ProTable<Instance>
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
    </BaseLayout>
  );
}
