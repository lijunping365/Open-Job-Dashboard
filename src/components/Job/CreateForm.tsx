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
  Switch,
} from 'antd';
import CronModal from '@/components/CronModel';
import { fetchOpenJobAppList, validateCronExpress } from '@/services/api';
import { ChatItem, OpenJob } from '@/types/typings';
import ChatModal from '@/components/Chat/ChatModal';

const scriptOptions = [
  { value: 'bash', label: 'Shell' },
  { value: 'python', label: 'Python' },
  { value: 'php', label: 'PHP' },
  { value: 'node', label: 'Nodejs' },
  { value: 'powershell', label: 'PowerShell' },
];

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: Partial<OpenJob>) => void;
  values?: Partial<OpenJob>;
}

const FormItem = Form.Item;
const { TextArea } = Input;

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
  const [aiModalVisible, handleAIModalVisible] = useState<boolean>(false);
  const [cronModalVisible, handleCronModalVisible] = useState<boolean>(false);
  const [appOptions, setAppOptions] = useState<any[]>([]);

  const onApply = (chatList: ChatItem) => {
    console.log('dddddddddd', chatList);
    // Find the special text that we need to fill the form
    const script = '...';
    const cronExpression = '...';
    form.setFieldsValue({
      cronExpression,
      script,
    });
  };

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
      await validateCronExpress(form.getFieldValue('cronExpression'));
    } catch (errMsg: any) {
      message.error(errMsg);
      return;
    }

    onSubmit({
      ...values,
      ...fieldsValue,
    });
  };

  const suffixSelector = (
    <Form.Item noStyle>
      <a onClick={() => handleCronModalVisible(true)}>Cron 工具</a>
    </Form.Item>
  );

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
        <Button
          type='primary'
          onClick={() => handleAIModalVisible(true)}
        >
          AI 生成
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
              <Input
                placeholder='请输入Cron 表达式'
                addonAfter={suffixSelector}
              />
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
              name='sharding'
              label='是否分片'
            >
              <Switch
                checkedChildren='是'
                unCheckedChildren='否'
              />
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem
              name='scriptLang'
              label='脚本类型'
            >
              <Select
                allowClear
                options={scriptOptions}
              />
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

        <ChatModal
          onApply={onApply}
          modalVisible={aiModalVisible}
          onClose={() => handleAIModalVisible(false)}
        />

        <CronModal
          cronExpressValue={form.getFieldValue('cronExpression')}
          modalVisible={cronModalVisible}
          onCancel={() => handleCronModalVisible(false)}
          onSubmit={(value) => {
            form.setFieldsValue({
              cronExpression: value,
            });
            handleCronModalVisible(false);
          }}
        />
      </Form>
    </Modal>
  );
};

export default CreateForm;
