import React from 'react';
import { Button, Form, Input, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

interface Props {
  form: any;
  fetchData: () => void;
}

const SearchForm = ({ form, fetchData }: Props) => {
  return (
    <Form
      layout='inline'
      form={form}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <FormItem name='name'>
          <Input
            allowClear
            placeholder='输入应用名称'
            prefix={<SearchOutlined />}
          />
        </FormItem>

        <FormItem name='timeRange'>
          <RangePicker showTime />
        </FormItem>

        <Button
          type='primary'
          icon={<SearchOutlined />}
          onClick={fetchData}
        >
          查询
        </Button>
      </div>
    </Form>
  );
};

export default SearchForm;
