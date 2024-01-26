import { Button, Form, Input } from 'antd';
import React from 'react';
import { ChatConfigType } from '@/types/typings';

const FormItem = Form.Item;
const { TextArea } = Input;

interface ChatConfigProps {
  onCancel: () => void;
  onSubmit: (values: Partial<ChatConfigType>) => void;
  values?: Partial<ChatConfigType>;
}

const ChatConfig = ({ onCancel, onSubmit, values }: ChatConfigProps) => {
  const [form] = Form.useForm();

  const handleSaveConfig = () => {
    const fieldsValue = form.getFieldsValue();
    onSubmit({ ...values, ...fieldsValue });
  };
  return (
    <Form
      form={form}
      className='chat-box'
      layout={'vertical'}
      initialValues={{ ...values }}
    >
      <FormItem
        name='prompt'
        label='设置 prompt'
      >
        <TextArea
          placeholder='请输入 prompt'
          style={{ height: '330px', resize: 'none' }}
        />
      </FormItem>

      <FormItem style={{ display: 'flex', justifyContent: 'end' }}>
        <Button
          onClick={() => onCancel()}
          style={{ marginRight: '15px' }}
        >
          取消
        </Button>
        <Button
          type='primary'
          onClick={() => handleSaveConfig()}
        >
          保存
        </Button>
      </FormItem>
    </Form>
  );
};

export default ChatConfig;
