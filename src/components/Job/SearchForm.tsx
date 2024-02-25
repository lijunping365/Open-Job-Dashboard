import { Button, Form, Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import React from 'react';

const FormItem = Form.Item;

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
      <div className='search-form-item-wrapper'>
        <FormItem name='jobName'>
          <Input
            allowClear
            placeholder='输入任务名称'
            prefix={<SearchOutlined />}
          />
        </FormItem>

        <FormItem name='status'>
          <Select
            allowClear
            placeholder='选择状态'
            style={{ minWidth: 200 }}
            options={[
              { value: '1', label: '启动' },
              { value: '0', label: '停止' },
            ]}
          />
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
