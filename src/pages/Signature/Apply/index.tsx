import React, { useState, useRef } from 'react';
import { Space, Divider } from 'antd';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import type { TeamDetail } from '@/pages/Team/type';
import { AuthStatus, SigStatus } from '@/pages/Team/type';
import TeamList from '@/pages/Team/components/TeamList';
import ModalAuthApply from './components/ModalAuthApply';
import ModalSigApply from './components/ModalSigApply';
import ModalDetail from '../components/ModalDetail';
import SigDetail from '../components/SigDetail';

const Signature: React.FC = () => {
  const actionRef = useRef<ActionType>();

  /* 授权申请 */
  const [modalAuthApplyVis, setModalAuthApplyVis] = useState<boolean>(false);
  const [authApplyTarget, setAuthApplyTarget] = useState<TeamDetail>();

  /* 签约申请 */
  const [modalSigApplyVis, setModalSigApplyVis] = useState<boolean>(false);
  const [sigApplyTarget, setSigApplyTarget] = useState<TeamDetail>();

  /* 签约详情 */
  // 授权详情与签约详情重合度较高，不单独分离
  const [modalSigDetailVis, setModalSigDetailVis] = useState<boolean>(false);
  const [sigDetailTarget, setSigDetailTarget] = useState<TeamDetail>();

  const handleApplyAuth = (team: TeamDetail) => {
    setAuthApplyTarget(team);
    setModalAuthApplyVis(true);
  };
  const afterApplyAuth = (refresh = true) => {
    if (refresh) {
      actionRef.current?.reload();
    }
    setModalAuthApplyVis(false);
    setAuthApplyTarget(undefined);
  };

  const handleApplySig = (team: TeamDetail) => {
    setSigApplyTarget(team);
    setModalSigApplyVis(true);
  };
  const afterApplySig = (refresh = true) => {
    if (refresh) {
      actionRef.current?.reload();
    }
    setModalSigApplyVis(false);
    setSigApplyTarget(undefined);
  };

  const handleScanSigDetail = (team: TeamDetail) => {
    setSigDetailTarget(team);
    setModalSigDetailVis(true);
  };
  const handleCloseSigDetail = () => {
    setModalSigDetailVis(false);
    setSigDetailTarget(undefined);
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
            if (authStatus === AuthStatus.AUTH_NONE) {
              return [
                <Divider key="d" type="vertical" />,
                <a key="a" onClick={() => handleApplyAuth(record)}>
                  申请授权
                </a>,
              ];
            }
            if (authStatus === AuthStatus.AUTH_ACCEPTED) {
              if (sigStatus === SigStatus.SIG_NONE) {
                return [
                  <Divider key="d" type="vertical" />,
                  <a key="a" onClick={() => handleApplySig(record)}>
                    申请签约
                  </a>,
                ];
              }
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
        title="申请列表"
        actionRef={actionRef}
        operationColumn={operationColumn}
      />
      <ModalAuthApply
        visible={modalAuthApplyVis}
        currentTarget={authApplyTarget}
        afterSubmit={() => afterApplyAuth()}
        onClose={() => afterApplyAuth(false)}
      />
      <ModalSigApply
        visible={modalSigApplyVis}
        currentTarget={sigApplyTarget}
        afterSubmit={() => afterApplySig()}
        onClose={() => afterApplySig(false)}
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
