import { Select, SelectProps, Spin } from 'antd';
import { useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { SearchOutlined } from '@ant-design/icons';

export interface SelectOptionsProps {
  label: string;
  value: any;
}

interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

function DebounceSelect<
  ValueType extends {
    key?: string;
    label: React.ReactNode;
    value: string | number;
  } = any,
>({
  fetchOptions,
  debounceTimeout = 800,
  ...props
}: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const [searchName, setSearchName] = useState('');
  const fetchRef = useRef(0);

  const loadOptions = (value: string) => {
    fetchRef.current += 1;
    const fetchId = fetchRef.current;
    setOptions([]);
    setFetching(true);
    setSearchName(value);

    fetchOptions(value).then((newOptions) => {
      if (fetchId !== fetchRef.current) {
        // for fetch callback order
        return;
      }
      // customer delay state
      setTimeout(() => {
        setOptions(newOptions);
        setFetching(false);
      }, 500);
    });
  };

  const debounceFetcher = useDebouncedCallback((value: string) => {
    void loadOptions(value);
  }, debounceTimeout);

  const renderEmpty = () => {
    if (fetching) {
      return <Spin size='small' />;
    }
    if (!fetching && !searchName) {
      return null;
    }
  };

  return (
    <Select
      showSearch
      allowClear
      onSearch={debounceFetcher}
      filterOption={false}
      suffixIcon={<SearchOutlined />}
      notFoundContent={renderEmpty()}
      {...props}
      options={options}
    />
  );
}

export default DebounceSelect;
