import React, { useState, useRef } from 'react';
import {
  Button,
  Space,
  Popconfirm,
  message,
  Modal,
  Typography,
  Divider,
} from 'antd';
import { useModel } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import { deleteTeam } from './service';
import type { Team, TeamDetail } from './type';
import { SigStatus, AuthStatus } from './type';
import TeamList from './components/TeamList';
import { ModalEditTeam } from './components/ModalEditTeam';
import Detail from './components/Detail';

const { Text } = Typography;

const notAllowDelStatus = new Map<SigStatus | AuthStatus, boolean>([
  [AuthStatus.AUTH_APPLIED, true],
  [AuthStatus.AUTH_ACCEPTED, true],
  [SigStatus.SIG_ACCEPTED, true],
  [SigStatus.SIG_APPLIED, true],
]);

const TeamManage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');
  /* ModalEditTeam */
  const [editingTeam, setEditingTeam] = useState<Team>();
  const [teamEditModalVisible, setTeamEditModalVisible] =
    useState<boolean>(false);

  /* 详情 */
  const [detailTarget, setDetailTarget] = useState<TeamDetail>();
  const [modalDetailVis, setModalDetailVis] = useState<boolean>();

  const handleCloseTeamEdit = (needRefreshList?: boolean) => {
    setTeamEditModalVisible(false);
    setEditingTeam(undefined);
    if (needRefreshList === true) {
      actionRef.current?.reload();
    }
  };

  /* 创建工程师组 */
  const handleCreateTeam = () => {
    if (!initialState || !initialState.currentUser) {
      message.error('登录信息错误');
      return;
    }
    setEditingTeam({
      name: '新的工程师组',
      orgId: initialState.currentUser.user.orgId,
      orgName: initialState.currentUser.org.name,
      engineers: [],
    });
    setTeamEditModalVisible(true);
  };

  /* 修改工程师组 */
  const handleEditTeam = (team: TeamDetail) => {
    setTeamEditModalVisible(true);
    const {
      id,
      name,
      orgId,
      orgName,
      siteOrgId,
      siteOrgName,
      leaderId,
      authStatus,
      sigStatus,
    } = team;
    setEditingTeam({
      id,
      name,
      orgId,
      orgName,
      siteOrgId,
      siteOrgName,
      leaderId,
      authStatus,
      sigStatus,
      engineers: [],
    });
  };

  /* 删除工程师组 */
  const handleDeleteTeam = async (team: TeamDetail) => {
    try {
      const { code } = await deleteTeam(team.id);
      if (code === 0) {
        actionRef.current?.reload();
        message.success('删除成功');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleScanTeam = (team: TeamDetail) => {
    setDetailTarget(team);
    setModalDetailVis(true);
  };

  const operationContent = (
    <>
      <Button type="primary" onClick={handleCreateTeam}>
        <PlusOutlined />
        新增
      </Button>
    </>
  );

  const operationColumn: ProTableColumn<TeamDetail> = {
    title: '操作',
    key: 'operation',
    hideInSearch: true,
    render: (_: string, record: TeamDetail) => {
      const disabled =
        notAllowDelStatus.has(record.authStatus) ||
        notAllowDelStatus.has(record.sigStatus);
      return (
        <Space>
          <a onClick={() => handleScanTeam(record)}>详情</a>
          <Divider type="vertical" />
          <a onClick={() => handleEditTeam(record)}>修改</a>
          <Divider type="vertical" />
          {disabled ? (
            <Text disabled>删除</Text>
          ) : (
            <Popconfirm
              title="确定要删除该工程师组吗？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => handleDeleteTeam(record)}
            >
              <a>删除</a>
            </Popconfirm>
          )}
        </Space>
      );
    },
  };

  return (
    <>
      <TeamList
        title="工程师分组列表"
        actionRef={actionRef}
        operationContent={operationContent}
        operationColumn={operationColumn}
      />
      <ModalEditTeam
        visible={teamEditModalVisible}
        editingTeam={editingTeam}
        onCancel={handleCloseTeamEdit}
        afterSubmit={() => handleCloseTeamEdit(true)}
      />
      <Modal
        width={1000}
        title="工程师组详情"
        visible={modalDetailVis}
        onCancel={() => setModalDetailVis(false)}
        footer={<Button onClick={() => setModalDetailVis(false)}>关闭</Button>}
      >
        <Detail team={detailTarget} />
      </Modal>
    </>
  );
};

export default TeamManage;
