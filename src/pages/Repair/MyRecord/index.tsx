import React, { useState } from 'react';
import { Space, Divider } from 'antd';
import ModalDetail from '@/pages/Signature/components/ModalDetail';
import { useModel } from 'umi';
import type { RepairRecord } from '../type';
import { RecordStatus } from '../type';
import RecordList from '../components/RecordList';
import ModalEditRecord from './components/ModalEditRecord';
import RecordDetail from '../components/RecordDetail';

/**
 * 维修工单列表页（维修机构方用户）
 */
const Record: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const otherLoaderParams = initialState &&
    initialState.currentUser && {
      engineerId: initialState.currentUser.employee.id,
    };
  const [listRefreshMark, setListRefreshMark] = useState(0);
  const [modalEditRecordVis, setModalEditRecordVis] = useState(false);
  const [targetEditingRecord, setTargetEditingRecord] =
    useState<RepairRecord>();
  const [modalDetialVis, setModalDetailVis] = useState(false);
  const [detailTarget, setDetailTarget] = useState<RepairRecord>();

  const handleScanRecordDetail = (record: RepairRecord) => {
    setModalDetailVis(true);
    setDetailTarget(record);
  };

  const handleCloseDetailModal = () => {
    setModalDetailVis(false);
  };

  const handleEditRecord = (record: RepairRecord) => {
    setModalEditRecordVis(true);
    setTargetEditingRecord(record);
  };

  const handleCloseModalEditRecord = (refresh = false) => {
    setModalEditRecordVis(false);
    if (refresh === true) {
      setListRefreshMark(listRefreshMark + 1);
    }
  };

  const afterModalEditRecordSubmit = (close = false) => {
    if (close) {
      handleCloseModalEditRecord(true);
    } else {
      setListRefreshMark(listRefreshMark + 1);
    }
  };

  const operationColumn = {
    title: '操作',
    key: 'operation',
    render: (_: any, record: RepairRecord) => {
      return (
        <Space>
          <a onClick={() => handleScanRecordDetail(record)}>详情</a>
          {(({ status }) => {
            if (status === RecordStatus.RECORDING) {
              return [
                <Divider key="d" type="vertical" />,
                <a key="a" onClick={() => handleEditRecord(record)}>
                  填报
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
      otherLoaderParams={otherLoaderParams}
    >
      <ModalEditRecord
        visible={modalEditRecordVis}
        target={targetEditingRecord}
        onCancel={handleCloseModalEditRecord}
        afterSubmit={afterModalEditRecordSubmit}
      />
      <ModalDetail
        title="维修工单补单详情"
        onClose={handleCloseDetailModal}
        visible={modalDetialVis}
      >
        <RecordDetail record={detailTarget} />
      </ModalDetail>
    </RecordList>
  );
};

export default Record;
