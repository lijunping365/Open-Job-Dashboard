import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
} from 'antd';
import CronModal from '@/components/CronModel';
import { fetchOpenJobAppList, validateCronExpress } from '@/services/api';
import { OpenJob } from '@/types/typings';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: Partial<OpenJob>) => void;
  values?: Partial<OpenJob>;
}

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const CreateForm: React.FC<CreateFormProps> = ({
  modalVisible,
  onSubmit,
  onCancel,
  values,
}: CreateFormProps) => {
  const [form] = Form.useForm();
  const [cronModalVisible, handleCronModalVisible] = useState<boolean>(false);
  const [cronExpressValue, setCronExpressValue] = useState<string>(
    values?.cronExpression || ''
  );
  const [appOptions, setAppOptions] = useState<any[]>([]);
  const [handlerOptions, setHandlerOptions] = useState<any[]>([]);

  const onFetchOpenJobAppList = useCallback(async () => {
    const result = await fetchOpenJobAppList();
    if (result) {
      const appList = result.map((item) => {
        return { label: item.appName, value: item.id };
      });
      setAppOptions(appList);
    }
  }, []);

  const handleFinish = async () => {
    const fieldsValue: any = await form.validateFields();
    try {
      await validateCronExpress(cronExpressValue);
    } catch (errMsg: any) {
      message.error(errMsg);
      return;
    }

    onSubmit({
      ...values,
      ...fieldsValue,
      cronExpression: cronExpressValue,
    });
  };

  useEffect(() => {
    onFetchOpenJobAppList().then();
  }, []);

  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => onCancel()}>取消</Button>
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
      onCancel={() => onCancel()}
      onOk={() => handleFinish()}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={{ ...values }}
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
              name='cronExpression'
              label='Cron 表达式'
              rules={[{ required: true, message: '请输入Cron 表达式！' }]}
            >
              <Space.Compact>
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
              </Space.Compact>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem
              name='appId'
              label='选择应用'
              rules={[{ required: true, message: '请选择应用!' }]}
            >
              <Select options={appOptions} />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              name='handlerName'
              label='输入handler'
              rules={[{ required: true, message: '请输入 handlerName！' }]}
            >
              <Input placeholder='请输入jobHandler' />
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
                <Option value={0}>故障转移</Option>
                <Option value={1}>分片广播</Option>
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
