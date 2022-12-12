import React, { useEffect } from 'react';
import useMount from '@/hooks/useMount';
import useEquipmentDetail from '@/pages/Assets/hooks/useEquipmentDetail';
import useAttachmentCategorys from '@/pages/Assets/hooks/useAttachmentCategorys';
import EquipmentDetailModal from '@/pages/Assets/components/Detail';
import { OperationType } from '@/pages/Assets/type';

interface IComponentProps {
  id: number | undefined;
  visible: boolean;
  onCancel: () => void;
}

// 设备详情弹出框组件的上层封装
const Detail: React.FC<IComponentProps> = ({ id, visible, onCancel }) => {
  const {
    equipmentDetail,
    loading,
    timelineItems,
    hispitalLogo,
    clearEquipmentDetail,
    loadTimeline,
    loadEquipmentDetail,
    LoadHistoryLogo,
  } = useEquipmentDetail();
  const {
    attachmentCategorys,
    loadAttachmentCategorys,
  } = useAttachmentCategorys();

  const onModalCancel = () => {
    clearEquipmentDetail();
    onCancel();
  };

  useMount(() => {
    loadAttachmentCategorys();
  });

  useEffect(() => {
    if (id) {
      loadEquipmentDetail(id);
      loadTimeline(id);
      LoadHistoryLogo();
    }
  }, [visible]);

  return (
    <EquipmentDetailModal
      loading={loading}
      visible={visible}
      timelineData={timelineItems}
      operation={OperationType.DETAIL}
      attachmentCategorys={attachmentCategorys}
      initialDetail={equipmentDetail}
      onCancel={onModalCancel}
      hispitalLogo={hispitalLogo}
    />
  );
};

export default Detail;
