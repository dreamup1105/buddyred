import { useEffect, useState } from 'react';
import { batchFetchRawImageUrl } from '@/services/qiniu';
import { AttachmentCategory } from '@/utils/constants';
import { fetchRepairReport } from '../service';
import type { ITaskItem, IRepairReport } from '../type';

export default function useRepairReport(currentRecord: ITaskItem | undefined) {
  const [loading, setLoading] = useState(false);
  const [repairReport, setRepairReport] = useState<IRepairReport | undefined>();
  const [images, setImages] = useState<string[]>([]);

  const loadRepairReport = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const { code, data } = await fetchRepairReport(
        currentRecord!.equipmentId,
        currentRecord!.id,
      );
      if (code === 0) {
        setRepairReport(data);
        const { code: resCode, data: imgData } = await batchFetchRawImageUrl(
          data.simpleAttachmentInfoList
            .filter((e) => e.category === AttachmentCategory.MP_REPAIR_FAILURE)
            .map((item) => item.res),
        );
        if (resCode === 0) {
          setImages(imgData);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentRecord) {
      loadRepairReport();
    } else {
      setRepairReport(undefined);
    }
  }, [currentRecord]);

  return {
    loading,
    images,
    repairReport,
  };
}
