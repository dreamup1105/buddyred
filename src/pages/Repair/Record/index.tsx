import React, { useState } from 'react';
import { Space, Divider, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import ModalDetail from '@/pages/Signature/components/ModalDetail';
import type { RepairRecord } from '../type';
import { RecordStatus } from '../type';
import RecordList from '../components/RecordList';
import ModalCreateRecord from './components/ModalCreateRecord';
import RecordDetail from '../components/RecordDetail';
import ModalRecordApprove from './components/ModalRecordApprove';

/**
 * 维修工单列表页（医院方用户）
 */
const Record: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [listRefreshMark, setListRefreshMark] = useState(0);
  const [modalCreateRecordVis, setModalCreateRecordVis] = useState(false);
  const [detailTarget, setDetailTarget] = useState<RepairRecord>();
  const [modalDetailVis, setModalDetailVis] = useState(false);
  const [modalRecordApproveVis, setModalRecordApproveVis] = useState(false);
  const [approveTarget, setApproveTarget] = useState<RepairRecord>();
  const { orgId, orgName, employeeId, employeeName } = (() => {
    if (!initialState || !initialState.currentUser) {
      return {
        orgId: undefined,
        orgName: '',
        employeeId: '',
        employeeName: '',
      };
    }
    const { org, employee } = initialState.currentUser;
    return {
      orgId: org.id,
      orgName: org.name,
      employeeId: employee.id,
      employeeName: employee.name,
    };
  })();
  const otherLoaderParams = orgId
    ? {
        orgId: [orgId],
        createdBy: employeeId,
      }
    : undefined;

  const handleScanRecordDetail = (record: RepairRecord) => {
    setDetailTarget(record);
    setModalDetailVis(true);
  };

  const handleApproveRecord = (record: RepairRecord) => {
    setApproveTarget(record);
    setModalRecordApproveVis(true);
  };

  const handleCreateRecord = () => {
    setModalCreateRecordVis(true);
  };
  const handleCloseModalCreateRecord = (refresh = false) => {
    setModalCreateRecordVis(false);
    if (refresh) {
      setListRefreshMark(listRefreshMark + 1);
    }
  };

  const operationContent = (
    <>
      <Button type="primary" onClick={handleCreateRecord}>
        <PlusOutlined />
        新增
      </Button>
    </>
  );

  const operationColumn = {
    title: '操作',
    key: 'operation',
    render: (_: any, record: RepairRecord) => {
      return (
        <Space>
          <a onClick={() => handleScanRecordDetail(record)}>详情</a>
          {(({ status }) => {
            if (status === RecordStatus.PENDING_RECORD) {
              return [
                <Divider key="d" type="vertical" />,
                <a key="a" onClick={() => handleApproveRecord(record)}>
                  审批
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
    <RecordList
      title="维修工单列表"
      listRefreshMark={listRefreshMark}
      operationColumn={operationColumn}
      operationContent={operationContent}
      otherLoaderParams={otherLoaderParams}
    >
      <ModalCreateRecord
        visible={modalCreateRecordVis}
        orgId={orgId || ''}
        orgName={orgName}
        employeeId={employeeId}
        employeeName={employeeName}
        onCancel={handleCloseModalCreateRecord}
        afterSubmit={() => handleCloseModalCreateRecord(true)}
      />
      <ModalDetail
        visible={modalDetailVis}
        onClose={() => setModalDetailVis(false)}
      >
        <RecordDetail record={detailTarget} />
      </ModalDetail>
      <ModalRecordApprove
        visible={modalRecordApproveVis}
        record={approveTarget}
        onClose={() => setModalRecordApproveVis(false)}
        afterSubmit={() => setListRefreshMark(listRefreshMark + 1)}
      />
    </RecordList>
  );
};

export default Record;
