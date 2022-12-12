import React, { useRef, useState } from 'react';
import { Space, Input, Tag } from 'antd';
import styles from '../index.less';

const TagList: React.FC<{
  value?: {
    key: string;
    label: string;
  }[];
  onChange?: (
    value: {
      key: string;
      label: string;
    }[],
  ) => void;
  color?: string;
  disabled?: boolean;
  closable?: boolean;
  type?: string;
}> = ({
  value,
  onChange,
  color = 'default',
  disabled = false,
  closable = true,
  type = 'text',
}) => {
  const ref = useRef<Input | null>(null);
  const [newTags, setNewTags] = useState<
    {
      key: string;
      label: string;
    }[]
  >([]);
  const [inputValue, setInputValue] = useState<string>('');

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const onInputConfirm = () => {
    let tempsTags = [...(value || [])];
    if (
      inputValue &&
      tempsTags.filter((tag) => tag.label === inputValue).length === 0
    ) {
      tempsTags = [
        ...tempsTags,
        { key: `new-${tempsTags.length}`, label: inputValue },
      ];
    }
    onChange?.(tempsTags);
    setNewTags([]);
    setInputValue('');
  };

  const onTagClose = (label: string) => {
    const tempsTags = [...(value || [])].filter((tag) => tag.label !== label);
    onChange?.(tempsTags);
    setNewTags([]);
  };

  return (
    <Space className={styles.btSelectSpace}>
      {(value || []).concat(newTags).map((item) => (
        <Tag
          key={item.key}
          closable={closable && !disabled}
          onClose={() => onTagClose(item.label)}
          color={color}
        >
          {item.label}
        </Tag>
      ))}
      <Input
        ref={ref}
        disabled={disabled}
        type={type}
        size="small"
        autoFocus
        style={{ width: 100, display: 'block' }}
        value={inputValue}
        placeholder="点击空白添加"
        onChange={onInputChange}
        onBlur={onInputConfirm}
      />
    </Space>
  );
};

export default TagList;
