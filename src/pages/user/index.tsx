import { message, Divider, Card, Form, Button } from 'antd';
import React, { useState } from 'react';
import { fetchUserPage, updateUser, removeUser } from '@/services/api';
import { confirmModal } from '@/components/ConfirmModel';
import { ColumnsType } from 'antd/es/table';
import BaseLayout from '@/components/Layout';
import usePaginationRequest from '@/hooks/usePagination';
import PageParams = API.PageParams;
import SearchForm from '@/components/Job/SearchForm';
import ProTable from '@/components/ProTable';
import UpdateForm from '@/components/User/UpdateForm';

const TableList: React.FC = () => {
  const [form] = Form.useForm();
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});

  const request = async (params: PageParams) => {
    const values = await form.validateFields();
    return await fetchUserPage({
      ...values,
      current: params.current,
      pageSize: params.pageSize,
    });
  };

  const [tableData, loading, tableParams, onTableChange, fetchData] =
    usePaginationRequest<API.User>((params) => request(params));

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

  const handleRemove = async (selectedRows: any[]) => {
    const hide = message.loading('正在删除');
    try {
      await removeUser({ ids: selectedRows });
      hide();
      message.success('删除成功，即将刷新');
      fetchData().then();
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
    }
  };

  const handleCancel = () => {
    setUpdateModalVisible(false);
    setUpdateFormValues({});
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

        <ProTable<API.User>
          columns={columns}
          tableData={tableData}
          loading={loading}
          tableParams={tableParams}
          onTableChange={onTableChange}
          onBatchDelete={(rows) => handleRemove(rows)}
        />
      </Card>

      {updateFormValues && Object.keys(updateFormValues).length ? (
        <UpdateForm
          onSubmit={(value) => handleUpdate(value)}
          onCancel={handleCancel}
          modalVisible={updateModalVisible}
          values={updateFormValues}
        />
      ) : null}
    </BaseLayout>
  );
};

export default TableList;
