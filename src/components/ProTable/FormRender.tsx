import React, { useMemo } from 'react';
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Space,
  Button,
  InputNumber,
} from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import type { FormInstance, FormProps } from 'antd/es/form';
import type {
  ProTableColumn,
  ActionRef,
  ActionType,
  RenderFormFunc,
} from './type';

interface IComponentProps<T> {
  columns: ProTableColumn<T>[];
  form: FormInstance<any>;
  loading: boolean;
  formProps?: FormProps;
  collapsed?: boolean;
  actionRef?: ActionRef;
  isSyncToUrl?: boolean;
  pagination?: boolean | undefined;
  renderForm?: RenderFormFunc;
  onClickCollapse?: () => void;
  onFormValuesChange?: (changedValues: any, values: any) => void;
  onSearch?: () => void;
}

const getBaseComponent = (column: ProTableColumn<any>) => {
  switch (column.valueType) {
    case 'text':
      return <Input placeholder="请输入" />;
    case 'select':
      return (
        <Select options={column.valueOptions || []} placeholder="请选择" />
      );
    default:
      return <Input placeholder="请输入" />;
  }
};

const FormRender = <T extends Record<string, any>>({
  columns,
  form,
  loading,
  formProps,
  collapsed,
  actionRef,
  isSyncToUrl,
  pagination,
  renderForm,
  onClickCollapse,
  onFormValuesChange,
  onSearch,
}: IComponentProps<T>) => {
  const formItems = useMemo(
    () =>
      columns
        .map((column) => {
          if (column.hideInSearch) {
            return null;
          }
          const label = column.title;
          const name = column.dataIndex as string;
          const component = column.renderFormItem
            ? column.renderFormItem(form)
            : getBaseComponent(column);

          return (
            <Form.Item key={name} label={label} name={name}>
              {component}
            </Form.Item>
          );
        })
        .filter(Boolean),
    [columns],
  );
  const renderFormWithLayout = () => {
    const formItemsLength = formItems.length;
    const isIntegerRowCount = formItemsLength % 4 === 0;
    const lastRowCount = formItemsLength % 4;
    const searchSpan = isIntegerRowCount ? 24 : (4 - lastRowCount) * 6;
    const collapsedFormItems = formItems.slice(0, 2);
    return (
      <>
        <div style={{ display: collapsed ? 'block' : 'none' }}>
          <Row gutter={16}>
            {collapsedFormItems.map((formItem) => (
              <Col span={6} key={formItem?.key}>
                {formItem}
              </Col>
            ))}
            <Col span={4}>
              <Space>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    搜索
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button
                    onClick={() => (actionRef?.current as ActionType)?.reset()}
                  >
                    重置
                  </Button>
                </Form.Item>
              </Space>
            </Col>
            <Col
              span={20 - collapsedFormItems.length * 6}
              style={{ textAlign: 'right' }}
            >
              {formItemsLength > 2 && (
                <a onClick={onClickCollapse}>
                  更多搜索
                  <DownOutlined />
                </a>
              )}
            </Col>
          </Row>
        </div>
        <div style={{ display: !collapsed ? 'block' : 'none' }}>
          <Row gutter={16} style={{ marginBottom: 20 }}>
            <Col span={24} style={{ textAlign: 'right' }}>
              <a onClick={onClickCollapse}>
                收起
                <UpOutlined />
              </a>
            </Col>
          </Row>
          <Row gutter={16}>
            {formItems.map((formItem) => (
              <Col key={formItem?.key} span={6}>
                {formItem}
              </Col>
            ))}
            <Col span={searchSpan} style={{ textAlign: 'right' }}>
              <Space>
                <Form.Item>
                  <Button
                    onClick={() => (actionRef?.current as ActionType)?.reset()}
                  >
                    重置
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    查询
                  </Button>
                </Form.Item>
              </Space>
            </Col>
          </Row>
        </div>
      </>
    );
  };

  return (
    <Form
      form={form}
      {...formProps}
      onValuesChange={onFormValuesChange}
      onFinish={() => {
        onSearch?.();
      }}
    >
      {
        // eslint-disable-next-line no-nested-ternary
        formItems.length
          ? renderForm &&
            onClickCollapse &&
            onSearch &&
            typeof collapsed === 'boolean'
            ? renderForm({ collapsed, loading, onClickCollapse, onSearch })
            : renderFormWithLayout()
          : null
      }
      {!isSyncToUrl && pagination !== false && (
        <>
          <Form.Item hidden name="current">
            <InputNumber />
          </Form.Item>
          <Form.Item hidden name="pageSize">
            <InputNumber />
          </Form.Item>
        </>
      )}
    </Form>
  );
};

export default FormRender;
