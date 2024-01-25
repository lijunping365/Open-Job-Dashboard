import { Button, Form, Input } from 'antd';
import React from 'react';
import { ChatConfigType } from '@/types/typings';

const FormItem = Form.Item;
const { TextArea } = Input;

interface ChatConfigProps {
  prompt?: string;
  onCancel: () => void;
  onSubmit: (prompt: string, config: Partial<ChatConfigType>) => void;
  config?: Partial<ChatConfigType>;
}

const ChatConfig = ({
  onCancel,
  onSubmit,
  config,
  prompt,
}: ChatConfigProps) => {
  const [form] = Form.useForm();

  const handleSaveConfig = () => {
    const prompt = form.getFieldValue('prompt');
    onSubmit(prompt, { usingContext: true });
  };
  return (
    <Form
      form={form}
      className='chat-box'
      layout={'vertical'}
      initialValues={{ ...config, prompt: prompt }}
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
