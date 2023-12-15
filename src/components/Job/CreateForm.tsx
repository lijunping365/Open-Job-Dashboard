import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Input, message, Modal, Row, Select } from 'antd';
import CronModal from '@/components/CronModel';
import {
  addScheduleTask,
  fetchAllInstance,
  fetchOpenJobAppList,
  validateCronExpress,
} from '@/services/api';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: (flag?: boolean) => void;
  onSubmit: (values: Partial<API.OpenJob>) => void;
}

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const [cronExpressValue, setCronExpressValue] = useState<string>();
  const [appOptions, setAppOptions] = useState<any>([]);
  const [nodeOptions, setNodeOptions] = useState<any>([]);

  const {
    modalVisible,
    onSubmit: handleCreate,
    onCancel: handleCreateModalVisible,
  } = props;

  const onFetchOpenJobAppList = useCallback(async () => {
    const result = await fetchOpenJobAppList();
    if (result) {
      const appList = result.map((item) => {
        return { label: item.appName, value: item.id };
      });
      setAppOptions(appList);
    }
  }, []);

  useEffect(() => {
    onFetchOpenJobAppList().then();
  }, []);

  const handleSelectApp = async (op: any) => {
    const result = await fetchAllInstance(op);
    if (result) {
      const instanceList = result.map((item) => {
        return { label: item.serverId, value: item.serverId };
      });
      setNodeOptions(instanceList);
    }
  };

  const handleFinish = async () => {
    const fieldsValue: any = await form.validateFields();
    if (!cronExpressValue || cronExpressValue.length === 0) {
      message.error('cron 表达式不能为空');
      return;
    }
    const result = await validateCronExpress(cronExpressValue);
    if (!result) {
      return;
    }

    const { routeStrategy } = fieldsValue;
    const { shardingNodes } = fieldsValue;
    if (routeStrategy === 1 && (!shardingNodes || shardingNodes.length === 0)) {
      message.error('分片执行时分片节点不能为空');
      return;
    }

    const hide = message.loading('正在添加');
    try {
      await addScheduleTask({
        ...fieldsValue,
        cronExpression: cronExpressValue,
        shardingNodes: shardingNodes.join(','),
      });
      hide();
      message.success('添加成功');
      return true;
    } catch (error) {
      hide();
      message.error('添加失败请重试！');
      return false;
    }
  };

  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => handleCreateModalVisible(false)}>取消</Button>
        <Button
          type='primary'
          onClick={() => handleFinish()}
        >
          保存
        </Button>
      </>
    );
  };

  return (
    <Modal
      destroyOnClose
      title='新建任务'
      width={900}
      open={modalVisible}
      footer={renderFooter()}
      onCancel={() => handleCreateModalVisible(false)}
      onOk={() => handleFinish()}
    >
      <Form
        {...formLayout}
        form={form}
      >
        <Row>
          <Col span={12}>
            <FormItem
              name='jobName'
              label='任务名称'
              rules={[{ required: true, message: '请输入任务名称！' }]}
            >
              <Input placeholder='请输入任务名称' />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              name='handlerName'
              label='jobHandler'
              rules={[{ required: true, message: '请输入jobHandler！' }]}
            >
              <Input placeholder='请输入jobHandler' />
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem
              name='appId'
              label='选择应用'
              hasFeedback
              rules={[{ required: true, message: '请选择应用!' }]}
            >
              <Select
                showSearch
                onChange={handleSelectApp}
                filterOption={(inputValue, option) =>
                  option!.children.indexOf(inputValue) !== -1
                }
              >
                {openJobAppOptions}
              </Select>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              name='cronExpression'
              label='Cron 表达式'
            >
              <Input.Group
                compact
                style={{ display: 'flex' }}
              >
                <Input
                  placeholder='请输入Cron 表达式'
                  value={cronExpressValue}
                  onChange={(e) => setCronExpressValue(e.target.value)}
                />
                <Button
                  type='primary'
                  onClick={() => handleCronModalVisible(true)}
                >
                  Cron 工具
                </Button>
              </Input.Group>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem
              name='routeStrategy'
              label='路由策略'
            >
              <Select defaultValue={0}>
                <Option value={0}>负载均衡</Option>
                <Option value={1}>分片执行</Option>
              </Select>
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem
              name='shardingNodes'
              label='选择节点'
            >
              <Select
                mode='multiple'
                allowClear
                style={{ width: '100%' }}
                placeholder='请选择节点'
              >
                {openJobNodeOptions}
              </Select>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem
              name='params'
              label='任务参数'
            >
              <TextArea
                rows={4}
                placeholder='请输入任务参数'
              />
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem
              name='script'
              label='调度脚本'
            >
              <TextArea
                rows={4}
                placeholder='请输入调度脚本'
              />
            </FormItem>
          </Col>
        </Row>

        <CronModal
          cronExpressValue={
            cronExpressValue && cronExpressValue.length !== 0
              ? cronExpressValue
              : '* * * * * ? *'
          }
          modalVisible={cronModalVisible}
          onCancel={() => handleCronModalVisible(false)}
          onSubmit={(value) => {
            setCronExpressValue(value);
            handleCronModalVisible(false);
          }}
        />
      </Form>
    </Modal>
  );
};

export default CreateForm;
