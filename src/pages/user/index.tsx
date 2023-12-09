import {
  Button,
  message,
  Divider,
  Card,
  Form,
  Input,
  Alert,
  Table,
} from 'antd';
import React, { useState, useRef } from 'react';
import UpdateForm from './components/UpdateForm';
import { fetchUserPage, updateUser, removeUser } from '@/services/api';
import { confirmModal } from '@/components/ConfirmModel';
import { ColumnsType } from 'antd/es/table';
import BaseLayout from '@/components/Layout';
import { SearchOutlined } from '@ant-design/icons';
import { TableParams } from '@/types/LoginTyping';

const FormItem = Form.Item;

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: Partial<API.User>) => {
  const hide = message.loading('正在配置');
  try {
    await updateUser(fields);
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
    await removeUser({ ids: selectedRows });
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
  /** 分布更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});

  // const [currentRow, setCurrentRow] = useState<User>();
  const [selectedRowsState, setSelectedRows] = useState<API.User[]>([]);

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
      const response = await fetchUserPage({
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

  const columns: ColumnsType<API.User> = [
    {
      title: '用户id',
      dataIndex: 'id',
    },
    {
      title: '用户名称',
      dataIndex: 'username',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (_, record) => (
        <span>{record.status === 1 ? '禁用' : '启用'}</span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
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
