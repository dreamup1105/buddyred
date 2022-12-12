import React from 'react';
import { TreeSelect } from 'antd';
import type { DepartmentTreeNode } from '@/pages/Employee/type';
import type { TreeSelectProps } from 'antd/es/tree-select';

type OnTreeSelectChange = TreeSelectProps<DepartmentTreeNode>['onChange'];

interface IComponentProps {
  treeSelectProps: TreeSelectProps<DepartmentTreeNode>;
  value?: any;
  onChange?: OnTreeSelectChange;
}

const DepartmentSelector: React.FC<IComponentProps> = ({
  treeSelectProps,
  value,
  onChange,
}) => {
  const onTreeChange: OnTreeSelectChange = (val, labelList, extra) => {
    if (onChange) {
      onChange(val, labelList, extra);
    }
  };
  return (
    <TreeSelect
      value={value}
      onChange={onTreeChange}
      showSearch
      treeNodeFilterProp="title"
      placeholder="请选择"
      treeDefaultExpandAll
      {...treeSelectProps}
    />
  );
};

export default DepartmentSelector;
