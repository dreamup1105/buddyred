import React, { useEffect, useState } from 'react';
import { Select, Form, Tag, Input, message, Popconfirm } from 'antd';
import ProForm, { ModalForm, ProFormText } from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import omit from 'omit.js';
import RemoteSelect from '@/pages/Assets/components/RemoteSelect';
import TagList from './TagList';
import { saveMaintainItemAndDetails } from '../service';
import type { IMaintainItemDetailWithTransformOptions } from '../type';
import { OperationType } from '../type';
import styles from '../index.less';
import useUserInfo from '@/hooks/useUserInfo';
import { TemplateFor } from '../../type';

let newRecordId = 100000;

interface IComponentProps {
  visible: boolean;
  operation: OperationType;
  initialValues:
    | {
        id: number;
        name: string;
        tags?: string[];
        details: IMaintainItemDetailWithTransformOptions[];
      }
    | undefined;
  onSubmit: () => void;
  onCancel: () => void;
}

const genNewRecord = () => ({
  // eslint-disable-next-line no-plusplus
  id: ++newRecordId,
});

const getTitle = (operation: OperationType) => {
  switch (operation) {
    case OperationType.CREATE:
      return '新建';
    case OperationType.EDIT:
      return '编辑';
    case OperationType.VIEW:
      return '详情';
    default:
      return '';
  }
};

const CreateItemForm: React.FC<IComponentProps> = ({
  visible,
  operation,
  initialValues,
  onCancel,
  onSubmit,
}) => {
  const { currentUser } = useUserInfo();
  const isAdmin = currentUser?.user.isAdmin;
  const orgId = currentUser?.org.id;
  const [editableForm] = Form.useForm();
  const readonly = operation === OperationType.VIEW;
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [newRecord, setNewRecord] = useState(genNewRecord());
  const [errLineId, setErrLineId] = useState<number | undefined>();
  const columns: ProColumns<IMaintainItemDetailWithTransformOptions>[] = [
    {
      title: '指标名称',
      dataIndex: 'label',
    },
    {
      title: '组件',
      dataIndex: 'component',
      renderFormItem: () => {
        return (
          <Select placeholder="请选择组件">
            <Select.Option key="select" value="select">
              下拉选择框
            </Select.Option>
            <Select.Option key="input" value="input">
              文本输入框
            </Select.Option>
          </Select>
        );
      },
      render: (_, row) => {
        switch (row.component) {
          case 'select':
            return '下拉选择框';
          case 'input':
            return '文本输入框';
          default:
            return '文本输入框';
        }
      },
    },
    {
      title: '选项',
      dataIndex: 'options',
      width: 350,
      renderFormItem: (_, { isEditable, record }) => {
        const isSelect = record?.component === 'select';
        if (!isSelect) {
          return <Input disabled hidden />;
        }
        return isEditable ? <TagList /> : <Input />;
      },
      render: (_, row) =>
        row?.options?.map((item) => <Tag key={item.key}>{item.label}</Tag>),
    },
    {
      title: '是否多值',
      dataIndex: 'isMultivalue',
      renderFormItem: () => (
        <Select placeholder="请选择">
          <Select.Option key="select" value="1">
            是
          </Select.Option>
          <Select.Option key="input" value="0">
            否
          </Select.Option>
        </Select>
      ),
      render: (isMultivalue) => (isMultivalue === '1' ? '是' : '否'),
    },
    {
      title: '后缀',
      dataIndex: 'spec',
    },
  ];

  if (!readonly) {
    columns.push({
      title: '操作',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          key="delete"
          title="确定要删除该项目吗？"
          okText="确定"
          cancelText="取消"
          onConfirm={() => {
            const details = editableForm.getFieldValue(
              'details',
            ) as IMaintainItemDetailWithTransformOptions[];
            editableForm.setFieldsValue({
              details: details.filter((item) => item.id !== record.id),
            });
          }}
        >
          <a key="delete">删除</a>
        </Popconfirm>,
      ],
    });
  }

  useEffect(() => {
    if (initialValues) {
      editableForm.setFieldsValue({
        ...initialValues,
        tags: initialValues.tags ?? undefined,
        details: initialValues.details.map((detail) => ({
          ...detail,
          isMultivalue: detail.isMultivalue ? '1' : '0',
        })),
      });
    }
  }, [initialValues]);

  return (
    <ModalForm
      title={getTitle(operation)}
      visible={visible}
      form={editableForm}
      modalProps={{
        width: 1300,
        maskClosable: false,
        onCancel: () => {
          editableForm.resetFields();
          setEditableRowKeys([]);
          setErrLineId(undefined);
          onCancel();
        },
      }}
      onKeyDown={() => false}
      submitter={{
        submitButtonProps: {
          style: {
            display: readonly ? 'none' : 'block',
          },
        },
      }}
      onFinish={async (values) => {
        if (editableKeys.length) {
          message.error('存在未保存的数据，请保存或取消后重新进行提交');
          return false;
        }
        if (!values.details) {
          message.error('请添加指标项');
          return false;
        }
        try {
          await saveMaintainItemAndDetails({
            maintainItem: {
              id: initialValues?.id,
              name: values.name,
              orgId: isAdmin ? null : orgId,
              templateFor: isAdmin
                ? TemplateFor.PLATFORM
                : TemplateFor.OTHER_PLATFORM,
            },
            tags: values.tags ?? [],
            maintainItemDetails: values.details?.map(
              (detail: IMaintainItemDetailWithTransformOptions) => {
                return {
                  ...omit(detail, ['index', 'component']),
                  options: detail.options?.map((option) => option.label),
                  id: String(detail.id).length === 6 ? null : detail.id,
                  isMultivalue: (detail.isMultivalue as any) === '1',
                };
              },
            ),
          });
          editableForm.resetFields();
          setEditableRowKeys([]);
          setNewRecord(genNewRecord());
          setErrLineId(undefined);
          onSubmit();
          message.success(initialValues ? '编辑成功' : '新增成功');
          return true;
        } catch (error) {
          console.error(error);
          return false;
        }
      }}
      layout="horizontal"
    >
      <ProForm.Group style={{ width: '100%' }}>
        <ProFormText
          name="name"
          label="名称"
          placeholder="请输入名称"
          rules={[
            {
              required: !readonly,
              message: '名称不能为空',
            },
          ]}
          readonly={readonly}
        />
        <Form.Item name="tags" label="标签">
          <RemoteSelect
            type="biz-item-tag"
            placeholder="请选择"
            style={{ width: '200px' }}
            readonly={readonly}
          />
        </Form.Item>
      </ProForm.Group>
      <ProForm.Item name="details" wrapperCol={{ span: 24 }}>
        <EditableProTable<IMaintainItemDetailWithTransformOptions>
          rowKey="id"
          columns={columns}
          recordCreatorProps={{
            record: newRecord,
            style: {
              display: readonly ? 'none' : '',
              width: '100%',
              margin: '10px 0',
            },
          }}
          rowClassName={(record) =>
            errLineId === record.id ? styles.errorLine : ''
          }
          editable={{
            onSave: async () => {
              setErrLineId(undefined);
              setNewRecord(genNewRecord());
            },
            editableKeys,
            onChange: setEditableRowKeys,
            onlyOneLineEditorAlertMessage: '请先保存当前编辑的行',
            onlyAddOneLineAlertMessage: '请先保存当前编辑的行',
          }}
        />
      </ProForm.Item>
    </ModalForm>
  );
};

export default CreateItemForm;
