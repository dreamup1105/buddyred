import React from 'react';
import { Modal, Result, Button, Descriptions } from 'antd';
import type { IImportTaskItem } from '../type';

interface IComponentProps {
  visible: boolean;
  result: IImportTaskItem | undefined;
  onView: (record: IImportTaskItem) => void;
  onCancel: () => void;
}

const ImportResult: React.FC<IComponentProps> = ({
  visible,
  result,
  onView,
  onCancel,
}) => {
  return (
    <Modal
      title="导入结果"
      visible={visible}
      onCancel={onCancel}
      zIndex={2000}
      footer={
        <>
          <Button key="close" onClick={onCancel}>
            关闭
          </Button>
          <Button key="view" onClick={() => onView(result!)} type="primary">
            查看
          </Button>
        </>
      }
    >
      <Result
        status="success"
        extra={
          <Descriptions bordered column={1}>
            <Descriptions.Item label="文件名称">{result?.fileName}</Descriptions.Item>
            <Descriptions.Item label="文件包含数量">{result?.total}</Descriptions.Item>
            <Descriptions.Item label="导入成功数量">{result?.okNumber}</Descriptions.Item>
            <Descriptions.Item label="导入失败数量">{result?.failedNumber}</Descriptions.Item>
          </Descriptions>
        }
      />
    </Modal>
  );
};

export default ImportResult;
