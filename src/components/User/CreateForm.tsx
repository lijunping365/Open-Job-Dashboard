import React from 'react';
import { Form, Button, Input, Modal } from 'antd';
import { User } from '@/types/typings';

export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: Partial<User>) => void;
  modalVisible: boolean;
  values?: Partial<User>;
}
const FormItem = Form.Item;

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const CreateForm: React.FC<UpdateFormProps> = ({
  onCancel,
  onSubmit,
  modalVisible,
  values,
}: UpdateFormProps) => {
  const [form] = Form.useForm();

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    onSubmit({ ...values, ...fieldsValue });
  };

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
      title='用户编辑'
      open={modalVisible}
      footer={renderFooter()}
      onCancel={() => onCancel()}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={{ username: values?.username }}
      >
        <FormItem
          name='username'
          label='用户名称'
          rules={[{ required: true, message: '请输入用户名称！' }]}
        >
          <Input placeholder='请输入用户名称' />
        </FormItem>

        <FormItem
          name='password'
          label='密码'
          rules={[{ required: true, message: '请输入密码！' }]}
        >
          <Input.Password placeholder='请输入密码' />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;
