import React from 'react';
import { Select, Spin } from 'antd';
import type { ChildProps as Props } from './ItemSelect';

function WrappedAntdSelect<T>({
  width = 160,
  nameKey = 'name',
  valueKey = 'value',
  items,
  value,
  searchPlaceholder = '输入关键词搜索',
  searchLoading,
  disabled,
  onChange,
  onSearch,
  onLoadMore,
}: Props<T, string>) {
  const handleScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    const { clientHeight, scrollTop, scrollHeight } = e.currentTarget;
    if (scrollTop + clientHeight === scrollHeight) {
      onLoadMore();
    }
  };
  const options = items.map((_) => ({
    label: _[nameKey],
    value: _[valueKey],
  }));
  const handleSelectItem = (v: { value: any; label: string }) => {
    if (onChange) {
      const newSelectedItems = value ? [...value] : [];
      for (let i = 0, l = items.length; i < l; i += 1) {
        if (items[i][valueKey] === v.value) {
          newSelectedItems.push(items[i]);
          break;
        }
      }
      onChange(newSelectedItems);
    }
  };
  const handleDeselectItem = (v: { value: any; label: string }) => {
    if (onChange && value) {
      const newSelectedItems: T[] = [];
      for (let i = 0, l = value.length; i < l; i += 1) {
        if (value[i][valueKey] !== v.value) {
          newSelectedItems.push(value[i]);
        }
      }
      onChange(newSelectedItems);
    }
  };
  return (
    <Select
      mode="multiple"
      placeholder={searchPlaceholder}
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      notFoundContent={searchLoading ? <Spin size="small" /> : null}
      style={{ width }}
      showSearch
      onFocus={() => onSearch('')}
      onPopupScroll={handleScroll}
      onSearch={onSearch}
      onSelect={handleSelectItem}
      onDeselect={handleDeselectItem}
      labelInValue
      value={
        value
          ? value.map((_) => ({ value: _[valueKey], label: _[nameKey] }))
          : undefined
      }
      options={options}
      disabled={disabled}
    />
  );
}

export default WrappedAntdSelect;
