import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, Input, Spin, message } from 'antd';
import { fetchOrganizations } from '@/pages/Organization/service';
import type { FetchOrganizationsParams } from '@/pages/Organization/type';
import { fetchEmployees } from '@/pages/Employee/service';
import type { PaginationConfig } from '@/components/ListPage';
import { fetchTeammates, postTeam } from '../service';
import type { Team, Teammate, Organization, Engineer } from '../type';
import { OrgType, AuthStatus } from '../type';
import { withItemSelect } from './ItemSelect';
import AntdSelectWrapper from './AntdSelectWrapper';

const defaultPagination: PaginationConfig = {
  current: 1,
  pageSize: 10,
  total: 0,
};

/* 驻点机构（医院）选择器 */
const OrgSelecter = withItemSelect<Organization, string>(
  AntdSelectWrapper,
  defaultPagination,
  (page, pageSize, condition) =>
    fetchOrganizations(-1, -1, {
      name: condition,
      orgType: OrgType.HOSPITAL,
    } as FetchOrganizationsParams),
);

/* 工程师（组员）选择器 */
const EngineersSelecter = withItemSelect<Engineer, string, { orgId?: number }>(
  AntdSelectWrapper,
  defaultPagination,
  (page, pageSize, condition, config) => {
    const params: any = {
      name: condition,
    };
    if (config) {
      params.orgId = config.orgId;
    }
    return fetchEmployees(params, false, -1, -1);
  },
);

interface ModalProps {
  visible: boolean;
  editingTeam?: Team;
  onCancel: () => void;
  afterSubmit?: () => void;
}
export const ModalEditTeam: React.FC<ModalProps> = ({
  visible,
  editingTeam,
  onCancel,
  afterSubmit,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [es, setEs] = useState<Engineer[]>([]);

  /* 加载工程师组成员 */
  const loadTeammates = async (crId: string | number) => {
    let teamates: Teammate[] = [];
    try {
      const { data } = await fetchTeammates(Number(crId));
      teamates = data;
    } catch (err) {
      console.error(err);
    }
    return teamates;
  };

  const handleClose = () => {
    onCancel();
    form.resetFields();
  };

  const handleSubmit = async () => {
    if (!editingTeam) return;
    setLoading(true);
    try {
      const { name, leaderId, siteOrg, engineers } =
        await form.validateFields();
      const { id, orgId, orgName } = editingTeam;
      let leaderName = '';
      for (let i = 0, l = engineers.length; i < l; i += 1) {
        if (engineers[i].id === leaderId) {
          leaderName = engineers[i].name;
        }
      }
      const team: Team = {
        id,
        name,
        leaderId,
        leaderName,
        orgId,
        orgName,
        siteOrgId: siteOrg[0].id,
        siteOrgName: siteOrg[0].name,
        engineers: engineers.map((_: any) => ({
          employeeId: _.id,
          name: _.name,
          phone: _.phone,
        })),
      };
      await postTeam(team);
      if (afterSubmit) {
        afterSubmit();
      }
      message.success(`工程师组${id ? '修改' : '创建'}成功`);
      form.resetFields();
    } catch (err) {
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

  /* 组负责人选择 */
  const selectLeaderOptions = es.map((_: Engineer) => ({
    value: _.id,
    label: _.name,
  }));

  /* 初始化表单数据 */
  useEffect(() => {
    if (!visible) return;
    async function init() {
      if (!editingTeam) return;
      const { id, name, orgName, siteOrgId, siteOrgName, leaderId } =
        editingTeam;
      if (id) {
        setLoading(true);
        try {
          const teamates = await loadTeammates(id);
          const eg = teamates.map((_) => ({ ..._, id: _.employeeId }));
          form.setFieldsValue({
            name,
            orgName,
            leaderId,
            siteOrg: [{ name: siteOrgName, id: siteOrgId }],
            engineers: eg,
          });
          setEs(eg);
        } catch (err) {
          message.error(err.message);
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        form.setFieldsValue({
          name,
          orgName,
        });
      }
    }
    init();
  }, [visible, editingTeam, form]);

  return (
    <Modal
      title={editingTeam && editingTeam.id ? '修改工程师组' : '创建工程师组'}
      visible={visible}
      width={400}
      onCancel={handleClose}
      maskClosable={false}
      cancelText="取消"
      okText="确认"
      destroyOnClose
      okButtonProps={{ disabled: loading, onClick: handleSubmit }}
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onValuesChange={(values) => {
            if (values.engineers) {
              setEs(values.engineers);
            }
          }}
        >
          <Form.Item
            name="name"
            label="组名"
            rules={[{ required: true, message: '请填写组名' }]}
          >
            <Input
              disabled={((t) => {
                if (!t) return false;
                if (t.authStatus === undefined) return false;
                if (t.authStatus === AuthStatus.AUTH_NONE) return false;
                return true;
              })(editingTeam)}
            />
          </Form.Item>
          <Form.Item name="orgName" label="维修机构">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="驻点机构"
            name="siteOrg"
            rules={[{ required: true, message: '请选择驻点机构' }]}
          >
            <OrgSelecter
              width={350}
              searchPlaceholder="输入机构名搜索"
              nameKey="name"
              valueKey="id"
              singleSelect
              disabled={((t) => {
                if (!t) return false;
                if (t.authStatus === undefined) return false;
                if (t.authStatus === AuthStatus.AUTH_NONE) return false;
                return true;
              })(editingTeam)}
            />
          </Form.Item>
          <Form.Item
            label="组成员"
            name="engineers"
            rules={[{ required: true, message: '请选择至少一个组成员' }]}
          >
            <EngineersSelecter
              width={350}
              searchPlaceholder="输入人名搜索"
              nameKey="name"
              valueKey="id"
              loaderConfig={
                editingTeam ? { orgId: Number(editingTeam.orgId) } : undefined
              }
            />
          </Form.Item>
          <Form.Item
            label="组负责人"
            name="leaderId"
            rules={[{ required: true, message: '请选择组负责人' }]}
          >
            <Select
              notFoundContent="请先选择组成员"
              options={selectLeaderOptions}
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
