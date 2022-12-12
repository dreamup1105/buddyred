import React, { useRef, useState } from 'react';
import { Modal, Button } from 'antd';
import ProTable from '@/components/ProTable';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import { Divider } from 'antd';
import type {
  IMaintainItemWithVersion,
  IMaintainItemDetailWithVersion,
} from '../type';
import ItemDetailsModal from './ItemDetailsModal';
// import useUserInfo from '@/hooks/useUserInfo';
import { TemplateFor } from '../../type';

interface IComponentProps {
  visible: boolean;
  initialItemList: IMaintainItemWithVersion[];
  templateForItemList: IMaintainItemWithVersion[];
  onSelect: (selectedItem: IMaintainItemWithVersion) => void;
  onCancel: () => void;
}

const filterMaintainItem = (name: string, item: IMaintainItemWithVersion) => {
  if (!name) {
    return true;
  }
  if (name) {
    return item.name.includes(name);
  }

  return false;
};

/**
 * 保养项目选择框
 * @param IComponentProps
 * @returns ReactNode
 */
const MaintainItemsModal: React.FC<IComponentProps> = ({
  visible,
  initialItemList = [],
  templateForItemList = [],
  onCancel,
  onSelect,
}) => {
  // const { currentUser } = useUserInfo();
  // const isAdmin = currentUser?.user.isAdmin;
  const [detailsModalVisible, setDetailsModalVisible] = useState<boolean>(
    false,
  );
  const [details, setDetails] = useState<IMaintainItemDetailWithVersion[]>([]);
  const actionRef = useRef<ActionType>();

  const onViewDetail = (record: IMaintainItemWithVersion) => {
    setDetails(record.details);
    console.log(record);
    setDetailsModalVisible(true);
  };

  const onSelectDetail = (record: IMaintainItemWithVersion) => {
    onSelect(record);
    actionRef.current?.reset();
    setDetailsModalVisible(false);
  };

  const columns: ProTableColumn<IMaintainItemWithVersion>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '操作',
      hideInSearch: true,
      render: (_, record) => [
        <a key="details" onClick={() => onViewDetail(record)}>
          详情
        </a>,
        <Divider key="divider1" type="vertical" />,
        <a key="insert" onClick={() => onSelectDetail(record)}>
          选择
        </a>,
      ],
    },
  ];

  /**
   * 添加筛选类型，医院和工程师可以选择查看本机构或者平台的模板
   * 查看平台的模版时，只能查看，无编辑删除权限
   * 平台模板只有平台有权限编辑删除
   */
  // 选择平台模板时，因为本机构模板和平台模板版本会不一致，会导致app端保养项出现问题，故先取消选择平台模板
  // if (!isAdmin) {
  //   const typeColumn = {
  //     title: '所属机构',
  //     dataIndex: 'templateFor',
  //     key: 'templateFor',
  //     hideInTable: true,
  //     renderFormItem: () => (
  //       <Radio.Group defaultValue={TemplateFor.OTHER_PLATFORM}>
  //         <Radio value={TemplateFor.OTHER_PLATFORM}>本机构</Radio>
  //         <Radio value={TemplateFor.PLATFORM}>平台</Radio>
  //       </Radio.Group>
  //     ),
  //   };
  //   columns.splice(1, 0, typeColumn);
  // }

  const onModalCancel = () => {
    onCancel();
    actionRef.current?.reset();
  };

  return (
    <Modal
      title="选择保养项"
      bodyStyle={{
        height: 600,
        overflow: 'scroll',
      }}
      visible={visible}
      onCancel={onModalCancel}
      width={1200}
      footer={
        <Button key="close" onClick={onModalCancel}>
          关闭
        </Button>
      }
    >
      <ProTable<IMaintainItemWithVersion, any>
        rowKey="id"
        columns={columns}
        actionRef={actionRef}
        tableProps={{
          scroll: {
            y: 324,
          },
        }}
        request={async (query) => {
          const { name, current = 1, pageSize = 30, templateFor } = query;
          let newItems: any = [];
          if (!templateFor || templateFor == TemplateFor.OTHER_PLATFORM) {
            newItems = initialItemList.filter((item) =>
              filterMaintainItem(name, item),
            );
          } else {
            newItems = templateForItemList.filter((item) =>
              filterMaintainItem(name, item),
            );
          }
          const start = ((Number(current) || 1) - 1) * (Number(pageSize) || 30);
          const end = start + (Number(pageSize) || 30);
          return {
            data: newItems.slice(start, end),
            total: newItems.length,
            success: true,
          };
        }}
        hooks={{
          onFormValuesChange: () => {
            actionRef.current?.reload();
          },
        }}
        onRow={(record) => ({
          onDoubleClick: () => onSelectDetail(record),
        })}
        isSyncToUrl={false}
        toolBarRender={false}
      />
      <ItemDetailsModal
        visible={detailsModalVisible}
        details={details}
        onCancel={() => {
          setDetailsModalVisible(false);
          setDetails([]);
        }}
      />
    </Modal>
  );
};

export default MaintainItemsModal;
