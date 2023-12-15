import React from 'react';
import { Button, Form, Input, Modal } from 'antd';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: (flag?: boolean) => void;
  onSubmit: (values: Partial<API.OpenJob>) => void;
  values?: Partial<API.OpenJobApp>;
}

const FormItem = Form.Item;

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

  const handleFinish = async () => {
    const fieldsValue: any = await form.validateFields();
    onSubmit({
      ...fieldsValue,
    });
  };

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
      title='新建应用'
      width={600}
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
        <FormItem
          name='appName'
          label='应用名称'
          rules={[{ required: true, message: '请输入应用名称！' }]}
        >
          <Input placeholder='请输入应用名称' />
        </FormItem>

        <FormItem
          name='appDesc'
          label='应用描述'
          rules={[{ required: true, message: '请输入应用描述！' }]}
        >
          <Input placeholder='请输入应用描述' />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;
