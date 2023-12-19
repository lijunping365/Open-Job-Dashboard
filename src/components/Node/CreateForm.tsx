import React from 'react';
import { Form, Button, Input, Modal } from 'antd';
import { Instance } from '@/types/typings';

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

  const handleNext = async () => {
    const fieldsValue: any = await form.validateFields();
    onSubmit({
      ...values,
      ...fieldsValue,
    });
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
      title='编辑实例'
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
          name='weight'
          label='权重'
          rules={[
            { required: true, message: '请输入实例权重！', min: 1, max: 100 },
          ]}
        >
          <Input
            placeholder='请输入实例权重'
            type={'number'}
          />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;
