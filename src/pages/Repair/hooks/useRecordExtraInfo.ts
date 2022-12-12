import type { Equipment } from '@/pages/Signature/type';
import { useState, useCallback } from 'react';
import { fetchAttachments } from '@/services/global';
import { AttachmentCategory } from '@/utils/constants';
import { fetchEquipment } from '../service';
import useParts from './useParts';
import type { RepairRecord } from '../type';

const useRecordExtraInfo = (target?: RepairRecord) => {
  // 设备
  const [equipment, setEquipment] = useState<Equipment>();
  // 附件
  const { parts, loadParts } = useParts();
  // 工单图片
  const [recordPhotos, setRecordPhotos] = useState<Attachment[]>([]);
  // 故障描述图片
  const [errorPhotos, setErrorPhotos] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(false);

  const loadExtraInfo = useCallback(async () => {
    if (
      !target ||
      (typeof target.id !== 'string' && typeof target.id !== 'number')
    )
      return;
    if (target.equipmentId === undefined) return;
    try {
      setLoading(true);
      const {
        data: { equipment: eq },
      } = await fetchEquipment(target.equipmentId);
      await loadParts(target.id);
      const { data: attachments } = await fetchAttachments(target.id);
      const tempRecordPhotos: Attachment[] = [];
      const tempdErrorPhotos: Attachment[] = [];
      setEquipment(eq);
      attachments.forEach((a) => {
        if (a.category === AttachmentCategory.MP_TICKET_PHOTO) {
          tempRecordPhotos.push(a);
        }
        if (a.category === AttachmentCategory.MP_REPAIR_FAILURE) {
          tempdErrorPhotos.push(a);
        }
      });
      setRecordPhotos(tempRecordPhotos);
      setErrorPhotos(tempdErrorPhotos);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [target]);

  return {
    equipment,
    parts: Array.isArray(parts)
      ? parts.map((_, index) => ({ ..._, customIndex: index }))
      : [],
    recordPhotos,
    errorPhotos,
    loading,
    load: loadExtraInfo,
  };
};

export default useRecordExtraInfo;
