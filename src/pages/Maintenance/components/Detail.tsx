import React, { useState } from 'react';
import { Modal, Button, Spin, Alert, Space } from 'antd';
import type { IComponentNode } from '@/pages/Dictionary/Maintenance/Editor/type';
import type { Part } from '@/pages/Repair/type';
import { exportToPDF } from '@/utils/utils';
import { MenuType } from '../type';
import type { ITaskItem } from '../type';
import MaintenanceReport from './MaintenanceReport';

interface IComponentProps {
  taskId: number | undefined;
  visible: boolean;
  loading: boolean;
  menuType: MenuType;
  currentRecord: ITaskItem | undefined;
  parts: Part[];
  componentData: IComponentNode[];
  hasError: boolean;
  onPrint: () => void;
  onCancel: () => void;
}

const DetailModal: React.FC<IComponentProps> = ({
  componentData,
  currentRecord,
  parts,
  visible,
  loading,
  menuType,
  hasError,
  onPrint,
  onCancel,
}) => {
  const [exporting, setExporting] = useState(false);
  const onExportToPDF = async () => {
    try {
      setExporting(true);
      const reportContentDom = document.querySelector(
        '.maintain-report-modal .maintenanceReport',
      );
      const pdf = await exportToPDF(reportContentDom as HTMLElement);
      pdf?.save(`${currentRecord?.taskNo}保养报告.pdf`);
    } catch (error) {
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  const renderFooter = () => {
    return (
      <Space>
        <Button onClick={onExportToPDF} type="primary" loading={exporting}>
          导出到PDF
        </Button>
        {menuType === MenuType.Acceptance_Completed && (
          <Button onClick={onPrint} type="primary">
            打印
          </Button>
        )}
        <Button onClick={onCancel}>关闭</Button>
      </Space>
    );
  };

  return (
    <>
      <Modal
        title="详情"
        width="800px"
        className="maintain-report-modal"
        zIndex={6000}
        visible={visible}
        onCancel={onCancel}
        footer={renderFooter()}
      >
        <Spin spinning={loading}>
          {hasError ? (
            <Alert message="获取模板发生错误" type="error" />
          ) : (
            <MaintenanceReport
              reason={currentRecord?.reason2}
              parts={parts}
              componentData={componentData}
            />
          )}
        </Spin>
      </Modal>
    </>
  );
};

export default DetailModal;
