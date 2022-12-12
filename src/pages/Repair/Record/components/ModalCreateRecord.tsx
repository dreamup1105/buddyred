import React, { useState } from 'react';
import { Modal, Form, Select, Input, Row, Col, Table, message } from 'antd';
import find from 'lodash.find';
import type { Equipment } from '@/pages/Signature/type';
import type { Employee } from '@/pages/Internal-Authority/type';
import { fetchEmployees } from '@/pages/Employee/service';
import type { TeamDetail, Teammate } from '@/pages/Team/type';
import { SigStatus } from '@/pages/Team/type';
import { fetchTeammates, fetchTeams } from '@/pages/Team/service';
import { hookDataFetchProvider } from '../../hooks/hookDataFetchProvider';
import { fetchSigEquipments, postRecord } from '../../service';

type ID = number | string;
const useEmployees = hookDataFetchProvider<Employee, string, ID>(
  (page, pageSize, search, otherParams) => {
    return fetchEmployees(
      { orgId: otherParams as number, name: search || '' },
      false,
      page,
      pageSize,
    ) as any;
  },
);
const useTeams = hookDataFetchProvider<TeamDetail, string, ID>(
  (page, pageSize, search, otherParams) => {
    return fetchTeams(
      {
        siteOrgId: otherParams,
        sigStatus: SigStatus.SIG_ACCEPTED,
      },
      page,
      pageSize,
    );
  },
);
const useTeammates = hookDataFetchProvider<Teammate, { crId: ID }>(
  (page, pageSize, search) => {
    if (search === undefined || search.crId === undefined) {
      return Promise.resolve({ data: [], total: 0 });
    }
    return fetchTeammates(search.crId) as any;
  },
);
const useEquipments = hookDataFetchProvider<Equipment, { crId: ID }>(
  (page, pageSize, search) => {
    return fetchSigEquipments(page, pageSize, search.crId);
  },
);

interface ModalCreateRecordProps {
  visible?: boolean;
  orgId: ID;
  orgName: string;
  employeeId: ID;
  employeeName: string;
  onCancel: () => void;
  afterSubmit: () => void;
}
const ModalCreateRecord: React.FC<ModalCreateRecordProps> = ({
  visible = false,
  orgId = '',
  orgName = '',
  employeeId = '',
  employeeName = '',
  onCancel,
  afterSubmit,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState<{ name: string; id: ID }>({
    name: '',
    id: '',
  });
  const { state: employeesState, search: employeesSearcher } = useEmployees(
    orgId,
  );
  const { state: teamsState, search: teamsSearcher } = useTeams(orgId);
  const { state: teammatesState, search: teammatesSearcher } = useTeammates();
  const {
    state: equipmentsState,
    search: equipmentsSearcher,
    changePage: equipmentsPageTo,
  } = useEquipments();

  const handleAfterFormFieldsChange = (changedValues: Record<string, any>) => {
    if (changedValues.crId !== undefined) {
      form.setFieldsValue({ engineerId: undefined });
      teammatesSearcher({ crId: changedValues.crId });
      equipmentsSearcher({ crId: changedValues.crId });
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const {
        crId: tId,
        engineerId,
        initPersonId,
        equipment,
      } = await form.validateFields();
      const team = find(teamsState.data, (_) => _.id === tId) as TeamDetail;
      const engineer = find(
        teammatesState.data,
        (_) => _.employeeId === engineerId,
      ) as Teammate;
      const initPerson = find(
        employeesState.data,
        (_) => _.id === initPersonId,
      ) as Employee;
      await postRecord({
        orgId,
        orgName,
        engineerId,
        initPersonId,
        createdBy: employeeId,
        createdByName: employeeName,
        crId: team.id,
        teamName: team.name,
        equipmentId: equipment.id,
        equipmentName: equipment.name,
        engineerName: engineer.name,
        initPersonName: initPerson.name,
        departmentId: equipment.departmentId,
        departmentName: equipment.departmentName,
      });
      message.success('创建成功');
      afterSubmit();
    } catch (err: any) {
      if (err.errorFields) {
        message.error(
          err.errorFields.map((_: any) => _.errors.join(',')).join(','),
        );
      } else {
        message.error(err.message || err.msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '设备编号',
      dataIndex: 'equipmentNo',
    },
    {
      title: '设备名',
      dataIndex: 'name',
    },
    {
      title: '设备型号',
      dataIndex: 'modelName',
    },
    {
      title: '设备厂商',
      dataIndex: 'manufacturerName',
    },
    {
      title: '设备序列号',
      dataIndex: 'sn',
    },
  ];

  return (
    <Modal
      title="创建维修工单"
      visible={visible}
      width={1000}
      maskClosable={false}
      onCancel={onCancel}
      cancelText="取消"
      okButtonProps={{ disabled: loading }}
      onOk={handleSubmit}
      okText="创建"
    >
      <Form
        labelCol={{ span: 6 }}
        labelAlign="left"
        form={form}
        onValuesChange={handleAfterFormFieldsChange}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="维修工程师组"
              name="crId"
              rules={[{ required: true, message: '请选择一个维修工程师组' }]}
            >
              <Select
                showSearch
                placeholder="工程师组"
                style={{ width: '100%' }}
                filterOption={false}
                loading={teamsState.loading}
                onSearch={teamsSearcher}
                options={teamsState.data.map((_) => ({
                  label: _.name,
                  value: _.id,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="维修工程师"
              name="engineerId"
              rules={[{ required: true, message: '请选择一位维修工程师组' }]}
            >
              <Select
                placeholder="工程师"
                style={{ width: '100%' }}
                filterOption={false}
                loading={teammatesState.loading}
                notFoundContent="请先选择维修工程师组"
                options={teammatesState.data.map((_) => ({
                  label: _.name,
                  value: _.employeeId,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="申请人"
              name="initPersonId"
              rules={[{ required: true, message: '请选择一位申请人' }]}
            >
              <Select
                showSearch
                placeholder="申请人"
                style={{ width: '100%' }}
                filterOption={false}
                loading={employeesState.loading}
                onSearch={employeesSearcher}
                options={employeesState.data.map((_) => ({
                  label: _.name,
                  value: _.id,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="设备所属科室">
              <Input value={department.name} disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="设备" />
          </Col>
          <Col span={24}>
            <Form.Item
              name="equipment"
              labelCol={{ span: 0 }}
              rules={[{ required: true, message: '请选择设备' }]}
            >
              <Table<Equipment>
                rowKey="id"
                dataSource={equipmentsState.data}
                loading={equipmentsState.loading}
                columns={columns}
                rowSelection={{
                  type: 'radio',
                  onChange: (keys, rows) => {
                    const { departmentId, departmentName } = rows[0];
                    form.setFieldsValue({ equipment: rows[0] });
                    setDepartment({ id: departmentId, name: departmentName });
                  },
                }}
                pagination={{
                  current: equipmentsState.page,
                  pageSize: equipmentsState.pageSize,
                  total: equipmentsState.total,
                  onChange: (page) => equipmentsPageTo(page),
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalCreateRecord;
