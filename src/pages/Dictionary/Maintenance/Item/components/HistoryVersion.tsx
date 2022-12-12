import React, { useEffect, useState } from 'react';
import { Modal, Table, Divider } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { IVersionItem } from '@/pages/Dictionary/Maintenance/Template/type';

interface IComponentProps {
  visible: boolean;
  allHistoryVersions: IVersionItem[];
  mode?: 'select' | 'view';
  onSelect?: (record: IVersionItem) => void;
  onCancel: () => void;
}

const HistoryVersion: React.FC<IComponentProps> = ({
  visible,
  mode = 'view',
  allHistoryVersions,
  onSelect,
  onCancel,
}) => {
  const [current, setCurrent] = useState(1);
  const [versions, setVersions] = useState<IVersionItem[]>([]);
  const onView = (record: IVersionItem) => {
    window.open(
      `//${window.location.host}/dictionary/maintenance/item?versionId=${record.id}`,
    );
  };

  const loadVersions = () => {
    // const start = (current - 1) * 10;
    // setVersions(allHistoryVersions.slice(start, start + 10));
    setVersions(allHistoryVersions);
  };

  const columns: ColumnsType<IVersionItem> = [
    {
      title: '版本号',
      dataIndex: 'verNo',
    },
    {
      title: '版本',
      dataIndex: 'tag',
    },
    {
      title: '最后修改时间',
      dataIndex: 'lastModifiedTime',
    },
    {
      title: '操作',
      render: (_, record) => {
        return (
          <>
            <a key="view" onClick={() => onView(record)}>
              查看
            </a>
            {mode === 'select' ? (
              <>
                <Divider key="divider1" type="vertical" />
                <a key="select" onClick={() => onSelect?.(record)}>
                  选择
                </a>
              </>
            ) : null}
          </>
        );
      },
    },
  ];

  const onPageChange = (page: number) => {
    setCurrent(page);
  };

  useEffect(() => {
    loadVersions();
  }, [current, allHistoryVersions]);

  return (
    <Modal
      title="查看历史版本"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Table
        rowKey="id"
        columns={columns}
        dataSource={versions}
        pagination={{
          onChange: onPageChange,
          pageSize: 10,
          current,
        }}
      />
    </Modal>
  );
};

export default HistoryVersion;
