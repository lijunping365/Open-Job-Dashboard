import React, { useCallback, useEffect, useState } from 'react';
import { Form, Button, Input, Modal, Select } from 'antd';
import { Instance } from '@/types/typings';
import { fetchOpenJobAppList } from '@/services/api';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: Partial<Instance>) => void;
  values?: Partial<Instance>;
}

const FormItem = Form.Item;

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const CreateForm: React.FC<CreateFormProps> = ({
  modalVisible,
  onCancel,
  onSubmit,
  values,
}: CreateFormProps) => {
  const [form] = Form.useForm();
  const [appOptions, setAppOptions] = useState<any[]>([]);

  const onFetchOpenJobAppList = useCallback(async () => {
    const result = await fetchOpenJobAppList();
    if (result) {
      const appList = result.map((item) => {
        return { label: item.appName, value: item.id };
      });
      setAppOptions(appList);
    }
  }, []);

  const handleNext = async () => {
    const fieldsValue: any = await form.validateFields();
    onSubmit({
      ...values,
      ...fieldsValue,
    });
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  useEffect(() => {
    onFetchOpenJobAppList().then();
  }, []);

  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => onCancel()}>取消</Button>
        <Button
          type='primary'
          onClick={() => handleNext()}
        >
          保存
        </Button>
      </>
    );
  };

  return (
    <Modal
      width={640}
      style={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title='创建实例'
      open={modalVisible}
      footer={renderFooter()}
      onCancel={() => onCancel()}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={{ ...values }}
      >
        <FormItem
          name='appId'
          label='选择应用'
          rules={[{ required: true, message: '请选择应用!' }]}
        >
          <Select
            showSearch
            filterOption={filterOption}
            options={appOptions}
          />
        </FormItem>

        <FormItem
          name='serverId'
          label='节点地址'
          rules={[{ required: true, message: '例如：127.0.0.1:8080' }]}
        >
          <Input placeholder='请输入实例权重' />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;
