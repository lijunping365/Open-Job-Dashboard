import {Button, message, Divider, Drawer} from 'antd';
import React, {useState, useRef} from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type {ProDescriptionsItemProps} from "@ant-design/pro-descriptions";
import ProDescriptions from '@ant-design/pro-descriptions';
import {fetchAlarmRecordPage, removeAlarmRecord} from '@/services/open-job/api';
import {confirmModal} from "@/components/ConfirmModel";
import type {RouteChildrenProps} from "react-router";

/**
 * 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: any[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeAlarmRecord({ids: selectedRows});
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC<RouteChildrenProps> = ({ location }) => {
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.OpenJobAlarm[]>([]);
  const { query }: any = location;
  const [appId] = useState<number>(query? query.appId : 0);
  const [jobId] = useState<number>(query? query.jobId : 0);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.OpenJobAlarm>();

  const columns: ProColumns<API.OpenJobAlarm>[] = [
    {
      title: '编号',
      dataIndex: 'id',
      valueType: 'text',
      search: false
    },
    {
      title: '应用编号',
      dataIndex: 'appId',
      valueType: 'text',
    },
    {
      title: '任务编号',
      dataIndex: 'jobId',
      valueType: 'text',
    },
    {
      title: '执行节点',
      dataIndex: 'serverId',
      valueType: 'text',
    },
    {
      title: '报警消息',
      dataIndex: 'message',
      valueType: 'text',
      hideInTable: true
    },
    {
      title: '报警时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true
    },
    {
      title: '报警接收人',
      dataIndex: 'receiver',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '开始时间',
      dataIndex: 'beginTime',
      valueType: 'dateTime',
      hideInTable: true,
      hideInDescriptions: true
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      valueType: 'dateTime',
      hideInTable: true,
      hideInDescriptions: true
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={()=>{
              setShowDetail(true);
              setCurrentRow(record);
            }}
          >
            查看详情
          </a>
          <Divider type="vertical" />
          <a
            onClick={async () => {
              const confirm = await confirmModal();
              if (confirm){
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
    <PageContainer>
      <ProTable<API.OpenJobAlarm>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => []}
        request={async (params) => {
          const response = await fetchAlarmRecordPage({ ...params, appId, jobId });
          return {
            data: response.records,
            total: response.total,
            success: true,
            pageSize: response.pages,
            current: response.current,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项&nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState ? selectedRowsState.map((e) => e.id):[]);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}

      <Drawer
        width={400}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.id && (
          <ProDescriptions<API.OpenJobAlarm>
            column={1}
            title={currentRow?.id}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.OpenJobAlarm>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
