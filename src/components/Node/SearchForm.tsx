import { Button, Form, Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { fetchOpenJobAppList } from '@/services/api';

const FormItem = Form.Item;

interface Props {
  form: any;
  fetchData: () => void;
}

const SearchForm = ({ form, fetchData }: Props) => {
  const [options, setOptions] = useState<any>([]);
  const searchApp = async () => {
    const res = await fetchOpenJobAppList();
    if (res) {
      const appList = res.map((item) => {
        return { label: item.appName, value: item.id };
      });
      setOptions(appList);
    }
  };

  useEffect(() => {
    searchApp().then();
  }, []);

  return (
    <Form
      layout='inline'
      form={form}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <FormItem name='address'>
          <Input
            allowClear
            placeholder='输入节点地址'
            prefix={<SearchOutlined />}
          />
        </FormItem>

        <FormItem name='appId'>
          <Select
            allowClear
            placeholder='选择应用'
            options={options}
            style={{ minWidth: 200 }}
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
