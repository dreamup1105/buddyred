import React, { useState } from 'react';
import { Modal, Button, Spin, Space } from 'antd';
import { exportToPDF } from '@/utils/utils';
import RepairReport from './RepairReport';
import type { ITaskItem, IRepairReport } from '../type';

interface IComponentProps {
  visible: boolean;
  currentRecord: ITaskItem | undefined;
  detail: IRepairReport | undefined;
  rawImages: string[];
  loading: boolean;
  onCancel: () => void;
}

const Detail: React.FC<IComponentProps> = ({
  visible,
  currentRecord,
  detail,
  rawImages,
  loading,
  onCancel,
}) => {
  const [exporting, setExporting] = useState(false);

  const onExport = async () => {
    if (exporting) {
      return;
    }
    setExporting(true);
    try {
      const reportContentDom = document.querySelector(
        '.repair-report-modal .ant-modal-body',
      );
      const pdf = await exportToPDF(reportContentDom as HTMLElement);
      pdf?.save(`(${currentRecord?.taskNo})维修报告.pdf`);
    } catch (error) {
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <Modal
        className="repair-report-modal"
        visible={visible}
        onCancel={onCancel}
        width="800px"
        closable={false}
        bodyStyle={{ padding: 0 }}
        title={null}
        footer={
          <Space>
            <Button onClick={onExport} type="primary" loading={exporting}>
              导出到PDF
            </Button>
            <Button onClick={onCancel}>关闭</Button>
          </Space>
        }
      >
        <Spin spinning={loading}>
          <RepairReport
            task={currentRecord}
            detail={detail}
            rawImages={rawImages}
          />
        </Spin>
      </Modal>
    </>
  );
};

export default Detail;
