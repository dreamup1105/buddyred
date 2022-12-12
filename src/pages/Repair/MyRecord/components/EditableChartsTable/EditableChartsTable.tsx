import React, { useState } from 'react';
import { Table, Button } from 'antd';
import type { Part } from '../../../type';
import EditableRow from './EditableRow';
import EditableCell from './EditableCell';
import ModalAddPart from './ModalAddPart';
import styles from './EditableChartsTable.less';
import type { EditingPart } from './type';

export const getCustomIndex = (() => {
  let index = 0;
  return (base = 0) => {
    index += 1;
    return base + index;
  };
})();

interface EditableChartsTableProps {
  value?: Part[];
  onChange?: (parts: Part[]) => void;
}

export const EditableChartsTable: React.FC<EditableChartsTableProps> = ({
  value = [],
  onChange,
}) => {
  const [modalAddPartVis, setModalAddPartVis] = useState(false);
  const handleDeletePart = (index: number) => {
    if (onChange) {
      const newValue = [...value];
      newValue.splice(index, 1);
      onChange(newValue);
    }
  };

  const handleSaveEdit = (record: Part, index: number) => {
    if (onChange) {
      const newValue = [...value];
      const old = newValue[index];
      newValue.splice(index, 1, { ...old, ...record });
      onChange(newValue);
    }
  };

  const handleSubmitPartAdd = (part: EditingPart) => {
    if (onChange) {
      onChange([
        ...value,
        {
          id: part.product.value,
          productName: part.product.label,
          manufacturerName: part.manufacturer.label,
          modelId: part.model.value,
          modelName: part.model.label,
          sn: part.sn,
          quantity: 1,
          amount: 0,
          customIndex: getCustomIndex(value.length),
        },
      ]);
    }
    setModalAddPartVis(false);
  };

  const columns = [
    {
      title: '序号',
      key: 'index',
      width: 65,
      render: (t: any, r: any, index: number) => index + 1,
    },
    {
      title: '配件名称',
      dataIndex: 'productName',
    },
    {
      title: '厂商',
      dataIndex: 'manufacturerName',
    },
    {
      title: '型号',
      dataIndex: 'modelName',
    },
    {
      title: '序列号',
      dataIndex: 'sn',
    },
    {
      title: '价格',
      dataIndex: 'amount',
      editable: true,
      inputProps: { type: 'number', min: 0 },
      width: '10%',
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      editable: true,
      inputType: 'number',
      inputProps: { type: 'number', min: 1 },
      width: '10%',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_: any, record: Part, index: number) => (
        <a onClick={() => handleDeletePart(index)}>删除</a>
      ),
    },
  ];

  const exColumns = columns.map((_) => {
    if (!_.editable) {
      return _;
    }
    return {
      ..._,
      onCell: (record: Part, index: number) => ({
        record,
        rowIndex: index,
        editable: _.editable,
        dataIndex: _.dataIndex,
        title: _.title,
        inputProps: _.inputProps,
        handleSave: handleSaveEdit,
      }),
    };
  });

  return (
    <>
      <Table<Part>
        pagination={false}
        rowKey="customIndex"
        rowClassName={styles.editableRow}
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        dataSource={value}
        columns={exColumns as any}
        footer={() => (
          <div style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={() => setModalAddPartVis(true)}>
              新增配件
            </Button>
          </div>
        )}
      />
      <ModalAddPart
        visible={modalAddPartVis}
        onCancel={() => setModalAddPartVis(false)}
        onSubmit={handleSubmitPartAdd}
      />
    </>
  );
};
