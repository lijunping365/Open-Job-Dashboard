import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, message, Divider, Form, Input, Card, Table } from 'antd';
import React, { useState, useRef } from 'react';
import UpdateForm from './components/UpdateForm';
import {
  fetchOpenJobAppPage,
  addOpenJobApp,
  updateOpenJobApp,
  removeOpenJobApp,
} from '@/services/api';
import { confirmModal } from '@/components/ConfirmModel';
import CreateForm from './components/CreateForm';
import { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import BaseLayout from '@/components/Layout';
import ProTable from '@/components/ProTable';
import usePaginationRequest from '@/hooks/usePagination';
import PageParams = API.PageParams;
import SearchForm from '@/components/Job/SearchForm';

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: Partial<API.OpenJobApp>) => {
  const hide = message.loading('正在添加');
  try {
    await addOpenJobApp(fields);
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
const handleUpdate = async (fields: Partial<API.OpenJobApp>) => {
  const hide = message.loading('正在配置');
  try {
    await updateOpenJobApp(fields);
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
    await removeOpenJobApp({ ids: selectedRows });
    hide();
    message.success('删除成功，即将刷新');
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
  }
};

const TableList: React.FC = () => {
  const [form] = Form.useForm();
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});

  const request = async (params: PageParams) => {
    const values = await form.validateFields();
    return await fetchOpenJobAppPage({
      ...values,
      current: params.current,
      pageSize: params.pageSize,
    });
  };

  const [tableData, loading, tableParams, onTableChange, fetchData] =
    usePaginationRequest<API.OpenJobApp>((params) => request(params));

  const columns: ColumnsType<API.OpenJobApp> = [
    {
      title: '应用ID',
      dataIndex: 'id',
    },
    {
      title: '应用名称',
      dataIndex: 'appName',
    },
    {
      title: '应用描述',
      dataIndex: 'appDesc',
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
        <>
          <a
            onClick={() => {
              setUpdateModalVisible(true);
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
                fetchData().then();
              }
            }}
          >
            删除
          </a>
          <Divider type='vertical' />
          <Link
            href={{
              pathname: '/executor',
              search: `?id=${record.id}`,
              hash: '#the-hash',
            }}
          >
            查看集群
          </Link>
          <Divider type='vertical' />
          <Link
            href={{
              pathname: '/app/monitor',
              search: `?id=${record.id}`,
              hash: '#the-hash',
            }}
          >
            应用监控
          </Link>
        </>
      ),
    },
  ];

  return (
    <BaseLayout>
      <Card bordered={false}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
          }}
        >
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

        <ProTable<API.OpenJobApp>
          columns={columns}
          tableData={tableData}
          loading={loading}
          tableParams={tableParams}
          onTableChange={onTableChange}
          onBatchDelete={(rows) => handleRemove(rows)}
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
        <UpdateForm
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
          updateModalVisible={updateModalVisible}
          values={updateFormValues}
        />
      ) : null}
    </BaseLayout>
  );
};

export default TableList;
