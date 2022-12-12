import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Row, Col } from 'antd';
import type { EmployeeItem } from '@/pages/Employee/type';
import { phoneRegExp } from '@/utils/utils';
import omit from 'omit.js';
import { saveDepartment } from '../service';
import type { DepartmentDetail } from '../type';
import { OperationType } from '../type';

interface IComponentProps {
  visible: boolean;
  orgId: number | undefined;
  initialValues: DepartmentDetail | undefined; // 表单初始值
  employees: EmployeeItem[]; // 主管下拉框列表
  operation: OperationType; // 操作
  deptParentsPath: string; // 上级部门
  onSubmit: (values: DepartmentDetail, operation: OperationType) => void;
  onCancel: () => void;
}

const { TextArea } = Input;
const { Option } = Select;
const getModalTitle = (operation: OperationType) => {
  switch (operation) {
    case OperationType.CREATE_SUB:
      return '新增下级部门';
    case OperationType.CREATE_SIBLING:
      return '新增同级部门';
    case OperationType.EDIT:
      return '编辑';
    default:
      return '';
  }
};

const CreateDeptForm: React.FC<IComponentProps> = ({
  visible,
  initialValues,
  orgId,
  employees,
  operation,
  deptParentsPath,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const onModalOk = async () => {
    try {
      const values = await form.validateFields();
      const { leader = {} } = values;
      const formData = {
        ...omit(values, ['leader']),
        leaderId: leader.value,
        leaderName: leader.label,
        orgId: operation === OperationType.EDIT ? initialValues!.orgId : orgId,
        id: operation === OperationType.EDIT ? initialValues?.id : undefined,
        parentDepartmentId:
          operation === OperationType.CREATE_SUB
            ? initialValues!.id
            : initialValues?.parentDepartmentId,
      };
      setConfirmLoading(true);

      const { code, data: newDepartment } = await saveDepartment(formData);

      if (code === 0) {
        onSubmit(newDepartment, operation);
      }
    } catch (error) {
      console.error(error);
    } finally {
      form.resetFields();
      setConfirmLoading(false);
    }
  };

  const onModalCancel = async () => {
    form.resetFields();
    onCancel();
  };

  useEffect(() => {
    if (operation === OperationType.EDIT && visible) {
      form.setFieldsValue({
        ...initialValues,
        name:
          operation === OperationType.EDIT
            ? initialValues && initialValues.name
            : '',
        leader: {
          value: initialValues?.leaderId,
          label: initialValues?.leaderName,
          key: initialValues?.leaderId,
        },
      });
    }
  }, [initialValues, operation, visible]);

  return (
    <Modal
      visible={visible}
      title={getModalTitle(operation)}
      okText="保存"
      cancelText="取消"
      confirmLoading={confirmLoading}
      maskClosable={false}
      onOk={onModalOk}
      onCancel={onModalCancel}
      width={650}
      forceRender
    >
      <Form form={form}>
        <Row>
          <Col span={12}>
            <Form.Item
              labelAlign="right"
              label="名称"
              name="name"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              rules={[
                { required: true, message: '请填写名称' },
                { whitespace: true, message: '名称不能只包含空格' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              labelAlign="right"
              label="部门编号"
              name="departmentNo"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item labelAlign="right" label="上级部门">
              <Input value={deptParentsPath} disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={12}>
            <Form.Item
              labelAlign="right"
              label="主管"
              name="leader"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
            >
              <Select labelInValue>
                {employees.map((e) => (
                  <Option key={e.id} value={e.id}>
                    {e.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              labelAlign="right"
              label="电话"
              name="phone"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              rules={[
                { pattern: phoneRegExp, message: '请填写正确的手机号码' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              labelAlign="right"
              label="备注"
              name="description"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
            >
              <TextArea />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateDeptForm;
