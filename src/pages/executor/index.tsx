import { message, Divider, Form, Table } from 'antd';
import React, { useState, useRef } from 'react';
import UpdateForm from './components/UpdateForm';
import { confirmModal } from '@/components/ConfirmModel';
import {
  fetchInstancePage,
  updateInstance,
  offline,
  online,
} from '@/services/api';
import { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import BaseLayout from '@/components/Layout';
import { TableParams } from '@/types/LoginTyping';

const FormItem = Form.Item;
/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: Partial<API.Instance>) => {
  const hide = message.loading('正在配置');
  try {
    await updateInstance(fields);
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
 * 实例下线
 */
const handlerOffline = async (clientId: string) => {
  const hide = message.loading('正在下线');
  if (!clientId) return true;
  try {
    await offline(clientId);
    hide();
    message.success('下线成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('下线失败，请重试');
    return false;
  }
};

/**
 * 实例上线
 */
const handlerChange = async (clientId: string) => {
  const hide = message.loading('正在上线');
  if (!clientId) return true;
  try {
    await online(clientId);
    hide();
    message.success('上线成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('上线失败，请重试');
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
  const { query }: any = location;
  const [appId] = useState<number>(query ? query.id : 1);
  const [currentRow, setCurrentRow] = useState<API.Instance>();

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
      const response = await fetchInstancePage({
        current: tableParams.pagination?.current,
        pageSize: tableParams.pagination?.pageSize,
        appId,
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

  const columns: ColumnsType<API.Instance> = [
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
        <span>{record.status === 'OFF_LINE' ? '已下线' : '已上线'}</span>
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
          <a
            onClick={async () => {
              if (record.status === 'OFF_LINE') {
                await handlerChange(record.serverId);
                actionRef.current?.reloadAndRest?.();
              } else {
                const confirm = await confirmModal('确定要下线吗？');
                if (confirm) {
                  await handlerOffline(record.serverId);
                  actionRef.current?.reloadAndRest?.();
                }
              }
            }}
          >
            {record.status === 'OFF_LINE' ? '上线' : '下线'}
          </a>
          <Divider type='vertical' />
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setCurrentRow(record);
            }}
          >
            修改权重
          </a>
          <Divider type='vertical' />
          <Link
            href={{
              pathname: '/executor/monitor',
              search: `?appId=${appId}&serverId=${record.serverId}`,
              hash: '#the-hash',
            }}
          >
            服务监控
          </Link>
        </>
      ),
    },
  ];

  return (
    <BaseLayout>
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

      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />
    </BaseLayout>
  );
};

export default TableList;
