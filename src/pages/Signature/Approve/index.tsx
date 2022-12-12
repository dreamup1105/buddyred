import React, { useState, useRef } from 'react';
import { Space, Divider } from 'antd';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import type { TeamDetail } from '@/pages/Team/type';
import { AuthStatus, SigStatus } from '@/pages/Team/type';
import TeamList from '@/pages/Team/components/TeamList';
import ModalAuthApprove from './components/ModalAuthApprove';
import ModalSigApprove from './components/ModalSigApprove';
import ModalDetail from '../components/ModalDetail';
import SigDetail from '../components/SigDetail';

const Signature: React.FC = () => {
  const actionRef = useRef<ActionType>();

  /* 授权审批 */
  const [modalAuthVis, setModalAuthVis] = useState<boolean>(false);
  const [authTarget, setAuthTarget] = useState<TeamDetail>();

  /* 签约审批 */
  const [modalSigVis, setModalSigVis] = useState<boolean>(false);
  const [sigTarget, setSigTarget] = useState<TeamDetail>();

  /* 签约详情 */
  // 授权详情与签约详情重合度较高，不单独分离
  const [modalSigDetailVis, setModalSigDetailVis] = useState<boolean>(false);
  const [sigDetailTarget, setSigDetailTarget] = useState<TeamDetail>();

  const handleApproveAuth = (team: TeamDetail) => {
    setAuthTarget(team);
    setModalAuthVis(true);
  };
  const afterApproveAuth = (refresh = true) => {
    setModalAuthVis(false);
    setAuthTarget(undefined);
    if (refresh) {
      actionRef.current?.reload();
    }
  };

  const handleApproveSig = (team: TeamDetail) => {
    setSigTarget(team);
    setModalSigVis(true);
  };
  const afterApproveSig = (refresh = true) => {
    setModalSigVis(false);
    setSigTarget(undefined);
    if (refresh) {
      actionRef.current?.reload();
    }
  };

  const handleScanSigDetail = (team: TeamDetail) => {
    setSigDetailTarget(team);
    setModalSigDetailVis(true);
  };
  const handleCloseSigDetail = () => {
    setSigDetailTarget(undefined);
    setModalSigDetailVis(false);
  };

  const operationColumn: ProTableColumn<TeamDetail> = {
    title: '操作',
    key: 'operation',
    hideInSearch: true,
    render: (_: any, record: TeamDetail) => {
      return (
        <Space>
          <a onClick={() => handleScanSigDetail(record)}>详情</a>
          {(({ authStatus, sigStatus }) => {
            if (authStatus === AuthStatus.AUTH_APPLIED) {
              return [
                <Divider key="d" type="vertical" />,
                <a key="a" onClick={() => handleApproveAuth(record)}>
                  授权
                </a>,
              ];
            }
            if (sigStatus === SigStatus.SIG_APPLIED) {
              return [
                <Divider key="d" type="vertical" />,
                <a key="a" onClick={() => handleApproveSig(record)}>
                  签约
                </a>,
              ];
            }
            return null;
          })(record)}
        </Space>
      );
    },
  };

  return (
    <>
      <TeamList
        title="审批列表"
        actionRef={actionRef}
        operationColumn={operationColumn}
        isSiteOrg
      />
      <ModalAuthApprove
        visible={modalAuthVis}
        currentTarget={authTarget}
        onClose={() => afterApproveAuth(false)}
        afterSubmit={() => afterApproveAuth()}
      />
      <ModalSigApprove
        visible={modalSigVis}
        currentTarget={sigTarget}
        onClose={() => afterApproveSig(false)}
        afterSubmit={() => afterApproveSig()}
      />
      <ModalDetail
        title="详情"
        visible={modalSigDetailVis}
        onClose={handleCloseSigDetail}
      >
        <SigDetail team={sigDetailTarget} />
      </ModalDetail>
    </>
  );
};

export default Signature;
