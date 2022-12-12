import React, { useState, useEffect } from 'react';
import { message, Input, InputNumber } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { setupGlobalBizParams } from '../../../service';
import type { CustomerDetail, CustomerDetailParams } from '../../../type';

interface IComponentProps {
  initialData: CustomerDetail['params'] | undefined;
}

const ParamsTab: React.FC<IComponentProps> = ({ initialData }) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<CustomerDetailParams[]>([]);
  const columns: ProColumns<CustomerDetailParams>[] = [
    {
      title: 'label',
      key: 'label',
      dataIndex: 'label',
      editable: false,
    },
    {
      title: 'value',
      key: 'val',
      dataIndex: 'val',
      formItemProps: (form, config) => {
        const data = (config as any).entry as CustomerDetailParams;
        if (data.type === 'INT') {
          return {
            rules: [
              {
                type: 'integer',
                message: '请输入整数',
              },
            ],
          };
        }
        return {};
      },
      renderFormItem: (record) => {
        const data = (record as any).entry as CustomerDetailParams;
        if (data.type === 'INT') {
          return <InputNumber />;
        }
        return <Input />;
      },
      render: (val, record) => `${record.val} ${record.unit}`,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
      ],
    },
  ];

  useEffect(() => {
    if (initialData) {
      setDataSource(initialData);
    }
  }, [initialData]);

  return (
    <EditableProTable<CustomerDetailParams>
      rowKey="id"
      columns={columns}
      showHeader={false}
      request={async () => ({
        data: dataSource,
        success: true,
      })}
      recordCreatorProps={false}
      editable={{
        onSave: async (key, record) => {
          try {
            const { code } = await setupGlobalBizParams({
              id: record.id,
              crId: record.crId,
              label: record.label,
              val: record.val,
            });

            if (code === 0) {
              message.success('保存成功');
              return true;
            }

            return Promise.reject(new Error('保存失败！'));
          } catch (error) {
            return Promise.reject(error);
          }
        },
        editableKeys,
        onChange: setEditableRowKeys,
        actionRender: (row, config, defaultDom) => [
          defaultDom.save,
          defaultDom.cancel,
        ],
        onlyOneLineEditorAlertMessage: '请先保存当前编辑的行',
      }}
    />
  );
};

export default ParamsTab;
