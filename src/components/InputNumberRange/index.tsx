import React, { useState, useEffect } from 'react';
import { InputNumber, Space } from 'antd';
import { isIntOrDecimal } from '@/utils/utils';

type Placeholder = string | { max: string; min: string } | undefined;

interface IPageProps {
  value?: [number, number];
  onChange?: (props: [number | undefined, number | undefined]) => void;
  placeholder?: Placeholder;
}

const getPlaceholder = (placeholder: Placeholder, type: 'max' | 'min') => {
  if (typeof placeholder === 'undefined') {
    return '请输入';
  }

  if (typeof placeholder === 'string') {
    return placeholder;
  }

  switch (type) {
    case 'max':
      return placeholder.max;
    case 'min':
      return placeholder.min;
    default:
      return '请输入';
  }
};

const InputNumberRange: React.FC<IPageProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const [min, setMin] = useState<number>();
  const [max, setMax] = useState<number>();

  const onNumberChange = (
    val: string | number | undefined,
    type: 'min' | 'max',
  ) => {
    if (typeof val === 'undefined') {
      return;
    }

    if (isIntOrDecimal(val)) {
      switch (type) {
        case 'min':
          setMin(Number(val));
          break;
        case 'max':
          setMax(Number(val));
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    if (onChange) {
      onChange([min, max]);
    }
  }, [min, max]);

  useEffect(() => {
    if (value) {
      if (value[0]) {
        setMin(value[0]);
      }
      if (value[1]) {
        setMax(value[1]);
      }
    }
  }, [value]);

  return (
    <Space>
      <InputNumber
        value={value ? value[0] : min}
        onChange={(val) => onNumberChange(val, 'min')}
        placeholder={getPlaceholder(placeholder, 'min')}
        style={{ width: '100%' }}
      />
      -
      <InputNumber
        value={value ? value[1] : max}
        onChange={(val) => onNumberChange(val, 'max')}
        placeholder={getPlaceholder(placeholder, 'max')}
        style={{ width: '100%' }}
      />
    </Space>
  );
};

export default InputNumberRange;
