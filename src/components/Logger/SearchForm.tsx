import React from 'react';
import { Button, Form, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import DebounceSelect, {
  SelectOptionsProps,
} from '@/components/DebounceSelect';
import { fetchByJobName } from '@/services/api';

const FormItem = Form.Item;

const { RangePicker } = DatePicker;

interface Props {
  form: any;
  fetchData: () => void;
}

const fetchJobList = async (name: string) => {
  const res = await fetchByJobName(name);
  const options: SelectOptionsProps[] = [];
  if (res) {
    res.forEach((item) => {
      options.push({ label: item.jobName, value: item.id });
    });
  }
  return options;
};

const SearchForm = ({ form, fetchData }: Props) => {
  return (
    <Form
      layout='inline'
      form={form}
      style={{ marginBottom: 24 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <FormItem name='name'>
          <DebounceSelect
            placeholder='输入任务名称'
            fetchOptions={fetchJobList}
            style={{ minWidth: 200 }}
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
