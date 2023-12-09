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
import { TableParams } from '@/types/LoginTyping';

const FormItem = Form.Item;
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
  if (!selectedRows) return true;
  try {
    await removeOpenJobApp({ ids: selectedRows });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [createModalVisible, handleCreateModalVisible] =
    useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const [selectedRowsState, setSelectedRows] = useState<API.OpenJobApp[]>([]);
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
      const response = await fetchOpenJobAppPage({
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

  const columns: ColumnsType<API.OpenJobApp> = [
    {
      title: '应用编号',
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
      title: '创建人',
      dataIndex: 'createUser',
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (_, record) => (
        <>
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
                <Button
                  type='primary'
                  key='primary'
                  onClick={() => {
                    handleCreateModalVisible(true);
                  }}
                >
                  <PlusOutlined /> 新建
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </Card>

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
